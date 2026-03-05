import { Link } from "react-router-dom";

const valueCards = [
  {
    step: "01",
    title: "Commitment Becomes Compounding",
    description:
      "Turn raw curiosity into measurable capability by stacking disciplined focus blocks daily."
  },
  {
    step: "02",
    title: "Launch Discipline Like a Product",
    description:
      "Treat every session like a release cycle: clear scope, visible output, immediate feedback."
  },
  {
    step: "03",
    title: "Proof Over Motivation",
    description:
      "Track reps, not vibes. Real progress appears when the numbers move and the work ships."
  }
];

export function LandingPage() {
  return (
    <main className="lp-root">
      <div className="lp-noise" aria-hidden />
      <div className="lp-orb lp-orb-a" aria-hidden />
      <div className="lp-orb lp-orb-b" aria-hidden />
      <div className="lp-orb lp-orb-c" aria-hidden />

      <header className="lp-topbar">
        <p className="lp-brand">100x100 Pomodoro</p>
        <Link to="/app" className="lp-skip">
          Skip to App
        </Link>
      </header>

      <section className="lp-hero">
        <p className="lp-kicker">The 100x100 Method</p>
        <h1>Master 100 Skills with 100 Focus Sessions Each.</h1>
        <p className="lp-copy">
          This is not another productivity toy. It is a performance system for people who want
          concrete competence, visible reps, and a body of work that compounds over months.
        </p>

        <div className="lp-hero-actions">
          <Link to="/app" className="lp-cta-primary">
            Enter the 100x100 Studio
          </Link>
          <span>No account. Local-first. Start now.</span>
        </div>
      </section>

      <section className="lp-value-grid" aria-label="Core value propositions">
        {valueCards.map((card, index) => (
          <article
            key={card.title}
            className="lp-value-card"
            style={{ animationDelay: `${160 + index * 120}ms` }}
          >
            <p className="lp-card-step">{card.step}</p>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="lp-final">
        <p className="lp-final-kicker">Ready to ship your future self?</p>
        <h2>Start the interface. Track the reps. Build the proof.</h2>
        <div className="lp-final-actions">
          <Link to="/app" className="lp-cta-secondary">
            Open Interface
          </Link>
          <p>100 skills x 100 sessions = 10,000 focused reps.</p>
        </div>
      </section>
    </main>
  );
}
