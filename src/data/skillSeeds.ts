import {
  IMPORTED_SKILLS_IMPORTED_AT,
  IMPORTED_SKILL_SEEDS,
  type ImportedSkillSeed
} from "./importedSkills";

export interface SkillSeed extends ImportedSkillSeed {
  links?: Array<{
    label: string;
    targetKey?: string;
    url?: string;
  }>;
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
  },
  {
    key: "hoursstillmatter",
    title: "Hours Still Matter",
    aliases: ["Hours Still Matter", "10,000-Hour Rule"],
    slots: [90],
    sourceTitles: [
      "The 10,000-hour rule is true. At the end of the day, you still have to put the hours in. Intelligence, efficiency, and great systems help - but they do not replace the work."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:42:00.000Z",
    notesMd: `## Focus
Respect the fact that real skill still requires time on task.

## Principle
The 10,000-hour rule is true.
At the end of the day, you still have to put the hours in.
Intelligence, efficiency, and great systems help, but they do not replace the work.

## Practice
- Track the hours honestly.
- Use systems to support repetition, not to avoid it.
- Judge progress by accumulated practice, not just insight.
- Default to another focused block when in doubt.`
  },
  {
    key: "beanenergizingpresence",
    title: "Be an Energizing Presence",
    aliases: ["Be an Energizing Presence"],
    slots: [91],
    sourceTitles: [
      "Become the kind of person who, after a conversation, leaves others more energized, more ambitious, and more ready to act. Those people are rare. Be one of them - and when you find another, keep them close."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:46:00.000Z",
    links: [
      {
        label: "Make People Feel Like They Matter",
        targetKey: "makepeoplefeelliketheymatter"
      },
      {
        label: "Borrowed Belief",
        targetKey: "borrowedbelief"
      },
      {
        label: "Talk About Possibility",
        targetKey: "talkaboutpossibility"
      }
    ],
    notesMd: `## Focus
Become the kind of person who leaves people more energized, more ambitious, and more ready to act after a conversation.

## Principle
Those people are rare.
Be one of them, and when you find another, keep them close.

## Practice
- Show full attention.
- Add energy without forcing it.
- Leave people with momentum, not just analysis.
- Notice who consistently expands your ambition and stay close to them.`
  },
  {
    key: "makepeoplefeelliketheymatter",
    title: "Make People Feel Like They Matter",
    aliases: ["Make People Feel Like They Matter"],
    slots: [92],
    sourceTitles: [
      "Most people are half-distracted, waiting for their turn to speak. Energizing people make you feel like you matter."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:46:00.000Z",
    notesMd: `## Focus
Use attention as a form of respect.

## Principle
Most people are half-distracted, waiting for their turn to speak.
Energizing people make you feel like you matter.

## Practice
- Listen long enough to understand what is actually at stake for the other person.
- Respond to what they mean, not just to the last sentence.
- Let your attention communicate that their ideas are worth taking seriously.`
  },
  {
    key: "borrowedbelief",
    title: "Borrowed Belief",
    aliases: ["Borrowed Belief"],
    slots: [93],
    sourceTitles: ["Believe in people a little more than they believe in themselves."],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:46:00.000Z",
    notesMd: `## Focus
Lend people a larger self-concept than the one they are currently carrying.

## Principle
Believe in people a little more than they believe in themselves.

## Practice
- Reflect back their strengths with precision.
- Expect more from them in a way that feels grounding, not performative.
- Use belief to unlock action, not to flatter.`
  },
  {
    key: "talkaboutpossibility",
    title: "Talk About Possibility",
    aliases: ["Talk About Possibility"],
    slots: [94],
    sourceTitles: ["Talk about possibility, not just problems."],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T15:46:00.000Z",
    notesMd: `## Focus
Shift conversations toward what can be built, changed, or attempted next.

## Principle
Talk about possibility, not just problems.

## Practice
- Name the real constraint, then move quickly to options.
- Frame next steps in a way that creates agency.
- Let people leave the conversation with a concrete opening for action.`
  },
  {
    key: "aimatgreatness",
    title: "Aim at Greatness",
    aliases: ["Aim at Greatness"],
    slots: [95],
    sourceTitles: [
      "Aim at greatness. Set your standard absurdly high. Mediocrity is the default. To do truly great work, you have to aim to stand with the greats."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T16:59:00.000Z",
    notesMd: `## Focus
Set the target high enough that it pulls your work out of the default drift toward mediocrity.

## Principle
Aim at greatness.
Set your standard absurdly high.
Mediocrity is the default.
To do truly great work, you have to aim to stand with the greats.

## Practice
- Raise the standard before you start.
- Judge drafts against excellence, not against what is merely acceptable.
- Use ambition as a corrective against your natural drift toward average work.
- Ask what would make the result worthy of the greats, then build toward that.`
  },
  {
    key: "donotrationalizewhatfeelswrong",
    title: "Do Not Rationalize What Feels Wrong",
    aliases: ["Do Not Rationalize What Feels Wrong"],
    slots: [96],
    sourceTitles: [
      "Be careful about rationalizing something that does not feel right."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:02:00.000Z",
    notesMd: `## Focus
Treat the internal signal that something is off as information, not as an inconvenience to explain away.

## Principle
Be careful about rationalizing something that does not feel right.

## Practice
- Pause when your first honest reaction says something is off.
- Separate explanation from truth-seeking.
- Ask what you would see if you stopped defending the situation.
- Respect the signal before you build a story around it.`
  }
];

export const SKILL_SEEDS_IMPORTED_AT = IMPORTED_SKILLS_IMPORTED_AT;

export const SKILL_SEEDS: SkillSeed[] = [...IMPORTED_SKILL_SEEDS, ...CURATED_SKILL_SEEDS];
