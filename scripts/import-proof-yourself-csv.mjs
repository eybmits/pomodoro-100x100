#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_OUTPUT_PATH = path.resolve(process.cwd(), "src/data/importedSkills.ts");

const TITLE_OVERRIDES = new Map([
  ["Aktienhandel", "Equity Trading"],
  ["Biologie", "Biology"],
  ["BJJ / Boxen", "BJJ and Boxing"],
  ["Chemie", "Chemistry"],
  ["Culture Classic Art / Music", "Classical Art and Music"],
  ["Digitale Animation", "Digital Animation"],
  ["Fechten", "Fencing"],
  ["Filmen und Video-Editing", "Filmmaking and Video Editing"],
  ["Full Stack Engineer", "Full-Stack Engineering"],
  ["Geschicklichkeitsspiele", "Dexterity Games"],
  ["Gitarre", "Guitar"],
  ["Grow on Social Media Project", "Social Audience Growth Systems"],
  ["Hacking", "Hacking Fundamentals"],
  ["Hacking / Cybersecurity", "Cybersecurity Practice"],
  ["Klavier", "Piano"],
  ["Learn Chinese", "Chinese"],
  ["Learn French", "French"],
  ["Learn Spanish", "Spanish"],
  ["Learn to Draw Landscapes", "Landscape Drawing"],
  ["Lock Picking", "Lockpicking"],
  ["MASTER Explainer for Physics 101", "Physics 101 Explainers"],
  ["Mastering the Art of Presentation", "Presentation Mastery"],
  ["Medizin", "Medicine"],
  ["Memory Techniken (z. B. Kartendeck)", "Memory Techniques"],
  ["Microeconomics Challenge / Economics (Tyler Cowen)", "Microeconomics Challenge"],
  ["Portrait Challenge", "Portrait Drawing Challenge"],
  ["Quant. Finance", "Quantitative Finance"],
  ["Rhetorik", "Rhetorical Precision"],
  ["Rhetorik & Charismatic Communication", "Charismatic Communication"],
  ["Rätsel", "Puzzles"],
  ["Schlagzeug", "Drums"],
  ["Schreiben (z. B. Fachartikel, Blogs)", "Essay and Blog Writing"],
  ["Segeln & Segelschein", "Sailing and Sailing License"],
  ["Sex", "Sex and Intimacy"],
  ["Spoken Word", "Spoken Word Performance"],
  ["Stand-up-Comedy", "Stand-Up Comedy"],
  ["Super Communicator", "High-Impact Communication"],
  ["Surfen", "Surfing"],
  ["Talking to the Camera", "On-Camera Presence"],
  ["Try to Grow a Social Media Following (Instagram / Twitter)", "Social Media Growth Experiments"],
  ["Unternehmertum / Startup-Gründung", "Entrepreneurship and Startup Building"],
  ["Virtual Reality / Augmented Reality Entwicklung", "VR/AR Development"],
  ["Wissenschaftliche Forschung", "Scientific Research"],
  ["Writing", "Daily Writing Practice"],
  ["Writing Shortstories", "Short Story Writing"],
  ["YouTube Project", "YouTube Creation"],
  ["3D-Druck", "3D Printing"]
]);

const EXCLUDED_TITLES = new Set(["Sex", "Sex and Intimacy"]);

function normalizeKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "");
}

function parseCsv(content) {
  const normalizedContent = content.replace(/^\ufeff/, "");
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < normalizedContent.length; index += 1) {
    const char = normalizedContent[index];
    const next = normalizedContent[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        currentField += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    if (char !== "\r") {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const [headers = [], ...dataRows] = rows;
  return dataRows
    .filter((row) => row.some((field) => field.trim().length > 0))
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))
    );
}

function parseProjectName(projectName) {
  const match = projectName.match(/^\s*(\d+)\s*\/\s*100\s+(.+?)\s*$/);
  if (!match) {
    return null;
  }

  return {
    slot: Number(match[1]),
    title: match[2]
  };
}

function parseCompletedSessions(rawValue) {
  const match = rawValue.match(/(\d+)\s*\/\s*100/);
  return match ? Number(match[1]) : 0;
}

function dedupe(values) {
  return [...new Set(values.filter((value) => String(value).trim().length > 0))];
}

function buildSeeds(rows) {
  const byKey = new Map();

  for (const row of rows) {
    const parsed = parseProjectName(row["Project name"] ?? "");
    if (!parsed) {
      continue;
    }

    const rawTitle = parsed.title.trim();
    if (EXCLUDED_TITLES.has(rawTitle)) {
      continue;
    }

    const title = TITLE_OVERRIDES.get(rawTitle) ?? rawTitle;
    const key = normalizeKey(title);
    const status = (row.Status ?? "").trim() || "Not started";
    const startDate = (row["Start date"] ?? "").trim();
    const completedSessions = parseCompletedSessions((row.Pomodoros ?? "").trim());

    const current =
      byKey.get(key) ??
      {
        key,
        title,
        aliases: new Set([title]),
        slots: [],
        sourceTitles: [],
        status: "Not started",
        completedSessions: 0,
        sourceStartDates: []
      };

    current.aliases.add(rawTitle);
    current.aliases.add(title);
    current.slots.push(parsed.slot);
    current.sourceTitles.push(rawTitle);
    current.completedSessions = Math.max(current.completedSessions, completedSessions);

    if (status === "In progress") {
      current.status = "In progress";
    }

    if (startDate) {
      current.sourceStartDates.push(startDate);
    }

    byKey.set(key, current);
  }

  return [...byKey.values()]
    .map((seed) => ({
      key: seed.key,
      title: seed.title,
      aliases: dedupe([...seed.aliases]).sort((left, right) => left.localeCompare(right)),
      slots: dedupe(seed.slots).map(Number).sort((left, right) => left - right),
      sourceTitles: dedupe(seed.sourceTitles).sort((left, right) => left.localeCompare(right)),
      status: seed.status,
      completedSessions: seed.completedSessions,
      sourceStartDates: dedupe(seed.sourceStartDates).sort((left, right) =>
        left.localeCompare(right)
      )
    }))
    .sort((left, right) => left.slots[0] - right.slots[0]);
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3]
    ? path.resolve(process.cwd(), process.argv[3])
    : DEFAULT_OUTPUT_PATH;

  if (!inputPath) {
    console.error("Usage: node scripts/import-proof-yourself-csv.mjs <path-to-csv> [output-path]");
    process.exit(1);
  }

  const csvContent = fs.readFileSync(inputPath, "utf8");
  const seeds = buildSeeds(parseCsv(csvContent));
  const importedAtIso = new Date().toISOString();

  const output = `// This file is generated by scripts/import-proof-yourself-csv.mjs.\n// Do not edit manually.\n\nexport interface ImportedSkillSeed {\n  key: string;\n  title: string;\n  aliases: string[];\n  slots: number[];\n  sourceTitles: string[];\n  status: string;\n  completedSessions: number;\n  sourceStartDates: string[];\n}\n\nexport const IMPORTED_SKILLS_IMPORTED_AT = ${JSON.stringify(importedAtIso)};\n\nexport const IMPORTED_SKILL_SEEDS: ImportedSkillSeed[] = ${JSON.stringify(seeds, null, 2)};\n`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, "utf8");

  console.log(`Wrote ${seeds.length} imported skills to ${outputPath}`);
}

main();
