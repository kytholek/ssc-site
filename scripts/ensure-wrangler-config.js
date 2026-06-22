'use strict';
/**
 * Writes wrangler.jsonc before deploy so Cloudflare CI cannot use a partial
 * dashboard config missing assets.directory.
 */
const fs = require('fs');
const path = require('path');

const config = {
  $schema: './node_modules/wrangler/config-schema.json',
  name: 'ssc-site',
  main: 'netlify/functions/worker.js',
  compatibility_date: '2024-09-23',
  assets: {
    directory: './',
    binding: 'ASSETS',
    run_worker_first: true,
    not_found_handling: 'single-page-application',
  },
};

const out = path.join(__dirname, '..', 'wrangler.jsonc');
fs.writeFileSync(out, JSON.stringify(config, null, 2) + '\n');
console.log('Wrote', out);
