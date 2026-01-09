const fs = require('fs');
const path = 'lib/services/questionnaire-hetero.service.ts';
try {
  const content = fs.readFileSync(path, 'utf8');
  const target = 'const { patient_gender, years_of_education, ...dbResponse } = response as any;';
  const replacement = `const { 
    patient_gender, 
    years_of_education, 
    total_raw_score,
    standard_score,
    standardized_value,
    ...dbResponse 
  } = response as any;`;

  if (content.includes(target)) {
    const newContent = content.replace(target, replacement);
    fs.writeFileSync(path, newContent);
    console.log('Success: Replaced content.');
  } else {
    console.log('Error: Target not found.');
  }
} catch (e) {
  console.error(e);
}
