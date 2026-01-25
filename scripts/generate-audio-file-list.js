#!/usr/bin/env node
/**
 * Generate a list of all audio file names needed for 365 days of devotions
 */

const fs = require('fs');
const path = require('path');

// Read devotionals from constants
const devotionalsPath = path.join(__dirname, '../constants/devotionals.ts');
const content = fs.readFileSync(devotionalsPath, 'utf-8');

// Extract devotion titles using regex
const titleMatches = content.matchAll(/title:\s*"([^"]+)"/g);
const titles = Array.from(titleMatches).map(match => match[1]);

console.log('='.repeat(70));
console.log('📁 AUDIO FILE NAMES FOR 365 DAYS OF DEVOTIONS');
console.log('='.repeat(70));
console.log();
console.log(`Found ${titles.length} devotions`);
console.log();

// Convert title to file name
function titleToFileName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Generate list
console.log('COMPLETE LIST OF FILE NAMES NEEDED:');
console.log('-'.repeat(70));
console.log();

titles.forEach((title, index) => {
  const fileName = titleToFileName(title);
  const day = index + 1;
  console.log(`${fileName}.mp3  # Day ${day}: ${title}`);
});

console.log();
console.log('='.repeat(70));
console.log(`✅ Total files needed: ${titles.length}`);
console.log('='.repeat(70));
console.log();
console.log('Copy this list and create your MP3 files with these exact names!');
console.log();

// Also save to a file
const outputPath = path.join(__dirname, '../audio-file-list.txt');
const outputContent = titles.map((title, index) => {
  const fileName = titleToFileName(title);
  return `${fileName}.mp3  # Day ${index + 1}: ${title}`;
}).join('\n');

fs.writeFileSync(outputPath, outputContent);
console.log(`📄 List also saved to: audio-file-list.txt`);
