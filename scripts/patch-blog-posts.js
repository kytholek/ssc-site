'use strict';
const fs = require('fs');
const path = require('path');

const blogRoot = path.join(__dirname, '..', 'blog');
const themeScript = "<script>(function(){try{var t=localStorage.getItem('ssc-theme');if(t==='light')document.documentElement.dataset.theme='light';}catch(e){}})();</script>";
const cssLinks = [
  '<link rel="stylesheet" href="/css/style.css">',
  '<link rel="stylesheet" href="/css/brand-revamp.css">',
  '<link rel="stylesheet" href="/css/blog-post.css">',
].join('\n  ');

let count = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name === 'index.html' && path.resolve(dir) !== path.resolve(blogRoot)) {
      let html = fs.readFileSync(p, 'utf8');
      const orig = html;

      if (!html.includes('ssc-theme')) {
        html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n  ' + themeScript);
      }
      if (!html.includes('brand-revamp.css')) {
        html = html.replace(
          '<link rel="stylesheet" href="/css/style.css">',
          cssLinks
        );
      }
      html = html.replace(/\s*<style>[\s\S]*?\/\* Standalone post overrides \*\/[\s\S]*?<\/style>\s*/g, '\n');
      html = html.replace('<body>', '<body class="post-page">');

      if (html !== orig) {
        fs.writeFileSync(p, html);
        count++;
      }
    }
  }
}

walk(blogRoot);
console.log('Updated', count, 'blog posts');
