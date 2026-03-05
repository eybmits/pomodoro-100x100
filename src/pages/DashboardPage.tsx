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

  const selectedSkillId = state.timer.activeSkillId ?? "";
  const canStartTimer = state.timer.phase === "break" || Boolean(state.timer.activeSkillId);

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: "addSkill", title: newSkillTitle });
    setNewSkillTitle("");
  }

  return (
    <main className="shell">
      <section className="hero card">
        <p className="eyebrow">100x100 Pomodoro</p>
        <h1>Build competence through focused repetition.</h1>
        <p className="lede">
          Pick up to 100 skills, invest 100 Pomodoro sessions in each, and track progress with
          simple daily consistency.
        </p>
      </section>

      <section className="stats-grid">
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

      <section className="card timer-panel">
        <div className="timer-header">
          <p>Pomodoro Timer</p>
          <span className={`phase-badge ${state.timer.phase}`}>
            {state.timer.phase === "focus" ? "Focus" : "Break"}
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

          <button type="button" className="ghost" onClick={() => dispatch({ type: "timerReset" })}>
            Reset
          </button>
        </div>
      </section>

      <section className="card skill-manager">
        <div className="section-heading">
          <h2>Skills</h2>
          <span>{MAX_SKILLS - state.skills.length} slots left</span>
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
          {state.skills.map((skill) => {
            const percent = Math.min(100, (skill.completedSessions / TARGET_SESSIONS) * 100);
            const isActive = state.timer.activeSkillId === skill.id;

            return (
              <article key={skill.id} className="skill-card">
                <header>
                  <Link to={`/skill/${skill.id}`}>{skill.title}</Link>
                  {isActive && <span className="active-pill">Active</span>}
                </header>

                <p>
                  {skill.completedSessions} / {TARGET_SESSIONS} sessions
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
          })}
        </div>
      </section>
    </main>
  );
}
