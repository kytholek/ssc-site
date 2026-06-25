'use strict';
async function probe(url, method, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  console.log(method, url, '→', res.status, text.slice(0, 200));
}

(async () => {
  const base = 'https://simulationsourcecode.com';
  await probe(base + '/api/session', 'OPTIONS');
  await probe(base + '/api/session', 'POST', { email: 'test@example.com', name: 'Test', month: '1', day: '1', year: '1990' });
  console.log('\nProduction uses Cloudflare Worker → POST /api/session');
})().catch(console.error);
