export type TimerPhase = "focus" | "break";

export interface SkillLink {
  id: string;
  label: string;
  url: string;
}

export interface Skill {
  id: string;
  title: string;
  targetSessions: 100;
  completedSessions: number;
  notesMd: string;
  links: SkillLink[];
  createdAtIso: string;
  updatedAtIso: string;
  lastSessionAtIso?: string;
}

export interface TimerState {
  activeSkillId: string | null;
  phase: TimerPhase;
  remainingSec: number;
  isRunning: boolean;
}

export interface AppState {
  skills: Skill[];
  timer: TimerState;
  schemaVersion: 1;
}

export const TARGET_SESSIONS = 100;
export const MAX_SKILLS = 100;
export const FOCUS_DURATION_SEC = 25 * 60;
export const BREAK_DURATION_SEC = 5 * 60;

export function createDefaultTimerState(): TimerState {
  return {
    activeSkillId: null,
    phase: "focus",
    remainingSec: FOCUS_DURATION_SEC,
    isRunning: false
  };
}

export function createDefaultAppState(): AppState {
  return {
    skills: [],
    timer: createDefaultTimerState(),
    schemaVersion: 1
  };
}
