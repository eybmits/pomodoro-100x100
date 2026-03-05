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

  return (
    <main className="shell">
      <section className="card detail-header">
        <div className="detail-nav">
          <Link to="/app" className="inline-link">
            &lt;- Back to App
          </Link>
          <Link to="/" className="app-back-link">
            Back to Motivation
          </Link>
        </div>
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
        <p>
          {skill.completedSessions} / {TARGET_SESSIONS} sessions
        </p>
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
          <h2>Report Notes (Markdown)</h2>
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

        <article className="card detail-card">
          <h2>Preview</h2>
          <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: renderedNotes }} />
        </article>
      </section>

      <section className="card detail-card">
        <h2>Resources</h2>

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

          {skill.links.length === 0 && <p>No resources yet.</p>}
        </div>
      </section>
    </main>
  );
}
