import fs from 'fs';
// Use raw string for Windows path to avoid escaping issues if possible, or just escape backslashes
const inputPath = 'C:/Users/readb/.gemini/antigravity/brain/2f6428e8-3810-4d16-ace6-bb882fda5cdb/.system_generated/steps/124/output.txt';
const content = fs.readFileSync(inputPath, 'utf8');
const json = JSON.parse(content);
fs.writeFileSync('supabase.ts', json.types);
console.log('Types extracted to supabase.ts');
