import { describe, expect, it } from "vitest";
import { appReducer } from "./reducer";
import { BREAK_DURATION_SEC, FOCUS_DURATION_SEC, MAX_SKILLS, createDefaultAppState } from "../types";

describe("appReducer", () => {
  it("enforces the max 100 skills limit", () => {
    let state = createDefaultAppState();

    for (let i = 0; i < MAX_SKILLS + 5; i += 1) {
      state = appReducer(state, { type: "addSkill", title: `Skill ${i + 1}` });
    }

    expect(state.skills).toHaveLength(MAX_SKILLS);
  });

  it("does not allow sessions below zero", () => {
    let state = createDefaultAppState();
    state = appReducer(state, { type: "addSkill", title: "TypeScript" });
    const skillId = state.skills[0]!.id;

    state = appReducer(state, {
      type: "adjustSkillSessions",
      skillId,
      delta: -1
    });

    expect(state.skills[0]!.completedSessions).toBe(0);
  });

  it("increments active skill on completed focus and switches to break", () => {
    let state = createDefaultAppState();
    state = appReducer(state, { type: "addSkill", title: "Algorithms" });

    state = appReducer(state, { type: "timerCompleteFocus" });

    expect(state.skills[0]!.completedSessions).toBe(1);
    expect(state.timer.phase).toBe("break");
    expect(state.timer.remainingSec).toBe(BREAK_DURATION_SEC);
    expect(state.timer.isRunning).toBe(false);
  });

  it("switches back to focus after break completion", () => {
    let state = createDefaultAppState();
    state = appReducer(state, { type: "addSkill", title: "Systems" });
    state = appReducer(state, { type: "timerCompleteFocus" });

    state = appReducer(state, { type: "timerCompleteBreak" });

    expect(state.timer.phase).toBe("focus");
    expect(state.timer.remainingSec).toBe(FOCUS_DURATION_SEC);
    expect(state.timer.isRunning).toBe(false);
  });

  it("resets timer if the active skill gets deleted", () => {
    let state = createDefaultAppState();
    state = appReducer(state, { type: "addSkill", title: "Design" });
    const skillId = state.skills[0]!.id;

    state = {
      ...state,
      timer: {
        ...state.timer,
        isRunning: true,
        phase: "break",
        remainingSec: 42,
        activeSkillId: skillId
      }
    };

    state = appReducer(state, { type: "deleteSkill", skillId });

    expect(state.skills).toHaveLength(0);
    expect(state.timer.activeSkillId).toBeNull();
    expect(state.timer.phase).toBe("focus");
    expect(state.timer.remainingSec).toBe(FOCUS_DURATION_SEC);
    expect(state.timer.isRunning).toBe(false);
  });
});
