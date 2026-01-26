#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read devotionals file
const devotionalsPath = path.join(__dirname, '../constants/devotionals.ts');
const devotionalsContent = fs.readFileSync(devotionalsPath, 'utf8');

// Extract all devotional titles
const titleMatches = devotionalsContent.matchAll(/title:\s*['"](.*?)['"]/g);
const devotionTitles = Array.from(titleMatches).map(match => match[1]);

// Convert title to kebab-case
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Check audio directory
const audioDir = path.join(__dirname, '../assets/audio');
const existingMp3Files = fs.readdirSync(audioDir)
  .filter(f => f.endsWith('.mp3'))
  .map(f => f.replace('.mp3', ''));

const existingJpgFiles = fs.readdirSync(audioDir)
  .filter(f => f.endsWith('.jpg'))
  .map(f => f.replace('.jpg', ''));

console.log('\n📊 FIRST 33 DAYS VERIFICATION REPORT\n');
console.log('='.repeat(70));

let completeCount = 0;
let missingAudio = [];
let missingArt = [];

for (let day = 1; day <= 33; day++) {
  const title = devotionTitles[day - 1];
  const fileName = toKebabCase(title);
  const hasMp3 = existingMp3Files.includes(fileName);
  const hasJpg = existingJpgFiles.includes(fileName);
  
  const status = hasMp3 && hasJpg ? '✅' : hasMp3 ? '🎵' : '❌';
  const statusText = hasMp3 && hasJpg ? 'COMPLETE' : hasMp3 ? 'NO ART' : 'MISSING';
  
  console.log(`Day ${day.toString().padStart(2)}: ${status} ${statusText.padEnd(10)} | ${title}`);
  
  if (hasMp3 && hasJpg) {
    completeCount++;
  } else if (!hasMp3) {
    missingAudio.push({ day, title, fileName });
  } else if (!hasJpg) {
    missingArt.push({ day, title, fileName });
  }
}

console.log('='.repeat(70));
console.log(`\n📈 SUMMARY:`);
console.log(`   ✅ Complete (Audio + Art): ${completeCount}/33`);
console.log(`   ❌ Missing Audio: ${missingAudio.length}`);
console.log(`   🎵 Missing Art Only: ${missingArt.length}`);

if (missingAudio.length > 0) {
  console.log(`\n❌ Missing Audio Files:`);
  missingAudio.forEach(({ day, title, fileName }) => {
    console.log(`   Day ${day}: ${fileName}.mp3`);
  });
}

if (missingArt.length > 0) {
  console.log(`\n🎵 Missing Album Art (MP3 exists):`);
  missingArt.forEach(({ day, title, fileName }) => {
    console.log(`   Day ${day}: ${fileName}.jpg`);
  });
}

if (completeCount === 33) {
  console.log(`\n🎉 ALL 33 DAYS ARE COMPLETE! 🎉\n`);
} else {
  console.log(`\n⚠️  ${33 - completeCount} days need attention\n`);
}
