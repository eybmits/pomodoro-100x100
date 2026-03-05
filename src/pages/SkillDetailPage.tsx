import { FormEvent, useMemo, useState, type Dispatch } from "react";
import { Link, useParams } from "react-router-dom";
import type { AppAction } from "../state/reducer";
import { TARGET_SESSIONS, type AppState } from "../types";
import { renderMarkdown } from "../utils/markdown";

interface SkillDetailPageProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export function SkillDetailPage({ state, dispatch }: SkillDetailPageProps) {
  const { skillId } = useParams();
  const skill = state.skills.find((entry) => entry.id === skillId);

  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const renderedNotes = useMemo(() => renderMarkdown(skill?.notesMd ?? ""), [skill?.notesMd]);
  const noteWordCount = skill?.notesMd.trim() ? skill.notesMd.trim().split(/\s+/).length : 0;

  if (!skill) {
    return (
      <main className="shell">
        <section className="card">
          <h1>Skill not found</h1>
          <p>The selected skill does not exist anymore.</p>
          <Link to="/app" className="inline-link">
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  function handleCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!skill) {
      return;
    }
    dispatch({
      type: "addSkillLink",
      skillId: skill.id,
      label: newLinkLabel,
      url: newLinkUrl
    });
    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  const progressPercent = Math.min(100, (skill.completedSessions / TARGET_SESSIONS) * 100);
  const remainingSessions = Math.max(0, TARGET_SESSIONS - skill.completedSessions);
  const isActiveSkill = state.timer.activeSkillId === skill.id;

  return (
    <main className="shell detail-shell">
      <section className="card detail-header detail-hero">
        <div className="detail-nav">
          <Link to="/app" className="inline-link">
            &lt;- Back to App
          </Link>
          <Link to="/" className="app-back-link">
            Back to Motivation
          </Link>
        </div>

        <div className="detail-hero-grid">
          <div className="detail-hero-copy">
            <p className="eyebrow">Skill Detail</p>
            <input
              className="title-input"
              value={skill.title}
              onChange={(event) =>
                dispatch({
                  type: "updateSkillTitle",
                  skillId: skill.id,
                  title: event.target.value
                })
              }
              aria-label="Skill title"
              maxLength={120}
            />
            <p className="detail-summary">
              Keep notes, references, and session counts together so each practice block compounds
              instead of resetting every time you return.
            </p>

            <div className="detail-meta-row">
              <span className="detail-chip">
                {skill.completedSessions} / {TARGET_SESSIONS} sessions
              </span>
              <span className="detail-chip">{remainingSessions} remaining</span>
              <span className="detail-chip">{skill.links.length} resources</span>
              <span className="detail-chip">{noteWordCount} note words</span>
              {isActiveSkill && <span className="detail-chip is-active">Active timer skill</span>}
            </div>
          </div>

          <aside className="detail-progress-panel">
            <p>Progress to 100</p>
            <strong>{Math.round(progressPercent)}%</strong>
            <div className="progress-track progress-track-lg" aria-hidden>
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>
              {remainingSessions === 0
                ? "Skill target reached. Keep polishing the edge."
                : `${remainingSessions} sessions left to complete the full commitment.`}
            </span>
          </aside>
        </div>

        <div className="inline-actions">
          <button
            type="button"
            className="ghost"
            onClick={() =>
              dispatch({
                type: "adjustSkillSessions",
                skillId: skill.id,
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
                skillId: skill.id,
                delta: 1
              })
            }
          >
            +1 Session
          </button>
        </div>
      </section>

      <section className="detail-grid">
        <article className="card detail-card">
          <div className="detail-card-heading">
            <div>
              <h2>Report Notes (Markdown)</h2>
              <p>Capture what worked, what stalled, and what to do in the next session.</p>
            </div>
          </div>
          <textarea
            value={skill.notesMd}
            onChange={(event) =>
              dispatch({
                type: "setSkillNotes",
                skillId: skill.id,
                notesMd: event.target.value
              })
            }
            placeholder="What did you learn? What is next?"
            rows={12}
            aria-label="Skill notes"
          />
        </article>

        <article className="card detail-card detail-preview-card">
          <div className="detail-card-heading">
            <div>
              <h2>Preview</h2>
              <p>
                {skill.notesMd.trim()
                  ? "Rendered live from your markdown notes."
                  : "Write a short debrief, checklist, or insight log to populate this view."}
              </p>
            </div>
          </div>
          {skill.notesMd.trim() ? (
            <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedNotes }} />
          ) : (
            <div className="markdown-preview markdown-preview-empty">
              <p>No notes yet. Start with what you practiced and what to repeat next time.</p>
            </div>
          )}
        </article>
      </section>

      <section className="card detail-card detail-resources">
        <div className="detail-card-heading">
          <div>
            <h2>Resources</h2>
            <p>Keep only the links that help you restart quickly and practice with intent.</p>
          </div>
          <span className="detail-meta-inline">{skill.links.length} saved</span>
        </div>

        <form onSubmit={handleCreateLink} className="resource-form">
          <input
            value={newLinkLabel}
            onChange={(event) => setNewLinkLabel(event.target.value)}
            placeholder="Label"
            aria-label="Link label"
          />
          <input
            value={newLinkUrl}
            onChange={(event) => setNewLinkUrl(event.target.value)}
            placeholder="https://..."
            aria-label="Link URL"
          />
          <button type="submit">Add Link</button>
        </form>

        <div className="resource-list">
          {skill.links.map((link) => (
            <article key={link.id} className="resource-item">
              <input
                value={link.label}
                aria-label={`Label for ${link.label}`}
                onChange={(event) =>
                  dispatch({
                    type: "updateSkillLink",
                    skillId: skill.id,
                    linkId: link.id,
                    patch: { label: event.target.value }
                  })
                }
              />
              <input
                value={link.url}
                aria-label={`URL for ${link.label}`}
                onChange={(event) =>
                  dispatch({
                    type: "updateSkillLink",
                    skillId: skill.id,
                    linkId: link.id,
                    patch: { url: event.target.value }
                  })
                }
              />
              <a href={link.url} target="_blank" rel="noreferrer">
                Open
              </a>
              <button
                type="button"
                className="danger"
                onClick={() =>
                  dispatch({
                    type: "deleteSkillLink",
                    skillId: skill.id,
                    linkId: link.id
                  })
                }
              >
                Remove
              </button>
            </article>
          ))}

          {skill.links.length === 0 && (
            <div className="resource-empty">
              <p>No resources yet. Add a prompt, course note, article, or reference link.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
