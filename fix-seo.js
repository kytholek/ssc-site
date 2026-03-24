const fs = require('fs');

function edit(filePath, fn) {
  let c = fs.readFileSync(filePath, 'utf8');
  const before = c;
  c = fn(c);
  if (c === before) {
    console.warn('NO CHANGE: ' + filePath);
  } else {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('OK: ' + filePath);
  }
}

const base = 'c:/App Projects/Website/ssc-site/ssc-site2/ssc-site/blog/';

// 1. life-path-7-numerology
edit(base + 'life-path-7-numerology/index.html', c => {
  c = c.replace(/<title>Life Path 7 in Numerology: The Seeker[\s\S]*?<\/title>/, '<title>Life Path 7 Numerology: The Seeker</title>');
  c = c.replace(
    '<meta name="description" content="Life Path 7 keeps stripping away what you thought you knew to force you toward genuine truth.">',
    '<meta name="description" content="Life Path 7 keeps stripping away what you thought was solid. SSC decodes the compound numbers and shadow patterns behind your search for truth.">\r\n  <meta name="keywords" content="life path 7 numerology, life path 7 meaning, numerology 7, life path number 7, SSC numerology, simulation source code">'
  );
  return c;
});

// 2. life-path-9-numerology
edit(base + 'life-path-9-numerology/index.html', c => {
  c = c.replace(/<title>Life Path 9 in Numerology: The Completor[\s\S]*?<\/title>/, '<title>Life Path 9 Numerology: The Completor</title>');
  c = c.replace(
    '<meta name="description" content="Life Path 9 keeps bringing things to completion and asking whether you can release what is finished.">',
    '<meta name="description" content="Life Path 9 keeps bringing things to completion. SSC decodes the compound numbers behind your drive to bring things to their final form \u2014 and what the shadow looks like.">\r\n  <meta name="keywords" content="life path 9 numerology, life path 9 meaning, numerology 9, life path number 9, SSC numerology, simulation source code">'
  );
  return c;
});

// 3. five-lenses-of-self-ego-mind-soul-spirit-void
edit(base + 'five-lenses-of-self-ego-mind-soul-spirit-void/index.html', c => {
  c = c.replace(
    '<meta name="description" content="The five lenses of consciousness: ego, mind, soul, spirit, and void.">',
    '<meta name="description" content="The five lenses of consciousness \u2014 ego, mind, soul, spirit, and void \u2014 each filter reality differently. Understanding which lens you\'re looking through changes everything about how you interpret your numbers.">\r\n  <meta name="keywords" content="five lenses of self, ego mind soul spirit numerology, consciousness numerology, SSC numerology, simulation source code">'
  );
  c = c.replace('<title>Five Lenses of Self</title>', '<title>Five Lenses of Self: Ego, Mind, Soul, Spirit &amp; Void</title>');
  return c;
});

// 4. why-seven-frequencies-numerology
edit(base + 'why-seven-frequencies-numerology/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Why numerology uses a seven-frequency system instead of nine. The answer is in the architecture of human experience.">',
    '<meta name="description" content="Most numerology systems give you one or two numbers. SSC uses seven \u2014 each calculated from your birth data and name, each revealing a different layer of your simulation. Here\'s why seven.">\r\n  <meta name="keywords" content="why seven frequencies numerology, numerology frequencies, seven numbers numerology, SSC numerology, simulation source code">'
  );
  c = c.replace('<title>Why Seven Frequencies</title>', '<title>Why Numerology Uses Seven Frequencies</title>');
  return c;
});

// 5. birth-name-vs-known-name-numerology
edit(base + 'birth-name-vs-known-name-numerology/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Do you use the name on your birth certificate, or the name you actually go by? The answer matters more than you think.">',
    '<meta name="description" content="Do you use the name on your birth certificate or the name you go by? In SSC numerology, the answer changes your entire Internal Circuit. Here\'s how to know which name to use.">\r\n  <meta name="keywords" content="birth name numerology, known name numerology, which name numerology, name numerology calculator, SSC numerology, simulation source code">'
  );
  c = c.replace('<title>Which Name Do You Use? Birth Name vs. Known Name in Numerology</title>', '<title>Birth Name vs. Known Name in Numerology</title>');
  return c;
});

// 6. simulation-theory-numerology-source-code
edit(base + 'simulation-theory-numerology-source-code/index.html', c => {
  c = c.replace(/<title>You Are Running on a Simulation[\s\S]*?<\/title>/, '<title>Simulation Theory &amp; Numerology: The Connection</title>');
  c = c.replace(
    '<meta name="description" content="Modern physics increasingly suggests reality is information. If the universe is computational, the numbers encoded in your birth and name are literal parameters of your simulation.">',
    '<meta name="description" content="Modern physics increasingly suggests reality is information. If the universe is computational, the numbers encoded in your birth and name are literal parameters of your simulation.">\r\n  <meta name="keywords" content="simulation theory numerology, numerology simulation, reality source code numerology, SSC numerology, simulation source code">'
  );
  return c;
});

// 7. life-path-4 — replace existing generic keywords
edit(base + 'life-path-4-numerology/index.html', c => {
  c = c.replace(
    '<meta name="keywords" content="life path 4 numerology, numerology, life path number, SSC numerology, simulation source code">',
    '<meta name="keywords" content="life path 4 numerology, life path 4 meaning, numerology 4, life path number 4, SSC numerology, simulation source code">'
  );
  return c;
});

// 7. life-path-5
edit(base + 'life-path-5-numerology/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Life Path 5 is the central pivot where change teaches you that true stability comes from your presence.">',
    '<meta name="description" content="Life Path 5 is the central pivot where change teaches you that true stability comes from your presence.">\r\n  <meta name="keywords" content="life path 5 numerology, life path 5 meaning, numerology 5, life path number 5, SSC numerology, simulation source code">'
  );
  return c;
});

// 7. life-path-6
edit(base + 'life-path-6-numerology/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="Life Path 6 keeps placing people who need your care in your path[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="life path 6 numerology, life path 6 meaning, numerology 6, life path number 6, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. 3-6-9-pattern-tesla-numerology
edit(base + '3-6-9-pattern-tesla-numerology/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Tesla said 3, 6, and 9 were the key to the universe. The Codex shows exactly why \u2014 and what these three frequencies reveal about Mind, Body, and Spirit.">',
    '<meta name="description" content="Tesla said 3, 6, and 9 were the key to the universe. The Codex shows exactly why \u2014 and what these three frequencies reveal about Mind, Body, and Spirit.">\r\n  <meta name="keywords" content="369 pattern numerology, Tesla 3 6 9, three six nine pattern, numerology patterns, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. 666-numerology-meaning
edit(base + '666-numerology-meaning/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="One of the most feared number sequences in Western culture[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="666 numerology meaning, 666 meaning, angel number 666, numerology 666, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. angel-numbers-being-read-wrong
edit(base + 'angel-numbers-being-read-wrong/index.html', c => {
  c = c.replace(
    '<meta name="description" content="The internet gives angel numbers a universal meaning. But the message is always personal \u2014 stripping out context strips out the most important part of the code.">',
    '<meta name="description" content="The internet gives angel numbers a universal meaning. But the message is always personal \u2014 stripping out context strips out the most important part of the code.">\r\n  <meta name="keywords" content="angel numbers, angel numbers meaning, how to read angel numbers, angel number interpretation, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. codex-architecture-consciousness-matrix
edit(base + 'codex-architecture-consciousness-matrix/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="The 3\u00d73 Codex is not a personality chart[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="numerology codex, consciousness matrix numerology, architecture of consciousness, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. decoding-matrix
edit(base + 'decoding-matrix/index.html', c => {
  c = c.replace(
    '<meta name="description" content="The complete architecture of Simulation Source Code \u2014 holographic reality, the Codex, nine frequencies, and seven-number personal blueprint.">',
    '<meta name="description" content="The complete architecture of Simulation Source Code \u2014 holographic reality, the Codex, nine frequencies, and seven-number personal blueprint.">\r\n  <meta name="keywords" content="decoding the matrix numerology, simulation source code matrix, numerology architecture, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. decoding-the-matrix-simulation-source-code
edit(base + 'decoding-the-matrix-simulation-source-code/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Learn about decoding-the-matrix-simulation-source-code in Simulation Source Code.">',
    '<meta name="description" content="Learn about decoding-the-matrix-simulation-source-code in Simulation Source Code.">\r\n  <meta name="keywords" content="decoding matrix simulation, simulation source code, matrix numerology, SSC numerology">'
  );
  return c;
});

// 8. electric-magnetic-aether-three-natures-of-number
edit(base + 'electric-magnetic-aether-three-natures-of-number/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="The nine frequencies are not equal in kind[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="electric magnetic aether numerology, three natures of number, energy numerology, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. evolution-of-energy-0-through-9 — trim description to under 155 chars + add keywords
edit(base + 'evolution-of-energy-0-through-9/index.html', c => {
  c = c.replace(
    /(<meta name="description" content=")From the Void of Zero to the Dispersal of Nine[^"]*(")/,
    '$1From the Void of Zero to the Dispersal of Nine \u2014 the complete evolution of energy through the numerical frequencies and what each stage means for your simulation.$2'
  );
  c = c.replace(
    '<meta name="description" content="From the Void of Zero to the Dispersal of Nine \u2014 the complete evolution of energy through the numerical frequencies and what each stage means for your simulation.">',
    '<meta name="description" content="From the Void of Zero to the Dispersal of Nine \u2014 the complete evolution of energy through the numerical frequencies and what each stage means for your simulation.">\r\n  <meta name="keywords" content="evolution of energy numerology, numbers 0 through 9 meaning, numerology energy, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. how-to-calculate-life-path-number
edit(base + 'how-to-calculate-life-path-number/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="A step-by-step walkthrough of the Pythagorean reduction method[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="how to calculate life path number, life path number calculator, numerology calculation, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. infinity-loop-cycles-recursion-numerology
edit(base + 'infinity-loop-cycles-recursion-numerology/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="Hidden in the Codex Sigil is a sequence of nine numbers[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="infinity loop numerology, numerology cycles, recursion numerology, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. life-path-number-explained
edit(base + 'life-path-number-explained/index.html', c => {
  c = c.replace(
    '<meta name="description" content="Of all seven frequencies, Life Path is the most fundamental. It describes not what you will do, but what you are here to learn.">',
    '<meta name="description" content="Of all seven frequencies, Life Path is the most fundamental. It describes not what you will do, but what you are here to learn.">\r\n  <meta name="keywords" content="life path number explained, what is life path number, life path numerology, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. master-numbers-11-22-33-numerology
edit(base + 'master-numbers-11-22-33-numerology/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="When a number reduces to 11, 22, or 33, the rules change[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="master numbers numerology, 11 22 33 numerology, master number meaning, numerology master numbers, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. name-change-numerology-simulation
edit(base + 'name-change-numerology-simulation/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="People change their names hoping to change their frequency[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="name change numerology, changing name numerology, numerology name change effect, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. path-of-transformation-1-4-7-2-5-8-3-6-9
edit(base + 'path-of-transformation-1-4-7-2-5-8-3-6-9/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="The Codex encodes a specific nine-step sequence[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="path of transformation numerology, numerology transformation sequence, 1 4 7 numerology, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. pythagorean-vs-chaldean-numerology
edit(base + 'pythagorean-vs-chaldean-numerology/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="Two major traditions assign different values to letters[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="pythagorean vs chaldean numerology, chaldean numerology, pythagorean numerology, which numerology system, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. shadow-side-of-numerology-numbers
edit(base + 'shadow-side-of-numerology-numbers/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="Every number carries both gift and challenge[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="shadow numerology, dark side numerology numbers, numerology shadow self, SSC numerology, simulation source code">'
  );
  return c;
});

// 8. theme-number-birth-year-numerology
edit(base + 'theme-number-birth-year-numerology/index.html', c => {
  c = c.replace(
    /(<meta name="description" content="Of the seven frequencies in your blueprint, the Theme number is the least understood[^"]*">)/,
    '$1\r\n  <meta name="keywords" content="theme number numerology, birth year numerology, numerology birth year meaning, SSC numerology, simulation source code">'
  );
  return c;
});

console.log('All edits complete.');
