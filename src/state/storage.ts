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
import { IMPORTED_SKILLS_IMPORTED_AT, IMPORTED_SKILL_SEEDS } from "../data/importedSkills";
import { composeImportedSkillNotes, getImportedSkillKey } from "../data/importedSkillUtils";
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

function mergeImportedSkills(state: AppState): AppState {
  const nextSkills = [...state.skills];
  const skillIndexByKey = new Map<string, number>();

  for (const [index, skill] of nextSkills.entries()) {
    skillIndexByKey.set(getImportedSkillKey(skill.title), index);
  }

  let hasChanged = false;

  for (const seed of IMPORTED_SKILL_SEEDS) {
    const existingIndex = skillIndexByKey.get(seed.key);
    const importedNotes = composeImportedSkillNotes(seed);

    if (existingIndex !== undefined) {
      const existingSkill = nextSkills[existingIndex]!;
      let mergedSkill = existingSkill;

      if (!existingSkill.notesMd.trim() && importedNotes.trim()) {
        mergedSkill = {
          ...mergedSkill,
          notesMd: importedNotes,
          updatedAtIso: IMPORTED_SKILLS_IMPORTED_AT
        };
      }

      if (existingSkill.completedSessions < seed.completedSessions) {
        mergedSkill = {
          ...mergedSkill,
          completedSessions: seed.completedSessions,
          updatedAtIso: IMPORTED_SKILLS_IMPORTED_AT,
          lastSessionAtIso:
            seed.completedSessions > 0
              ? existingSkill.lastSessionAtIso ?? IMPORTED_SKILLS_IMPORTED_AT
              : existingSkill.lastSessionAtIso
        };
      }

      if (mergedSkill !== existingSkill) {
        nextSkills[existingIndex] = mergedSkill;
        hasChanged = true;
      }

      continue;
    }

    if (nextSkills.length >= MAX_SKILLS) {
      break;
    }

    const importedSkill: Skill = {
      id: createId(),
      title: seed.title,
      targetSessions: TARGET_SESSIONS,
      completedSessions: seed.completedSessions,
      notesMd: importedNotes,
      links: [],
      createdAtIso: IMPORTED_SKILLS_IMPORTED_AT,
      updatedAtIso: IMPORTED_SKILLS_IMPORTED_AT,
      lastSessionAtIso: seed.completedSessions > 0 ? IMPORTED_SKILLS_IMPORTED_AT : undefined
    };

    nextSkills.push(importedSkill);
    skillIndexByKey.set(seed.key, nextSkills.length - 1);
    hasChanged = true;
  }

  const activeSkillId =
    state.timer.activeSkillId && nextSkills.some((skill) => skill.id === state.timer.activeSkillId)
      ? state.timer.activeSkillId
      : nextSkills[0]?.id ?? null;

  if (!hasChanged && activeSkillId === state.timer.activeSkillId) {
    return state;
  }

  return {
    ...state,
    skills: nextSkills,
    timer: {
      ...state.timer,
      activeSkillId
    }
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return mergeImportedSkills(createDefaultAppState());
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return mergeImportedSkills(createDefaultAppState());
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== 1) {
      return mergeImportedSkills(createDefaultAppState());
    }

    const skillsRaw = Array.isArray(parsed.skills) ? parsed.skills : [];
    const skills = skillsRaw
      .map(sanitizeSkill)
      .filter((skill): skill is Skill => skill !== null)
      .slice(0, MAX_SKILLS);
    const timer = sanitizeTimer(parsed.timer, skills);

    return mergeImportedSkills({
      schemaVersion: 1,
      skills,
      timer
    });
  } catch {
    return mergeImportedSkills(createDefaultAppState());
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
