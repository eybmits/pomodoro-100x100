import { FormEvent, useMemo, useState, type Dispatch } from "react";
import { Link } from "react-router-dom";
import type { AppAction } from "../state/reducer";
import { MAX_SKILLS, TARGET_SESSIONS, type AppState } from "../types";
import { formatSeconds } from "../utils/time";

interface DashboardPageProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export function DashboardPage({ state, dispatch }: DashboardPageProps) {
  const [newSkillTitle, setNewSkillTitle] = useState("");

  const mapStats = useMemo(() => {
    const trackedSessions = state.skills.reduce(
      (sum, skill) => sum + Math.min(skill.completedSessions, TARGET_SESSIONS),
      0
    );
    const completedSkills = state.skills.filter(
      (skill) => skill.completedSessions >= TARGET_SESSIONS
    ).length;

    return {
      trackedSessions,
      completedSkills,
      mappedSkills: state.skills.length,
      mappedPercent: (state.skills.length / MAX_SKILLS) * 100,
      overallTarget: MAX_SKILLS * TARGET_SESSIONS,
      overallPercent: (trackedSessions / (MAX_SKILLS * TARGET_SESSIONS)) * 100
    };
  }, [state.skills]);

  const activeSkill = useMemo(
    () => state.skills.find((skill) => skill.id === state.timer.activeSkillId) ?? null,
    [state.skills, state.timer.activeSkillId]
  );

  const skillSlots = useMemo(
    () => Array.from({ length: MAX_SKILLS }, (_, index) => state.skills[index] ?? null),
    [state.skills]
  );

  const selectedSkillId = state.timer.activeSkillId ?? "";
  const canStartTimer = state.timer.phase === "break" || Boolean(state.timer.activeSkillId);
  const openSlots = MAX_SKILLS - state.skills.length;
  const activeSkillSessions = activeSkill?.completedSessions ?? 0;
  const activeSkillPercent = activeSkill
    ? Math.min(100, (activeSkillSessions / TARGET_SESSIONS) * 100)
    : 0;
  const timerStatusCopy = state.timer.isRunning
    ? state.timer.phase === "focus"
      ? "Focus session in progress"
      : "Break in progress"
    : state.timer.phase === "focus"
      ? "Ready for the next block"
      : "Break is ready";

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "addSkill", title: newSkillTitle });
    setNewSkillTitle("");
  }

  return (
    <main className="shell app-shell">
      <div className="app-meta-nav">
        <div className="lp-mark app-meta-mark">
          <span className="lp-mark-dot" aria-hidden />
          100x100 Tracker
        </div>
        <Link to="/" className="app-back-link">
          Back to Landing
        </Link>
      </div>

      <section className="dashboard-layout">
        <section className="card skill-manager skill-manager-strong dashboard-skills skill-atlas">
          <div className="section-heading dashboard-heading">
            <div>
              <p className="eyebrow">Map</p>
              <h1>100 Skills Map</h1>
              <p className="section-copy">100 visible slots for 100 skills.</p>
            </div>

            <div className="dashboard-chip-row">
              <span className="detail-meta-inline">{mapStats.mappedSkills} / 100 mapped</span>
              <span className="detail-meta-inline">{mapStats.completedSkills} complete</span>
            </div>
          </div>

          <div className="skill-atlas-summary">
            <div className="skill-atlas-summary-copy">
              <p className="section-label">Coverage</p>
              <strong>
                {mapStats.mappedSkills} / {MAX_SKILLS} skills
              </strong>
              <span>{openSlots} open slots</span>
            </div>

            <div className="progress-track progress-track-lg" aria-hidden>
              <div className="progress-fill" style={{ width: `${mapStats.mappedPercent}%` }} />
            </div>
          </div>

          <form onSubmit={handleAddSkill} className="add-skill-form">
            <input
              value={newSkillTitle}
              onChange={(event) => setNewSkillTitle(event.target.value)}
              placeholder="Add the next skill or project"
              aria-label="New skill"
              maxLength={120}
            />
            <button type="submit" disabled={state.skills.length >= MAX_SKILLS}>
              Add
            </button>
          </form>

          <div className="skill-atlas-grid">
            {skillSlots.map((skill, index) => {
              const slotLabel = String(index + 1).padStart(2, "0");

              if (!skill) {
                return (
                  <article key={`empty-${slotLabel}`} className="skill-slot skill-slot-empty">
                    <p className="skill-slot-number">{slotLabel}</p>
                    <strong className="skill-slot-title">Empty</strong>
                    <span className="skill-slot-meta">Open slot</span>
                  </article>
                );
              }

              const percent = Math.min(100, (skill.completedSessions / TARGET_SESSIONS) * 100);
              const isActive = state.timer.activeSkillId === skill.id;
              const remainingSessions = Math.max(0, TARGET_SESSIONS - skill.completedSessions);
              const statusLabel = isActive
                ? "Current"
                : skill.completedSessions >= TARGET_SESSIONS
                  ? "Done"
                  : `${remainingSessions} left`;

              return (
                <article
                  key={skill.id}
                  className={`skill-slot${isActive ? " is-active" : ""}${skill.completedSessions >= TARGET_SESSIONS ? " is-complete" : ""}`}
                >
                  <Link to={`/app/skill/${skill.id}`} className="skill-slot-link">
                    <div className="skill-slot-top">
                      <p className="skill-slot-number">{slotLabel}</p>
                      <span className={isActive ? "active-pill" : "skill-card-chip"}>
                        {statusLabel}
                      </span>
                    </div>

                    <strong className="skill-slot-title">{skill.title}</strong>
                    <p className="skill-slot-total">
                      {skill.completedSessions} / {TARGET_SESSIONS} sessions
                    </p>

                    <div className="progress-track skill-slot-progress" aria-hidden>
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </Link>

                  <button
                    type="button"
                    className="ghost skill-slot-select"
                    disabled={isActive}
                    onClick={() => dispatch({ type: "setActiveSkill", skillId: skill.id })}
                  >
                    {isActive ? "Selected" : "Select"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="dashboard-side">
          <section className="card focus-summary focus-summary-strong">
            <div className="section-heading">
              <div>
                <p className="section-label">Selected Skill</p>
                <h2>{activeSkill?.title ?? "Select a skill"}</h2>
                <p className="section-copy">
                  {activeSkill ? "Sessions, notes, timer." : "Choose one from the map."}
                </p>
              </div>

              {activeSkill ? (
                <Link to={`/app/skill/${activeSkill.id}`} className="inline-link">
                  Open page
                </Link>
              ) : null}
            </div>

            <div className="focus-progress-head">
              <span>
                {activeSkill
                  ? `${activeSkillSessions} / ${TARGET_SESSIONS} sessions`
                  : `${mapStats.mappedSkills} / ${MAX_SKILLS} mapped`}
              </span>
              <strong>{activeSkill ? `${Math.round(activeSkillPercent)}%` : `${Math.round(mapStats.mappedPercent)}%`}</strong>
            </div>

            <div className="progress-track progress-track-lg" aria-hidden>
              <div
                className="progress-fill"
                style={{ width: `${activeSkill ? activeSkillPercent : mapStats.mappedPercent}%` }}
              />
            </div>

            <div className="focus-summary-stats">
              <article>
                <p>Mapped</p>
                <strong>{mapStats.mappedSkills}</strong>
              </article>
              <article>
                <p>Done</p>
                <strong>{mapStats.completedSkills}</strong>
              </article>
              <article>
                <p>Open</p>
                <strong>{openSlots}</strong>
              </article>
            </div>

            <div className="tracker-summary-grid">
              <article>
                <p>Total Sessions</p>
                <strong>{mapStats.trackedSessions}</strong>
                <span>Across all skills.</span>
              </article>
              <article>
                <p>100x100</p>
                <strong>{Math.round(mapStats.overallPercent)}%</strong>
                <span>
                  {mapStats.trackedSessions} / {mapStats.overallTarget}
                </span>
              </article>
            </div>

            {activeSkill ? (
              <div className="inline-actions focus-quick-actions">
                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    dispatch({
                      type: "adjustSkillSessions",
                      skillId: activeSkill.id,
                      delta: -1
                    })
                  }
                >
                  -1 Session
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() =>
                    dispatch({
                      type: "adjustSkillSessions",
                      skillId: activeSkill.id,
                      delta: 1
                    })
                  }
                >
                  +1 Session
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => dispatch({ type: "deleteSkill", skillId: activeSkill.id })}
                >
                  Remove skill
                </button>
              </div>
            ) : null}
          </section>

          <section className="card timer-panel timer-panel-strong">
            <div className="timer-header">
              <div>
                <p className="section-label">Pomodoro Timer</p>
                <strong>{activeSkill?.title ?? "Select a skill to begin"}</strong>
              </div>
              <span className={`phase-badge ${state.timer.phase}`}>
                {state.timer.phase === "focus" ? "Focus" : "Break"}
              </span>
            </div>

            <p className="timer-status">{timerStatusCopy}</p>

            <label htmlFor="active-skill">Active skill</label>
            <select
              id="active-skill"
              value={selectedSkillId}
              onChange={(event) =>
                dispatch({
                  type: "setActiveSkill",
                  skillId: event.target.value || null
                })
              }
            >
              <option value="">Select a skill</option>
              {state.skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.title}
                </option>
              ))}
            </select>

            <p className="timer-clock" aria-live="polite">
              {formatSeconds(state.timer.remainingSec)}
            </p>

            <div className="timer-actions">
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: state.timer.isRunning ? "timerPause" : "timerStart"
                  })
                }
                disabled={!state.timer.isRunning && !canStartTimer}
              >
                {state.timer.isRunning ? "Pause" : "Start"}
              </button>

              <button
                type="button"
                className="ghost"
                onClick={() => dispatch({ type: "timerReset" })}
              >
                Reset
              </button>
            </div>

            <div className="timer-meta-grid">
              <article>
                <p>Mode</p>
                <strong>{state.timer.phase === "focus" ? "25m Focus" : "5m Break"}</strong>
              </article>
              <article>
                <p>Attached To</p>
                <strong>{activeSkill?.title ?? "None"}</strong>
              </article>
              <article>
                <p>On This Skill</p>
                <strong>{activeSkill ? `${activeSkill.completedSessions} done` : "0 done"}</strong>
              </article>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
