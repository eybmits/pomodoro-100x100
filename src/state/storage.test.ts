import { describe, expect, it } from "vitest";
import { getImportedSkillKey } from "../data/importedSkillUtils";
import { appReducer } from "./reducer";
import { loadState, saveState, STORAGE_KEY } from "./storage";
import { createDefaultAppState } from "../types";

describe("storage", () => {
  it("saves and loads state roundtrip", () => {
    let state = createDefaultAppState();
    state = appReducer(state, { type: "addSkill", title: "Rust" });
    const skillId = state.skills[0]!.id;
    state = appReducer(state, {
      type: "setSkillNotes",
      skillId,
      notesMd: "## Learnings"
    });

    saveState(state);
    const loaded = loadState();
    const rust = loaded.skills.find((skill) => skill.title === "Rust");

    expect(loaded.schemaVersion).toBe(1);
    expect(rust).toBeDefined();
    expect(rust!.notesMd).toBe("## Learnings");
    expect(loaded.skills.some((skill) => skill.title === "Chess")).toBe(true);
  });

  it("falls back to imported defaults on invalid json", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-valid-json}");

    const loaded = loadState();

    expect(loaded.skills.length).toBeGreaterThan(0);
    expect(loaded.timer.activeSkillId).not.toBeNull();
  });

  it("falls back to imported defaults on unknown schema version", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 99,
        skills: [],
        timer: {}
      })
    );

    const loaded = loadState();

    expect(loaded.skills.length).toBeGreaterThan(0);
    expect(loaded.schemaVersion).toBe(1);
  });

  it("includes curated manual entries with custom notes", () => {
    window.localStorage.removeItem(STORAGE_KEY);

    const loaded = loadState();
    const initiative = loaded.skills.find(
      (skill) => skill.title === "Initiative Without Permission"
    );

    expect(initiative).toBeDefined();
    expect(initiative!.notesMd).toContain("Stop asking for approval and permission.");
    expect(initiative!.notesMd).toContain('plant the "this is happening" flag');
  });

  it("merges imported notes into matching aliases without creating duplicates", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skills: [
          {
            id: "learn-spanish",
            title: "Learn Spanish",
            targetSessions: 100,
            completedSessions: 0,
            notesMd: "",
            links: [],
            createdAtIso: "2026-03-05T00:00:00.000Z",
            updatedAtIso: "2026-03-05T00:00:00.000Z"
          }
        ],
        timer: {
          activeSkillId: null,
          phase: "focus",
          remainingSec: 1500,
          isRunning: false
        }
      })
    );

    const loaded = loadState();
    const spanishSkills = loaded.skills.filter(
      (skill) => getImportedSkillKey(skill.title) === "spanish"
    );

    expect(spanishSkills).toHaveLength(1);
    expect(spanishSkills[0]!.title).toBe("Learn Spanish");
    expect(spanishSkills[0]!.notesMd).toContain('Imported from the "Proof Yourself Hard Things" roadmap.');
  });

  it("removes deprecated imported skills that were previously seeded", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skills: [
          {
            id: "legacy-imported-skill",
            title: "Sex and Intimacy",
            targetSessions: 100,
            completedSessions: 0,
            notesMd:
              '## Focus\n\n## Imported Roadmap\n- Imported from the "Proof Yourself Hard Things" roadmap.',
            links: [],
            createdAtIso: "2026-03-05T00:00:00.000Z",
            updatedAtIso: "2026-03-05T00:00:00.000Z"
          }
        ],
        timer: {
          activeSkillId: "legacy-imported-skill",
          phase: "focus",
          remainingSec: 1500,
          isRunning: false
        }
      })
    );

    const loaded = loadState();

    expect(loaded.skills.some((skill) => skill.title === "Sex and Intimacy")).toBe(false);
    expect(loaded.timer.activeSkillId).not.toBe("legacy-imported-skill");
  });
});
