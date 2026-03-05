import {
  BREAK_DURATION_SEC,
  FOCUS_DURATION_SEC,
  MAX_SKILLS,
  TARGET_SESSIONS,
  type AppState,
  type Skill,
  type SkillLink
} from "../types";
import { createId } from "../utils/ids";
import { nowIso } from "../utils/time";

export type AppAction =
  | { type: "addSkill"; title: string }
  | { type: "updateSkillTitle"; skillId: string; title: string }
  | { type: "deleteSkill"; skillId: string }
  | { type: "setSkillNotes"; skillId: string; notesMd: string }
  | { type: "adjustSkillSessions"; skillId: string; delta: number }
  | { type: "addSkillLink"; skillId: string; label: string; url: string }
  | {
      type: "updateSkillLink";
      skillId: string;
      linkId: string;
      patch: Partial<Pick<SkillLink, "label" | "url">>;
    }
  | { type: "deleteSkillLink"; skillId: string; linkId: string }
  | { type: "setActiveSkill"; skillId: string | null }
  | { type: "timerStart" }
  | { type: "timerPause" }
  | { type: "timerReset" }
  | { type: "timerTick" }
  | { type: "timerCompleteFocus" }
  | { type: "timerCompleteBreak" };

function touch(skill: Skill): Skill {
  return {
    ...skill,
    updatedAtIso: nowIso()
  };
}

function mapSkill(state: AppState, skillId: string, update: (skill: Skill) => Skill): AppState {
  let hasChanged = false;
  const skills = state.skills.map((skill) => {
    if (skill.id !== skillId) {
      return skill;
    }

    hasChanged = true;
    return update(skill);
  });

  if (!hasChanged) {
    return state;
  }

  return {
    ...state,
    skills
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "addSkill": {
      if (state.skills.length >= MAX_SKILLS) {
        return state;
      }

      const title = action.title.trim() || "Untitled Skill";
      const timestamp = nowIso();
      const newSkill: Skill = {
        id: createId(),
        title,
        targetSessions: TARGET_SESSIONS,
        completedSessions: 0,
        notesMd: "",
        links: [],
        createdAtIso: timestamp,
        updatedAtIso: timestamp
      };

      return {
        ...state,
        skills: [...state.skills, newSkill],
        timer: {
          ...state.timer,
          activeSkillId: state.timer.activeSkillId ?? newSkill.id
        }
      };
    }

    case "updateSkillTitle": {
      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          title: action.title.trim() || "Untitled Skill"
        })
      );
    }

    case "deleteSkill": {
      const nextSkills = state.skills.filter((skill) => skill.id !== action.skillId);
      if (nextSkills.length === state.skills.length) {
        return state;
      }

      const deletedActiveSkill = state.timer.activeSkillId === action.skillId;
      return {
        ...state,
        skills: nextSkills,
        timer: deletedActiveSkill
          ? {
              activeSkillId: null,
              phase: "focus",
              remainingSec: FOCUS_DURATION_SEC,
              isRunning: false
            }
          : state.timer
      };
    }

    case "setSkillNotes": {
      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          notesMd: action.notesMd
        })
      );
    }

    case "adjustSkillSessions": {
      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          completedSessions: Math.max(0, skill.completedSessions + action.delta)
        })
      );
    }

    case "addSkillLink": {
      const label = action.label.trim();
      const url = action.url.trim();
      if (!label || !url) {
        return state;
      }

      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          links: [
            ...skill.links,
            {
              id: createId(),
              label,
              url
            }
          ]
        })
      );
    }

    case "updateSkillLink": {
      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          links: skill.links.map((link) =>
            link.id === action.linkId
              ? {
                  ...link,
                  ...action.patch
                }
              : link
          )
        })
      );
    }

    case "deleteSkillLink": {
      return mapSkill(state, action.skillId, (skill) =>
        touch({
          ...skill,
          links: skill.links.filter((link) => link.id !== action.linkId)
        })
      );
    }

    case "setActiveSkill": {
      if (action.skillId === null) {
        return {
          ...state,
          timer: {
            ...state.timer,
            activeSkillId: null
          }
        };
      }

      const skillExists = state.skills.some((skill) => skill.id === action.skillId);
      if (!skillExists) {
        return state;
      }

      return {
        ...state,
        timer: {
          ...state.timer,
          activeSkillId: action.skillId
        }
      };
    }

    case "timerStart": {
      if (state.timer.phase === "focus" && !state.timer.activeSkillId) {
        return state;
      }

      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true
        }
      };
    }

    case "timerPause": {
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false
        }
      };
    }

    case "timerReset": {
      const nextRemaining = state.timer.phase === "focus" ? FOCUS_DURATION_SEC : BREAK_DURATION_SEC;
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          remainingSec: nextRemaining
        }
      };
    }

    case "timerTick": {
      if (!state.timer.isRunning) {
        return state;
      }

      return {
        ...state,
        timer: {
          ...state.timer,
          remainingSec: Math.max(0, state.timer.remainingSec - 1)
        }
      };
    }

    case "timerCompleteFocus": {
      const completedAt = nowIso();
      const activeSkillId = state.timer.activeSkillId;
      const nextSkills =
        activeSkillId === null
          ? state.skills
          : state.skills.map((skill) => {
              if (skill.id !== activeSkillId) {
                return skill;
              }

              return {
                ...skill,
                completedSessions: skill.completedSessions + 1,
                updatedAtIso: completedAt,
                lastSessionAtIso: completedAt
              };
            });

      return {
        ...state,
        skills: nextSkills,
        timer: {
          ...state.timer,
          phase: "break",
          remainingSec: BREAK_DURATION_SEC,
          isRunning: false
        }
      };
    }

    case "timerCompleteBreak": {
      return {
        ...state,
        timer: {
          ...state.timer,
          phase: "focus",
          remainingSec: FOCUS_DURATION_SEC,
          isRunning: false
        }
      };
    }

    default: {
      return state;
    }
  }
}
