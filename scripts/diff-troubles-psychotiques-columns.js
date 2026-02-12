const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const questionnairePath = path.join(
  repoRoot,
  "lib",
  "questionnaires",
  "schizophrenia",
  "initial",
  "medical",
  "troubles-psychotiques.ts",
);
const initSqlPath = path.join(repoRoot, "supabase", "migrations", "000_complete_init.sql");

const qtxt = fs.readFileSync(questionnairePath, "utf8");
const sqltxt = fs.readFileSync(initSqlPath, "utf8");

const ids = [...qtxt.matchAll(/\bid:\s*"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((id) => !id.startsWith("section_"));
const idsSet = new Set(ids);

const tableMatch = sqltxt.match(
  /CREATE TABLE IF NOT EXISTS "public"\."schizophrenia_troubles_psychotiques" \(([^]*?)\);/,
);
if (!tableMatch) {
  console.error("create table block not found");
  process.exit(1);
}

const block = tableMatch[1];
const cols = [...block.matchAll(/\n\s*"([^"]+)"\s+/g)].map((m) => m[1]);
const colsSet = new Set(cols);

const missing = [...idsSet].filter((id) => !colsSet.has(id)).sort();

console.log("Question ids:", idsSet.size);
console.log("Table cols:", colsSet.size);
console.log("Missing:", missing.length);
console.log(missing.join("\n"));
