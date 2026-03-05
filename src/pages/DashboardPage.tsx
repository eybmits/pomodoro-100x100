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

  const globalStats = useMemo(() => {
    const trackedSessions = state.skills.reduce(
      (sum, skill) => sum + Math.min(skill.completedSessions, TARGET_SESSIONS),
      0
    );
    const globalTarget = TARGET_SESSIONS * MAX_SKILLS;
    const globalPercent = (trackedSessions / globalTarget) * 100;
    const completedSkills = state.skills.filter(
      (skill) => skill.completedSessions >= TARGET_SESSIONS
    ).length;

    return {
      trackedSessions,
      globalTarget,
      globalPercent,
      completedSkills
    };
  }, [state.skills]);

  const activeSkill = useMemo(
    () => state.skills.find((skill) => skill.id === state.timer.activeSkillId) ?? null,
    [state.skills, state.timer.activeSkillId]
  );

  const leadingSkills = useMemo(
    () =>
      [...state.skills]
        .sort((left, right) => right.completedSessions - left.completedSessions)
        .slice(0, 3),
    [state.skills]
  );

  const selectedSkillId = state.timer.activeSkillId ?? "";
  const canStartTimer = state.timer.phase === "break" || Boolean(state.timer.activeSkillId);
  const openSlots = MAX_SKILLS - state.skills.length;
  const activeSkillPercent = activeSkill
    ? Math.min(100, (activeSkill.completedSessions / TARGET_SESSIONS) * 100)
    : 0;
  const averageSessionsPerSkill =
    state.skills.length === 0 ? 0 : Math.round(globalStats.trackedSessions / state.skills.length);
  const timerStatusCopy = state.timer.isRunning
    ? state.timer.phase === "focus"
      ? "Session in progress"
      : "Break in progress"
    : state.timer.phase === "focus"
      ? "Ready for focused work"
      : "Break is ready to begin";

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "addSkill", title: newSkillTitle });
    setNewSkillTitle("");
  }

  return (
    <main className="shell app-shell">
      <div className="app-meta-nav">
        <Link to="/" className="app-back-link">
          Back to Motivation
        </Link>
      </div>

      <section className="hero card app-hero">
        <div className="app-hero-copy">
          <p className="eyebrow">100x100 Pomodoro</p>
          <h1>Build competence through focused repetition.</h1>
          <p className="lede">
            Pick up to 100 skills, invest 100 Pomodoro sessions in each, and track progress with
            simple daily consistency.
          </p>

          <div className="app-hero-chips">
            <span>
              {state.skills.length === 0
                ? "Start with one skill that deserves deliberate repetition."
                : `${openSlots} open skill slots remain in your roster.`}
            </span>
            <span>
              {activeSkill
                ? `${TARGET_SESSIONS - activeSkill.completedSessions} sessions left for ${activeSkill.title}.`
                : "Choose an active skill to make the next block count."}
            </span>
          </div>
        </div>

        <div className="app-hero-rail">
          <article className="app-spotlight">
            <p>Current Focus</p>
            <strong>{activeSkill ? activeSkill.title : "Pick your next craft"}</strong>
            <span>
              {activeSkill
                ? `${activeSkill.completedSessions} / ${TARGET_SESSIONS} sessions`
                : "No active skill selected yet."}
            </span>
            <div className="progress-track" aria-hidden>
              <div className="progress-fill" style={{ width: `${activeSkillPercent}%` }} />
            </div>
          </article>

          <div className="app-hero-mini-grid">
            <article className="app-hero-mini-card">
              <p>Average Depth</p>
              <strong>{averageSessionsPerSkill}</strong>
              <span>sessions per tracked skill</span>
            </article>

            <article className="app-hero-mini-card">
              <p>Leading Edge</p>
              <strong>{leadingSkills[0]?.title ?? "No skills yet"}</strong>
              <span>
                {leadingSkills[0]
                  ? `${leadingSkills[0].completedSessions} sessions logged`
                  : "Add your first deliberate practice area."}
              </span>
            </article>
          </div>
        </div>
      </section>

      <section className="stats-grid app-stats-grid">
        <article className="card stat">
          <p>Total Progress</p>
          <strong>
            {globalStats.trackedSessions} / {globalStats.globalTarget}
          </strong>
          <div className="progress-track" aria-hidden>
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, globalStats.globalPercent)}%` }}
            />
          </div>
        </article>

        <article className="card stat">
          <p>Skills Completed</p>
          <strong>
            {globalStats.completedSkills} / {MAX_SKILLS}
          </strong>
          <span>Reach {TARGET_SESSIONS} sessions to complete a skill.</span>
        </article>

        <article className="card stat">
          <p>Skills Tracked</p>
          <strong>
            {state.skills.length} / {MAX_SKILLS}
          </strong>
          <span>Keep it small first, expand over time.</span>
        </article>
      </section>

      <section className="app-workspace-grid">
        <section className="card timer-panel timer-panel-emphasis">
          <div className="timer-header">
            <div className="timer-lead">
              <p>Pomodoro Timer</p>
              <strong>{activeSkill ? activeSkill.title : "Select a skill to begin"}</strong>
            </div>
            <span className={`phase-badge ${state.timer.phase}`}>
              {state.timer.phase === "focus" ? "Focus" : "Break"}
            </span>
          </div>

          <div className="timer-status-row">
            <p className="timer-context">{timerStatusCopy}</p>
            <span className="timer-support">
              {activeSkill
                ? `${TARGET_SESSIONS - activeSkill.completedSessions} sessions left to reach the full commitment.`
                : "Assign an active skill so completed blocks count toward it."}
            </span>
          </div>

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

          <div className="timer-mini-grid">
            <article>
              <p>Mode</p>
              <strong>{state.timer.phase === "focus" ? "25m Focus" : "5m Break"}</strong>
            </article>
            <article>
              <p>Attached To</p>
              <strong>{activeSkill?.title ?? "No skill yet"}</strong>
            </article>
            <article>
              <p>Session Count</p>
              <strong>{activeSkill ? activeSkill.completedSessions : 0}</strong>
            </article>
          </div>
        </section>

        <aside className="card focus-brief">
          <div className="section-heading">
            <h2>Studio Brief</h2>
            <span>{state.skills.length} skills in motion</span>
          </div>

          <div className="focus-brief-list">
            <article>
              <p className="focus-brief-label">Portfolio</p>
              <strong>
                {state.skills.length === 0
                  ? "Empty canvas"
                  : `${state.skills.length} tracked / ${openSlots} open`}
              </strong>
              <p>Keep the roster selective enough that you still remember why each skill matters.</p>
            </article>

            <article>
              <p className="focus-brief-label">Momentum</p>
              <strong>
                {leadingSkills[0]
                  ? `${leadingSkills[0].title} is furthest along`
                  : "No lead skill yet"}
              </strong>
              <p>
                {leadingSkills[0]
                  ? `${leadingSkills[0].completedSessions} sessions already stacked on the front-runner.`
                  : "A single focused skill is enough to start compounding progress."}
              </p>
            </article>

            <article>
              <p className="focus-brief-label">Practice Rule</p>
              <strong>Finish the block, then write the note.</strong>
              <p>Use the timer for effort and the detail pages for what changed after the effort.</p>
            </article>
          </div>
        </aside>
      </section>

      <section className="card skill-manager">
        <div className="skill-manager-header">
          <div className="section-heading">
            <h2>Skills</h2>
            <span>{openSlots} slots left</span>
          </div>
          <p className="section-copy">
            Build a deliberate roster of skills instead of a backlog of half-started ambitions.
          </p>
        </div>

        <form onSubmit={handleAddSkill} className="add-skill-form">
          <input
            value={newSkillTitle}
            onChange={(event) => setNewSkillTitle(event.target.value)}
            placeholder="Add a skill or project"
            aria-label="New skill"
            maxLength={120}
          />
          <button type="submit" disabled={state.skills.length >= MAX_SKILLS}>
            Add
          </button>
        </form>

        <div className="skill-grid">
          {state.skills.length === 0 ? (
            <article className="skill-empty">
              <p className="skill-empty-kicker">No skills yet</p>
              <h3>Start with the craft you want to repeat tomorrow.</h3>
              <p>
                Add one concrete skill or project. Examples: Writing, TypeScript, Piano, Deep
                Learning, UX Research.
              </p>
            </article>
          ) : (
            state.skills.map((skill) => {
              const percent = Math.min(100, (skill.completedSessions / TARGET_SESSIONS) * 100);
              const isActive = state.timer.activeSkillId === skill.id;
              const remainingSessions = Math.max(0, TARGET_SESSIONS - skill.completedSessions);

              return (
                <article key={skill.id} className={`skill-card${isActive ? " is-active" : ""}`}>
                  <header>
                    <div>
                      <p className="skill-card-label">Skill</p>
                      <Link to={`/app/skill/${skill.id}`}>{skill.title}</Link>
                    </div>
                    {isActive ? (
                      <span className="active-pill">Active</span>
                    ) : (
                      <span className="skill-card-chip">{remainingSessions} left</span>
                    )}
                  </header>

                  <div className="skill-card-stats">
                    <strong>{skill.completedSessions}</strong>
                    <span>sessions logged</span>
                  </div>

                  <p className="skill-card-total">
                    {skill.completedSessions} completed of {TARGET_SESSIONS}
                  </p>

                  <p className="skill-card-copy">
                    {remainingSessions === 0
                      ? "Target reached. Keep refining or pick a fresh frontier."
                      : `${remainingSessions} sessions left to reach the full 100-session arc.`}
                  </p>

                  <div className="progress-track" aria-hidden>
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="skill-actions">
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => dispatch({ type: "setActiveSkill", skillId: skill.id })}
                    >
                      Set active
                    </button>

                    <button
                      type="button"
                      className="ghost"
                      aria-label={`Decrease sessions for ${skill.title}`}
                      onClick={() =>
                        dispatch({ type: "adjustSkillSessions", skillId: skill.id, delta: -1 })
                      }
                    >
                      -
                    </button>

                    <button
                      type="button"
                      className="ghost"
                      aria-label={`Increase sessions for ${skill.title}`}
                      onClick={() =>
                        dispatch({ type: "adjustSkillSessions", skillId: skill.id, delta: 1 })
                      }
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="danger"
                      aria-label={`Delete ${skill.title}`}
                      onClick={() => dispatch({ type: "deleteSkill", skillId: skill.id })}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
