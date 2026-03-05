import { act, fireEvent, render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { STORAGE_KEY } from "./state/storage";

describe("App integration", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts a session when a focus timer reaches zero", async () => {
    vi.useFakeTimers();

    const skillId = "skill-1";
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skills: [
          {
            id: skillId,
            title: "Linear Algebra",
            targetSessions: 100,
            completedSessions: 0,
            notesMd: "",
            links: [],
            createdAtIso: "2026-03-05T00:00:00.000Z",
            updatedAtIso: "2026-03-05T00:00:00.000Z"
          }
        ],
        timer: {
          activeSkillId: skillId,
          phase: "focus",
          remainingSec: 1,
          isRunning: false
        }
      })
    );

    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText("1 / 100 sessions")).toBeInTheDocument();
    expect(screen.getByText("Break")).toBeInTheDocument();
  });

  it("persists skill notes on detail page after reload", () => {
    const skillId = "skill-2";
    const notes = "## Session Summary\n- Learned to keep focus blocks strict";

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skills: [
          {
            id: skillId,
            title: "Public Speaking",
            targetSessions: 100,
            completedSessions: 3,
            notesMd: "",
            links: [],
            createdAtIso: "2026-03-05T00:00:00.000Z",
            updatedAtIso: "2026-03-05T00:00:00.000Z"
          }
        ],
        timer: {
          activeSkillId: skillId,
          phase: "focus",
          remainingSec: 1500,
          isRunning: false
        }
      })
    );

    window.location.hash = `#/skill/${skillId}`;

    const firstRender = render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    fireEvent.change(screen.getByLabelText("Skill notes"), {
      target: { value: notes }
    });

    firstRender.unmount();

    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    expect(screen.getByLabelText("Skill notes")).toHaveValue(notes);
  });
});
