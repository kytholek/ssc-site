#!/usr/bin/env node

/**
 * Convert translations.json to translations.js
 * Usage: node convert-translations.js
 * 
 * This script reads from translations.json (clean, easy-to-edit format)
 * and generates js/translations.js (JavaScript object format)
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'translations.json');
const OUTPUT_FILE = path.join(__dirname, 'js', 'translations.js');

try {
  // Read the JSON file
  const jsonContent = fs.readFileSync(INPUT_FILE, 'utf-8');
  const translations = JSON.parse(jsonContent);

  // Get all unique keys
  const allKeys = new Set();
  Object.values(translations).forEach(lang => {
    Object.keys(lang).forEach(key => allKeys.add(key));
  });
  const sortedKeys = Array.from(allKeys).sort();

  // Build the JavaScript output
  let jsOutput = `// ════════════════════════════════════════════════════════════
//  SSC TRANSLATIONS
//  Auto-generated from translations.json
//  Edit translations.json, then run: node convert-translations.js
//
//  Usage: every element with data-i18n="key" gets its text
//         swapped when the language changes.
//
//  To add a translation:
//    1. Add it to translations.json in both "en" and "es" sections
//    2. Run: node convert-translations.js
//    3. Add data-i18n="key" to your HTML element
//  ════════════════════════════════════════════════════════════

var SSC_TRANSLATIONS = {
`;

  // Build entries grouped by section
  let currentSection = '';
  sortedKeys.forEach(key => {
    const section = key.split('.')[0];
    
    // Add section comment when it changes
    if (section !== currentSection) {
      if (currentSection !== '') jsOutput += '\n';
      const sectionNames = {
        'nav': '── Navigation',
        'home': '── Home',
        'footer': '── Footer',
        'about': '── About',
        'books': '── Books',
        'calc': '── Calculator',
        'blog': '── Blog',
        'privacy': '── Privacy'
      };
      const displayName = sectionNames[section] || `── ${section}`;
      jsOutput += `\n  // ${displayName} ${'─'.repeat(50 - displayName.length)}\n`;
      currentSection = section;
    }

    // Build the line
    const enValue = translations.en[key] || '';
    const esValue = translations.es[key] || '';
    
    // Escape quotes and special chars for JavaScript strings
    const escapeString = (str) => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n');
    };

    const enEscaped = escapeString(enValue);
    const esEscaped = escapeString(esValue);

    // Format the entry
    jsOutput += `  '${key}' : { en: '${enEscaped}', es: '${esEscaped}' },\n`;
  });

  jsOutput += `\n};\n`;

  // Write the JavaScript file
  fs.writeFileSync(OUTPUT_FILE, jsOutput, 'utf-8');
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log(`✓ ${sortedKeys.length} translation keys exported`);

} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
