# 100x100 Pomodoro

A public, local-first web app for the **100x100 principle**:
- Choose up to 100 skills/projects.
- Invest 100 Pomodoro sessions per skill.
- Build practical competence through consistent, focused repetition.

## MVP Features
- Motivational landing page at `/#/` with launch-style motion and a direct CTA into the app.
- App workspace starts at `/#/app`.
- Dashboard with global progress (up to 10,000 sessions total).
- Skill tracker with manual `+/-` correction per skill.
- Built-in Pomodoro timer (25:00 focus / 5:00 break).
- Auto session increment when a focus cycle completes.
- Per-skill detail page with Markdown report notes and resource links.
- Local persistence with `localStorage` key `pomodoro100.v1`.

## Tech Stack
- React + Vite + TypeScript
- React Router
- Vitest + Testing Library

## Development
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm run preview
```

## Deployment (GitHub Pages)
- Push to `main`.
- GitHub Action builds `dist/` and deploys to Pages.
- The app uses hash routing, so deep links work on Pages.

Expected URL pattern:
`https://<your-user>.github.io/<repo-name>/#/`

Important routes:
- Landing: `/#/`
- App dashboard: `/#/app`
- Skill details: `/#/app/skill/<skill-id>`

## License
MIT (see `LICENSE`).
