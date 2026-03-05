import {
  BREAK_DURATION_SEC,
  FOCUS_DURATION_SEC,
  MAX_SKILLS,
  TARGET_SESSIONS,
  createDefaultAppState,
  type AppState,
  type Skill,
  type SkillLink,
  type TimerPhase
} from "../types";
import { createId } from "../utils/ids";
import { nowIso } from "../utils/time";

export const STORAGE_KEY = "pomodoro100.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNonNegativeNumber(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    return fallback;
  }
  return Math.floor(value);
}

function sanitizeLink(value: unknown): SkillLink | null {
  if (!isRecord(value)) {
    return null;
  }

  const label = asString(value.label, "").trim();
  const url = asString(value.url, "").trim();
  if (!label || !url) {
    return null;
  }

  return {
    id: asString(value.id, createId()),
    label,
    url
  };
}

function sanitizeSkill(value: unknown): Skill | null {
  if (!isRecord(value)) {
    return null;
  }

  const timestamp = nowIso();
  const id = asString(value.id, createId());
  const title = asString(value.title, "Untitled Skill").trim() || "Untitled Skill";

  const linksRaw = Array.isArray(value.links) ? value.links : [];
  const links = linksRaw.map(sanitizeLink).filter((link): link is SkillLink => link !== null);

  return {
    id,
    title,
    targetSessions: TARGET_SESSIONS,
    completedSessions: asNonNegativeNumber(value.completedSessions, 0),
    notesMd: asString(value.notesMd, ""),
    links,
    createdAtIso: asString(value.createdAtIso, timestamp),
    updatedAtIso: asString(value.updatedAtIso, timestamp),
    lastSessionAtIso: typeof value.lastSessionAtIso === "string" ? value.lastSessionAtIso : undefined
  };
}

function sanitizePhase(value: unknown): TimerPhase {
  return value === "break" ? "break" : "focus";
}

function sanitizeTimer(rawTimer: unknown, skills: Skill[]): AppState["timer"] {
  if (!isRecord(rawTimer)) {
    return createDefaultAppState().timer;
  }

  const phase = sanitizePhase(rawTimer.phase);
  const defaultRemaining = phase === "focus" ? FOCUS_DURATION_SEC : BREAK_DURATION_SEC;
  const remainingSec = asNonNegativeNumber(rawTimer.remainingSec, defaultRemaining);

  const activeSkillIdRaw = rawTimer.activeSkillId;
  const activeSkillId =
    typeof activeSkillIdRaw === "string" && skills.some((skill) => skill.id === activeSkillIdRaw)
      ? activeSkillIdRaw
      : null;

  return {
    phase,
    remainingSec,
    activeSkillId,
    isRunning: false
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return createDefaultAppState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAppState();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== 1) {
      return createDefaultAppState();
    }

    const skillsRaw = Array.isArray(parsed.skills) ? parsed.skills : [];
    const skills = skillsRaw
      .map(sanitizeSkill)
      .filter((skill): skill is Skill => skill !== null)
      .slice(0, MAX_SKILLS);
    const timer = sanitizeTimer(parsed.timer, skills);

    return {
      schemaVersion: 1,
      skills,
      timer
    };
  } catch {
    return createDefaultAppState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota and serialization errors.
  }
}
