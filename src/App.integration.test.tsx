import { act, fireEvent, render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { STORAGE_KEY } from "./state/storage";

describe("App integration", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the landing page and opens the app via CTA", () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.hash = "#/";

    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    expect(
      screen.getByRole("heading", { name: /100 skills\. one place to keep them moving\./i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Open Tracker" }));

    expect(screen.getByText("Pomodoro Timer")).toBeInTheDocument();
    expect(window.location.hash).toBe("#/app");
  });

  it("counts a session when a focus timer reaches zero", async () => {
    vi.useFakeTimers();
    window.location.hash = "#/app";

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

    expect(screen.getAllByText("1 / 100 sessions").length).toBeGreaterThan(0);
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

    window.location.hash = `#/app/skill/${skillId}`;

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

  it("redirects legacy skill routes to /app/skill/:id", () => {
    const skillId = "skill-legacy";

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skills: [
          {
            id: skillId,
            title: "Legacy Routing",
            targetSessions: 100,
            completedSessions: 8,
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

    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    expect(window.location.hash).toBe(`#/app/skill/${skillId}`);
    expect(screen.getByLabelText("Skill title")).toHaveValue("Legacy Routing");
  });
});
