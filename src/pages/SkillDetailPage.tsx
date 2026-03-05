import { FormEvent, useMemo, useState, type Dispatch } from "react";
import { Link, useParams } from "react-router-dom";
import type { AppAction } from "../state/reducer";
import { TARGET_SESSIONS, type AppState, type SkillLink } from "../types";
import { renderMarkdown } from "../utils/markdown";

interface SkillDetailPageProps {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const IMAGE_LINK_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

function isImageLink(link: SkillLink): boolean {
  return IMAGE_LINK_PATTERN.test(link.url.trim());
}

function deriveLinkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const pathTail = parsed.pathname.split("/").filter(Boolean).at(-1);
    return pathTail || parsed.hostname.replace(/^www\./, "") || "Untitled";
  } catch {
    return "Untitled";
  }
}

export function SkillDetailPage({ state, dispatch }: SkillDetailPageProps) {
  const { skillId } = useParams();
  const skill = state.skills.find((entry) => entry.id === skillId);

  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const renderedNotes = useMemo(() => renderMarkdown(skill?.notesMd ?? ""), [skill?.notesMd]);
  const noteWordCount = skill?.notesMd.trim() ? skill.notesMd.trim().split(/\s+/).length : 0;
  const imageLinks = useMemo(
    () => skill?.links.filter((link) => isImageLink(link)) ?? [],
    [skill?.links]
  );
  const referenceLinks = useMemo(
    () => skill?.links.filter((link) => !isImageLink(link)) ?? [],
    [skill?.links]
  );

  if (!skill) {
    return (
      <main className="shell detail-shell">
        <section className="card detail-card">
          <h1>Skill not found</h1>
          <p>The selected skill does not exist anymore.</p>
          <Link to="/app" className="inline-link">
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const progressPercent = Math.min(100, (skill.completedSessions / TARGET_SESSIONS) * 100);
  const updatedLabel = new Date(skill.updatedAtIso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const currentSkillId = skill.id;
  const isActiveSkill = state.timer.activeSkillId === skill.id;

  function handleCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const url = newLinkUrl.trim();
    if (!url) {
      return;
    }

    dispatch({
      type: "addSkillLink",
      skillId: currentSkillId,
      label: newLinkLabel.trim() || deriveLinkLabel(url),
      url
    });
    setNewLinkLabel("");
    setNewLinkUrl("");
  }

  return (
    <main className="shell detail-shell detail-shell-doc">
      <div className="app-meta-nav">
        <div className="lp-mark app-meta-mark">
          <span className="lp-mark-dot" aria-hidden />
          100x100 Tracker
        </div>
        <Link to="/" className="app-back-link">
          Back to Landing
        </Link>
      </div>

      <section className="card detail-doc-header">
        <div className="detail-nav">
          <Link to="/app" className="inline-link">
            Back to dashboard
          </Link>

          <div className="detail-doc-actions">
            {isActiveSkill ? (
              <span className="active-pill">Current focus</span>
            ) : (
              <button
                type="button"
                className="ghost"
                onClick={() => dispatch({ type: "setActiveSkill", skillId: skill.id })}
              >
                Set active
              </button>
            )}
          </div>
        </div>

        <p className="eyebrow">Skill</p>
        <input
          className="title-input detail-doc-title"
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
        <p className="detail-doc-lede">Notes, screenshots, links.</p>

        <div className="detail-doc-meta">
          <span className="detail-chip">{skill.completedSessions} / 100 sessions</span>
          <span className="detail-chip">{Math.round(progressPercent)}% complete</span>
          <span className="detail-chip">{noteWordCount} words</span>
          <span className="detail-chip">{imageLinks.length} images</span>
          <span className="detail-chip">{referenceLinks.length} links</span>
          <span className="detail-chip">Updated {updatedLabel}</span>
        </div>
      </section>

      <section className="detail-doc-layout">
        <article className="card detail-doc-editor">
          <div className="detail-card-heading">
            <div>
              <h2>Insights</h2>
              <p>Changes, insights, next step.</p>
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
            placeholder={
              "# Session notes\n\n## What changed\n- ...\n\n## Insights\n- ...\n\n## Next step\n- ..."
            }
            rows={18}
            aria-label="Skill notes"
          />

          <p className="detail-doc-help">Markdown supported.</p>
        </article>

        <article className="card detail-doc-preview-panel">
          <div className="detail-card-heading">
            <div>
              <h2>Document</h2>
              <p>Reading view.</p>
            </div>
          </div>

          <div className="detail-doc-page">
            <p className="detail-doc-page-kicker">Notes</p>
            <h1 className="detail-doc-page-title">{skill.title}</h1>
            <div className="detail-doc-page-meta">
              <span>{skill.completedSessions} logged</span>
              <span>{noteWordCount} words</span>
              <span>{imageLinks.length} images</span>
            </div>

            {skill.notesMd.trim() ? (
              <div
                className="markdown-preview detail-doc-markdown"
                dangerouslySetInnerHTML={{ __html: renderedNotes }}
              />
            ) : (
              <div className="markdown-preview markdown-preview-empty detail-doc-markdown">
                <p>No notes yet.</p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="card detail-doc-media">
        <div className="detail-card-heading">
          <div>
            <h2>Media</h2>
            <p>Images and links.</p>
          </div>
          <span className="detail-meta-inline">{skill.links.length} saved</span>
        </div>

        <form onSubmit={handleCreateLink} className="resource-form doc-resource-form">
          <input
            value={newLinkLabel}
            onChange={(event) => setNewLinkLabel(event.target.value)}
            placeholder="Caption or title (optional)"
            aria-label="Link label"
          />
          <input
            value={newLinkUrl}
            onChange={(event) => setNewLinkUrl(event.target.value)}
            placeholder="https://..."
            aria-label="Link URL"
          />
          <button type="submit">Add</button>
        </form>

        {skill.links.length === 0 ? (
          <div className="resource-empty detail-doc-empty">
            <p>No media yet.</p>
          </div>
        ) : (
          <div className="detail-doc-media-stack">
            {imageLinks.length > 0 ? (
              <section className="detail-doc-media-group">
                <div className="detail-doc-group-heading">
                  <h3>Images</h3>
                  <span>{imageLinks.length}</span>
                </div>

                <div className="detail-doc-gallery">
                  {imageLinks.map((link) => (
                    <figure key={link.id} className="detail-doc-gallery-card">
                      <div className="detail-doc-gallery-frame">
                        <img src={link.url} alt={link.label} loading="lazy" />
                      </div>

                      <figcaption className="detail-doc-gallery-caption">
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

                        <div className="detail-doc-item-actions">
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
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {referenceLinks.length > 0 ? (
              <section className="detail-doc-media-group">
                <div className="detail-doc-group-heading">
                  <h3>References</h3>
                  <span>{referenceLinks.length}</span>
                </div>

                <div className="detail-doc-link-list">
                  {referenceLinks.map((link) => (
                    <article key={link.id} className="detail-doc-link-card">
                      <div className="detail-doc-link-fields">
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
                      </div>

                      <div className="detail-doc-item-actions detail-doc-link-actions">
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
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
