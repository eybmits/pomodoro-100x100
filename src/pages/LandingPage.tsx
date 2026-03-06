import { Link } from "react-router-dom";
import { TARGET_SESSIONS, type AppState } from "../types";

interface LandingPageProps {
  state: AppState;
}

export function LandingPage({ state }: LandingPageProps) {
  const trackedSkills = state.skills.length;
  const featuredSkill =
    state.skills.find((skill) => skill.id === state.timer.activeSkillId) ??
    state.skills.find((skill) => skill.completedSessions > 0) ??
    state.skills[0] ??
    null;
  const featuredSessions = featuredSkill?.completedSessions ?? 0;
  const featuredPercent = featuredSkill
    ? Math.min(100, (featuredSessions / TARGET_SESSIONS) * 100)
    : 0;
  const overallSessions = state.skills.reduce((sum, skill) => sum + skill.completedSessions, 0);
  const nextActionCopy = featuredSkill ? "Log the next block" : "Add the first skill";
  const activeIndex = featuredSkill
    ? state.skills.findIndex((skill) => skill.id === featuredSkill.id)
    : -1;

  return (
    <main className="lp-root">
      <div className="lp-noise" aria-hidden />
      <div className="lp-orb lp-orb-a" aria-hidden />
      <div className="lp-orb lp-orb-b" aria-hidden />
      <div className="lp-orb lp-orb-c" aria-hidden />

      <header className="lp-topbar">
        <div className="lp-mark">
          <span className="lp-mark-dot" aria-hidden />
          100x100 Pomodoro
        </div>
        <p className="lp-topbar-note">100 skills. 100 Pomodoros each.</p>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-kicker">Personal Tracker</p>
          <h1>100 skills. One place to keep them moving.</h1>
          <p className="lp-copy">See the full map. Pick one skill. Log the next block.</p>

          <div className="hero-meta lp-hero-meta">
            <span>100 slots</span>
            <span>100 blocks per skill</span>
            <span>notes stay attached</span>
          </div>

          <div className="lp-actions">
            <Link to="/app" className="lp-cta-primary">
              Open Tracker
            </Link>
          </div>
        </div>

        <aside className="lp-stage" aria-hidden>
          <div className="lp-stage-strip">
            <article className="lp-stage-stat">
              <p>Tracked</p>
              <strong>{trackedSkills}</strong>
              <span>skills</span>
            </article>
            <article className="lp-stage-stat">
              <p>Current</p>
              <strong>{featuredSkill?.title ?? "Roadmap Ready"}</strong>
              <span>{featuredSkill ? `${featuredSessions} / ${TARGET_SESSIONS}` : "imported set"}</span>
            </article>
            <article className="lp-stage-stat">
              <p>Next</p>
              <strong>{nextActionCopy}</strong>
              <span>{overallSessions} sessions logged</span>
            </article>
          </div>

          <div className="lp-stage-board">
            <section className="lp-stage-map">
              <div className="lp-stage-head">
                <p>Skill Atlas</p>
                <span>{trackedSkills} / 100</span>
              </div>

              <div className="lp-stage-grid">
                {Array.from({ length: 100 }, (_, index) => {
                  const isFilled = index < trackedSkills;
                  const isActive = index === activeIndex;

                  return (
                    <span
                      key={index}
                      className={`lp-stage-cell${isFilled ? " is-filled" : ""}${isActive ? " is-active" : ""}`}
                    />
                  );
                })}
              </div>
            </section>

            <section className="lp-stage-focus">
              <p className="lp-stage-eyebrow">Current Project</p>
              <strong className="lp-stage-title">{featuredSkill?.title ?? "100x100 Roadmap"}</strong>
              <p className="lp-stage-total">
                {featuredSkill
                  ? `${featuredSessions} / ${TARGET_SESSIONS} Pomodoros`
                  : `${trackedSkills} imported skills`}
              </p>

              <div className="lp-stage-progress">
                <div
                  className="lp-stage-progress-fill"
                  style={{ width: `${featuredPercent}%` }}
                />
              </div>

              <div className="lp-stage-list">
                <article>
                  <span>Mapped</span>
                  <strong>{trackedSkills} skills</strong>
                </article>
                <article>
                  <span>Next</span>
                  <strong>{nextActionCopy}</strong>
                </article>
              </div>

              <div className="lp-stage-note">
                <span>Roadmap</span>
                <strong>
                  Imported skills already include English notes, source context, and a next-step prompt.
                </strong>
              </div>
            </section>
          </div>
        </aside>
      </section>
    </main>
  );
}
