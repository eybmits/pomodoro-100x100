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
  },
  {
    key: "ifyoucantdisproveit",
    title: "If You Can't Disprove It",
    aliases: ["If You Can't Disprove It"],
    slots: [97],
    sourceTitles: [
      "If you really can't disprove something, it has a chance of being right."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:06:00.000Z",
    notesMd: `## Focus
Take seriously the possibility that an idea may be right when your best scrutiny still cannot rule it out.

## Principle
If you really can't disprove something, it has a chance of being right.

## Practice
- Try to falsify the idea before you get attached to it.
- Distinguish "I dislike it" from "I disproved it."
- Leave room for uncomfortable possibilities that survive honest criticism.
- Treat surviving scrutiny as a reason to investigate further, not to dismiss reflexively.`
  },
  {
    key: "haveopinions",
    title: "Have Opinions",
    aliases: ["Have Opinions"],
    slots: [98],
    sourceTitles: [
      "Have opinions. Don't drift through ideas passively. Take a position, expose it to the best criticism you can find, and improve it."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:10:00.000Z",
    notesMd: `## Focus
Form views actively instead of drifting through ideas without commitment.

## Principle
Have opinions.
Don't drift through ideas passively.
Take a position, expose it to the best criticism you can find, and improve it.

## Practice
- State what you currently think in a sentence.
- Seek out the strongest criticism, not the weakest.
- Let challenge refine your position instead of dissolving your willingness to think clearly.
- Aim for views that can survive contact with serious disagreement.`
  },
  {
    key: "doingisenergizing",
    title: "Doing Is Energizing",
    aliases: ["Doing Is Energizing"],
    slots: [99],
    sourceTitles: [
      "Doing things is energizing. Wasting time is depressing. You need less \"rest\" than you think."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:14:00.000Z",
    notesMd: `## Focus
Notice that meaningful action tends to generate energy, while passive drift tends to drain it.

## Principle
Doing things is energizing.
Wasting time is depressing.
You need less "rest" than you think.

## Practice
- Distinguish real recovery from low-quality avoidance.
- Start with one concrete action before negotiating with your mood.
- Use movement and execution to create energy instead of waiting for energy first.
- Treat purposeful effort as fuel, not just as expenditure.`
  },
  {
    key: "dothingsfast",
    title: "Do Things Fast",
    aliases: ["Do Things Fast"],
    slots: [100],
    sourceTitles: [
      "Do things fast. Most things don't actually take that long; procrastination is what makes them feel long. Slow is often fake. When no urgency exists, create some."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:18:00.000Z",
    notesMd: `## Focus
Strip away fake slowness and use deliberate urgency to move ordinary tasks quickly.

## Principle
Do things fast.
Most things don't actually take that long; procrastination is what makes them feel long.
Slow is often fake.
When no urgency exists, create some.

## Practice
- Time the task instead of dramatizing it.
- Start before your mind inflates the effort.
- Use short deadlines to create movement when the environment does not.
- Treat speed as clarity plus commitment, not as panic.`
  },
  {
    key: "neverhavezerooutputdays",
    title: "Never Have Zero-Output Days",
    aliases: ["Never Have Zero-Output Days"],
    slots: [101],
    sourceTitles: [
      "Figure out your primary focus, then make progress on it every day - first thing in the morning, no exceptions. Never have zero-output days."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:24:00.000Z",
    notesMd: `## Focus
Identify your primary focus and move it forward every day before the rest of life dilutes your attention.

## Principle
Figure out your primary focus, then make progress on it every day - first thing in the morning, no exceptions.
Never have zero-output days.

## Practice
- Define the one priority that deserves daily movement.
- Touch it first before messages, noise, or logistics take over.
- Make the minimum daily unit small enough that you never miss twice.
- Judge the day partly by whether the primary focus moved at all.`
  },
  {
    key: "benostalgicfornow",
    title: "Be Nostalgic for Now",
    aliases: ["Be Nostalgic for Now"],
    slots: [102],
    sourceTitles: ["Later, you'll be nostalgic for right now."],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:30:00.000Z",
    notesMd: `## Focus
Relate to the present with the awareness that it will one day become a missed season of your life.

## Principle
Later, you'll be nostalgic for right now.

## Practice
- Notice ordinary details as if they were already memory.
- Treat the current chapter as something you may miss sooner than you expect.
- Let future nostalgia sharpen gratitude and attention in the present.
- Use that perspective to show up more fully before the moment passes.`
  },
  {
    key: "environmentmatters",
    title: "Environment Matters",
    aliases: ["Environment Matters"],
    slots: [103],
    sourceTitles: [
      "Environment matters a lot. Go where you can flourish maximally. Put yourself in environments that demand your best - if you can get by being average, you probably will."
    ],
    sourceLabel: "Manual Entry",
    status: "Not started",
    completedSessions: 0,
    sourceStartDates: [],
    updatedAtIso: "2026-03-06T17:34:00.000Z",
    notesMd: `## Focus
Choose environments that draw out your best work instead of rewarding your lowest acceptable effort.

## Principle
Environment matters a lot.
Go where you can flourish maximally.
Put yourself in environments that demand your best - if you can get by being average, you probably will.

## Practice
- Audit the environments that shape your standards, habits, and ambition.
- Move toward places, people, and systems that require more from you.
- Reduce exposure to contexts where mediocrity is easy and invisible.
- Treat environment selection as a force multiplier, not as a background detail.`
  }
];

export const SKILL_SEEDS_IMPORTED_AT = IMPORTED_SKILLS_IMPORTED_AT;

export const SKILL_SEEDS: SkillSeed[] = [...IMPORTED_SKILL_SEEDS, ...CURATED_SKILL_SEEDS];
