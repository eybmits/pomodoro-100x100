import { SKILL_SEEDS, type SkillSeed } from "./skillSeeds";

function normalizeLookup(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "");
}

const importedAliasToKey = new Map<string, string>();

for (const seed of SKILL_SEEDS) {
  importedAliasToKey.set(seed.key, seed.key);

  for (const alias of seed.aliases) {
    importedAliasToKey.set(normalizeLookup(alias), seed.key);
  }
}

export function getImportedSkillKey(title: string): string {
  const normalized = normalizeLookup(title);
  return importedAliasToKey.get(normalized) ?? normalized;
}

export function composeImportedSkillNotes(seed: SkillSeed): string {
  if (seed.notesMd?.trim()) {
    return seed.notesMd;
  }

  const slotLabel =
    seed.slots.length === 1
      ? `${seed.slots[0]} / 100`
      : `${seed.slots.join(", ")} / 100`;
  const sourceLabel =
    seed.sourceTitles.length === 1 ? seed.sourceTitles[0] : seed.sourceTitles.join("; ");
  const startDateLabel =
    seed.sourceStartDates.length === 0
      ? null
      : seed.sourceStartDates.length === 1
        ? `- Source start date: ${seed.sourceStartDates[0]}.`
        : `- Source start dates: ${seed.sourceStartDates.join(", ")}.`;

  const lines = [
    "## Focus",
    `Build practical ability in ${seed.title} through repeated, well-scoped Pomodoro blocks.`,
    "",
    "## Imported Roadmap",
    `- Imported from the "${seed.sourceLabel ?? "Proof Yourself Hard Things"}" roadmap.`,
    `- Roadmap slot${seed.slots.length === 1 ? "" : "s"}: ${slotLabel}.`,
    `- Source entr${seed.sourceTitles.length === 1 ? "y" : "ies"}: ${sourceLabel}.`,
    `- Source status: ${seed.status}.`,
    `- Logged before import: ${seed.completedSessions} / 100 sessions.`
  ];

  if (startDateLabel) {
    lines.push(startDateLabel);
  }

  lines.push(
    "",
    "## Next Step",
    `- Define one concrete subproject in ${seed.title}.`,
    "- Log the next focus block and capture one lesson, one bottleneck, and one follow-up."
  );

  return lines.join("\n");
}
