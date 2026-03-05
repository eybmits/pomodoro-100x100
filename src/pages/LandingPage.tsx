import { Link } from "react-router-dom";

export function LandingPage() {
  const trackedSkills = 42;

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
              <strong>42</strong>
              <span>skills</span>
            </article>
            <article className="lp-stage-stat">
              <p>Current</p>
              <strong>Essay Draft</strong>
              <span>42 / 100</span>
            </article>
            <article className="lp-stage-stat">
              <p>Next</p>
              <strong>Rewrite intro</strong>
              <span>today</span>
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
                  const isActive = index === 12;

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
              <strong className="lp-stage-title">Essay Draft</strong>
              <p className="lp-stage-total">42 / 100 Pomodoros</p>

              <div className="lp-stage-progress">
                <div className="lp-stage-progress-fill" />
              </div>

              <div className="lp-stage-list">
                <article>
                  <span>Today</span>
                  <strong>3 blocks</strong>
                </article>
                <article>
                  <span>Next</span>
                  <strong>Rewrite intro</strong>
                </article>
              </div>

              <div className="lp-stage-note">
                <span>Note</span>
                <strong>Sources grouped. Intro angle is locked.</strong>
              </div>
            </section>
          </div>
        </aside>
      </section>
    </main>
  );
}
