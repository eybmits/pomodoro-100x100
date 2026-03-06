import {
  IMPORTED_SKILLS_IMPORTED_AT,
  IMPORTED_SKILL_SEEDS,
  type ImportedSkillSeed
} from "./importedSkills";

export interface SkillSeed extends ImportedSkillSeed {
  notesMd?: string;
  sourceLabel?: string;
  updatedAtIso?: string;
}

export const CURATED_SKILL_SEEDS: SkillSeed[] = [
  {
    key: "initiativewithoutpermission",
    title: "Initiative Without Permission",
    aliases: ["Initiative Without Permission"],
    slots: [89],
    sourceTitles: [
      "Stop asking for approval and permission. School and work train people into that mindset. Break it. Figure out what you want, plant the \"this is happening\" flag, and move with conviction. People will come along for the ride."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:30:00.000Z",
    notesMd: `## Focus
Build the habit of moving decisively without waiting for external permission.

## Principle
Stop asking for approval and permission.
School and work train people into that mindset. Break it.
Figure out what you want, plant the "this is happening" flag, and move with conviction.
People will come along for the ride.

## Practice
- Name the outcome you want.
- Decide as if it is already in motion.
- Take the first irreversible step within 24 hours.
- Let momentum create social proof afterward.`
  }
];

export const SKILL_SEEDS_IMPORTED_AT = IMPORTED_SKILLS_IMPORTED_AT;

export const SKILL_SEEDS: SkillSeed[] = [...IMPORTED_SKILL_SEEDS, ...CURATED_SKILL_SEEDS];
