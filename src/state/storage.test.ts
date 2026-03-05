import { describe, expect, it } from "vitest";
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

    expect(loaded.schemaVersion).toBe(1);
    expect(loaded.skills).toHaveLength(1);
    expect(loaded.skills[0]!.title).toBe("Rust");
    expect(loaded.skills[0]!.notesMd).toBe("## Learnings");
  });

  it("falls back to defaults on invalid json", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not-valid-json}");

    const loaded = loadState();

    expect(loaded.skills).toHaveLength(0);
    expect(loaded.timer.activeSkillId).toBeNull();
  });

  it("falls back to defaults on unknown schema version", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 99,
        skills: [],
        timer: {}
      })
    );

    const loaded = loadState();

    expect(loaded.skills).toHaveLength(0);
    expect(loaded.schemaVersion).toBe(1);
  });
});
