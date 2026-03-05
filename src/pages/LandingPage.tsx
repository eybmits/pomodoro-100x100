import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="lp-root">
      <div className="lp-noise" aria-hidden />
      <div className="lp-orb lp-orb-a" aria-hidden />
      <div className="lp-orb lp-orb-b" aria-hidden />
      <div className="lp-orb lp-orb-c" aria-hidden />
      <header className="lp-topbar">
        <div className="lp-topbar-mark">
          <span className="lp-topbar-dot" aria-hidden />
          100x100 Pomodoro
        </div>
        <p className="lp-topbar-note">A local-first practice studio for deliberate learning.</p>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <p className="lp-kicker">100x100 Pomodoro</p>
            <h1>A simple way to track deep practice.</h1>
            <p className="lp-copy">
              Pick up to 100 skills and invest up to 100 Pomodoro sessions per skill. The app
              keeps progress, notes, and links in one local-first workspace.
            </p>

            <div className="lp-quick">
              <p>01 Curate up to 100 skills that deserve repetition.</p>
              <p>02 Run focused sessions with a clear active practice target.</p>
              <p>03 Keep notes, references, and progress in the same workspace.</p>
            </div>

            <div className="lp-hero-actions">
              <Link to="/app" className="lp-cta-primary">
                Open the App
              </Link>
              <span>Local-first. No account.</span>
            </div>

            <div className="lp-proof-strip">
              <span>100 skills max</span>
              <span>100 sessions each</span>
              <span>Markdown notes + links</span>
            </div>
          </div>

          <aside className="lp-preview" aria-hidden>
            <div className="lp-preview-window">
              <div className="lp-preview-window-bar">
                <span />
                <span />
                <span />
              </div>

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

              <div className="lp-preview-stack">
                <article>
                  <p>Notes</p>
                  <strong>Research summary ready</strong>
                </article>
                <article>
                  <p>Next block</p>
                  <strong>Implement attention visualizer</strong>
                </article>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="lp-value-grid">
        <article className="lp-value-card" style={{ animationDelay: "90ms" }}>
          <p className="lp-card-step">01 PORTFOLIO</p>
          <h2>Keep the skill list curated, not chaotic.</h2>
          <p>
            The 100-skill ceiling turns the app into a considered roster instead of an infinite
            backlog of vague ambitions.
          </p>
        </article>

        <article className="lp-value-card" style={{ animationDelay: "180ms" }}>
          <p className="lp-card-step">02 FOCUS</p>
          <h2>Let repetition do the heavy lifting.</h2>
          <p>
            Each Pomodoro attaches to one active skill, so practice compounds instead of being
            scattered across random tasks.
          </p>
        </article>

        <article className="lp-value-card" style={{ animationDelay: "270ms" }}>
          <p className="lp-card-step">03 REVIEW</p>
          <h2>Write down what changed after every block.</h2>
          <p>
            Markdown notes and reference links keep your next session warm, even when you come
            back days later.
          </p>
        </article>
      </section>

      <section className="lp-final">
        <p className="lp-final-kicker">A calmer way to build mastery</p>
        <h2>One workspace for focused work, progress, and reflection.</h2>
        <div className="lp-final-actions">
          <Link to="/app" className="lp-cta-secondary">
            Enter the Workspace
          </Link>
          <p>Designed for desktop and mobile, with everything stored locally in the browser.</p>
        </div>
      </section>
    </main>
  );
}
