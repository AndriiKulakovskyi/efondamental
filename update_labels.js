const fs = require('fs');
const path = 'lib/constants/questionnaires-hetero.ts';
try {
  let content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  // lines are 0-indexed in array, but 1-indexed in my editor views.
  // View start 8972 -> array index 8971.
  const startIdx = 8971; 
  const endIdx = 9940;

  let count = 0;
  for (let i = startIdx; i < Math.min(endIdx, lines.length); i++) {
    let replaced = false;
    if (lines[i].includes("label: 'Incorrect'")) {
      lines[i] = lines[i].replace("label: 'Incorrect'", "label: '0'");
      replaced = true;
    }
    if (lines[i].includes("label: 'Correct'")) {
      lines[i] = lines[i].replace("label: 'Correct'", "label: '1'");
      replaced = true;
    }
    if (replaced) count++;
  }

  fs.writeFileSync(path, lines.join('\n'));
  console.log(`Replaced ${count} lines.`);
} catch (e) {
  console.error(e);
}
