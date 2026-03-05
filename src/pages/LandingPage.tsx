import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="lp-root">
      <div className="lp-noise" aria-hidden />
      <div className="lp-orb lp-orb-a" aria-hidden />
      <div className="lp-orb lp-orb-b" aria-hidden />
      <div className="lp-orb lp-orb-c" aria-hidden />

      <section className="lp-hero">
        <div className="lp-hero-grid">
          <div>
            <p className="lp-kicker">100x100 Pomodoro</p>
            <h1>A simple way to track deep practice.</h1>
            <p className="lp-copy">
              Pick up to 100 skills and invest up to 100 Pomodoro sessions per skill. The app
              keeps progress, notes, and links in one local-first workspace.
            </p>

            <div className="lp-quick">
              <p>1. Choose a skill.</p>
              <p>2. Run focus sessions.</p>
              <p>3. Track sessions and notes.</p>
            </div>

            <div className="lp-hero-actions">
              <Link to="/app" className="lp-cta-primary">
                Open the App
              </Link>
              <span>Local-first. No account.</span>
            </div>
          </div>

          <aside className="lp-preview" aria-hidden>
            <div className="lp-preview-top">
              <p>Current Skill</p>
              <strong>Deep Learning</strong>
              <span>37 / 100 sessions</span>
            </div>

            <div className="lp-preview-progress">
              <div className="lp-preview-progress-bar" />
            </div>

            <div className="lp-preview-metrics">
              <article>
                <p>Today</p>
                <strong>4 Focus</strong>
              </article>
              <article>
                <p>Week</p>
                <strong>23 Focus</strong>
              </article>
              <article>
                <p>Streak</p>
                <strong>9 Days</strong>
              </article>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
