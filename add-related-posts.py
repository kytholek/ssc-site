#!/usr/bin/env python3
"""Add related posts to all blog articles"""
import os
import re 

related_posts_map = {
    "life-path-1-numerology": [
        ("/blog/life-path-2-numerology/", "Life Path 2: The Bridge"),
        ("/blog/life-path-9-numerology/", "Life Path 9: The Sage"),
        ("/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/", "Path of Transformation"),
    ],
    "life-path-2-numerology": [
        ("/blog/life-path-1-numerology/", "Life Path 1: The Initiator"),
        ("/blog/life-path-3-numerology/", "Life Path 3: The Creator"),
        ("/blog/birth-name-vs-known-name-numerology/", "Birth Name vs Known Name"),
    ],
    "life-path-3-numerology": [
        ("/blog/life-path-2-numerology/", "Life Path 2: The Bridge"),
        ("/blog/life-path-4-numerology/", "Life Path 4: The Builder"),
        ("/blog/electric-magnetic-aether-three-natures-of-number/", "Electric Magnetic Aether"),
    ],
    "life-path-4-numerology": [
        ("/blog/life-path-3-numerology/", "Life Path 3: The Creator"),
        ("/blog/life-path-5-numerology/", "Life Path 5: The Explorer"),
        ("/blog/infinity-loop-cycles-recursion-numerology/", "The Infinity Loop"),
    ],
    "life-path-5-numerology": [
        ("/blog/life-path-4-numerology/", "Life Path 4: The Builder"),
        ("/blog/life-path-6-numerology/", "Life Path 6: The Care-Keeper"),
        ("/blog/how-to-calculate-life-path-number/", "How to Calculate Life Path"),
    ],
    "life-path-6-numerology": [
        ("/blog/life-path-5-numerology/", "Life Path 5: The Explorer"),
        ("/blog/life-path-7-numerology/", "Life Path 7: The Seeker"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "life-path-7-numerology": [
        ("/blog/life-path-6-numerology/", "Life Path 6: The Care-Keeper"),
        ("/blog/life-path-8-numerology/", "Life Path 8: The Executor"),
        ("/blog/shadow-side-of-numerology-numbers/", "The Shadow Side of Numerology"),
    ],
    "life-path-8-numerology": [
        ("/blog/life-path-7-numerology/", "Life Path 7: The Seeker"),
        ("/blog/life-path-9-numerology/", "Life Path 9: The Sage"),
        ("/blog/master-numbers-11-22-33-numerology/", "Master Numbers 11, 22, 33"),
    ],
    "life-path-9-numerology": [
        ("/blog/life-path-8-numerology/", "Life Path 8: The Executor"),
        ("/blog/3-6-9-pattern-tesla-numerology/", "The 3-6-9 Pattern"),
        ("/blog/666-numerology-meaning/", "666: The Sustaining Number"),
    ],
    "3-6-9-pattern-tesla-numerology": [
        ("/blog/life-path-9-numerology/", "Life Path 9: The Sage"),
        ("/blog/666-numerology-meaning/", "666: The Sustaining Number"),
        ("/blog/master-numbers-11-22-33-numerology/", "Master Numbers 11, 22, 33"),
    ],
    "666-numerology-meaning": [
        ("/blog/3-6-9-pattern-tesla-numerology/", "The 3-6-9 Pattern"),
        ("/blog/angel-numbers-being-read-wrong/", "Angel Numbers Being Read Wrong"),
        ("/blog/master-numbers-11-22-33-numerology/", "Master Numbers 11, 22, 33"),
    ],
    "angel-numbers-being-read-wrong": [
        ("/blog/666-numerology-meaning/", "666: The Sustaining Number"),
        ("/blog/pythagorean-vs-chaldean-numerology/", "Pythagorean vs Chaldean"),
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
    ],
    "birth-name-vs-known-name-numerology": [
        ("/blog/life-path-2-numerology/", "Life Path 2: The Bridge"),
        ("/blog/name-change-numerology-simulation/", "Name Change Numerology"),
        ("/blog/how-to-calculate-life-path-number/", "How to Calculate Life Path"),
    ],
    "codex-architecture-consciousness-matrix": [
        ("/blog/decoding-the-matrix-simulation-source-code/", "Decoding the Matrix"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "decoding-the-matrix-simulation-source-code": [
        ("/blog/codex-architecture-consciousness-matrix/", "The Codex Architecture"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "electric-magnetic-aether-three-natures-of-number": [
        ("/blog/life-path-3-numerology/", "Life Path 3: The Creator"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "how-to-calculate-life-path-number": [
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
        ("/blog/pythagorean-vs-chaldean-numerology/", "Pythagorean vs Chaldean"),
        ("/blog/birth-name-vs-known-name-numerology/", "Birth Name vs Known Name"),
    ],
    "infinity-loop-cycles-recursion-numerology": [
        ("/blog/life-path-4-numerology/", "Life Path 4: The Builder"),
        ("/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/", "Path of Transformation"),
        ("/blog/3-6-9-pattern-tesla-numerology/", "The 3-6-9 Pattern"),
    ],
    "life-path-number-explained": [
        ("/blog/how-to-calculate-life-path-number/", "How to Calculate Life Path"),
        ("/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/", "Path of Transformation"),
        ("/blog/pythagorean-vs-chaldean-numerology/", "Pythagorean vs Chaldean"),
    ],
    "master-numbers-11-22-33-numerology": [
        ("/blog/life-path-8-numerology/", "Life Path 8: The Executor"),
        ("/blog/3-6-9-pattern-tesla-numerology/", "The 3-6-9 Pattern"),
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
    ],
    "name-change-numerology-simulation": [
        ("/blog/birth-name-vs-known-name-numerology/", "Birth Name vs Known Name"),
        ("/blog/how-to-calculate-life-path-number/", "How to Calculate Life Path"),
        ("/blog/pythagorean-vs-chaldean-numerology/", "Pythagorean vs Chaldean"),
    ],
    "path-of-transformation-1-4-7-2-5-8-3-6-9": [
        ("/blog/life-path-1-numerology/", "Life Path 1: The Initiator"),
        ("/blog/infinity-loop-cycles-recursion-numerology/", "The Infinity Loop"),
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
    ],
    "pythagorean-vs-chaldean-numerology": [
        ("/blog/how-to-calculate-life-path-number/", "How to Calculate Life Path"),
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
        ("/blog/angel-numbers-being-read-wrong/", "Angel Numbers Being Read Wrong"),
    ],
    "shadow-side-of-numerology-numbers": [
        ("/blog/life-path-7-numerology/", "Life Path 7: The Seeker"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "simulation-theory-numerology-source-code": [
        ("/blog/codex-architecture-consciousness-matrix/", "The Codex Architecture"),
        ("/blog/decoding-the-matrix-simulation-source-code/", "Decoding the Matrix"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
    "theme-number-birth-year-numerology": [
        ("/blog/path-of-transformation-1-4-7-2-5-8-3-6-9/", "Path of Transformation"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
        ("/blog/life-path-number-explained/", "Life Path Number Explained"),
    ],
    "why-seven-frequencies-numerology": [
        ("/blog/codex-architecture-consciousness-matrix/", "The Codex Architecture"),
        ("/blog/decoding-the-matrix-simulation-source-code/", "Decoding the Matrix"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
    ],
    "evolution-of-energy-0-through-9": [
        ("/blog/3-6-9-pattern-tesla-numerology/", "The 3-6-9 Pattern"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
        ("/blog/simulation-theory-numerology-source-code/", "Simulation Theory"),
    ],
    "five-lenses-of-self-ego-mind-soul-spirit-void": [
        ("/blog/life-path-5-numerology/", "Life Path 5: The Explorer"),
        ("/blog/shadow-side-of-numerology-numbers/", "The Shadow Side of Numerology"),
        ("/blog/why-seven-frequencies-numerology/", "Why Seven Frequencies"),
    ],
}

def build_related_posts_html(posts):
    """Build the HTML for related posts section"""
    html = '  <div class="related-posts">\n'
    html += '    <div class="related-posts-title">Related Articles</div>\n'
    html += '    <div class="related-posts-grid">\n'
    
    for url, title in posts:
        html += f'      <a href="{url}" class="related-post-card">\n'
        html += f'        <div class="related-post-title">{title}</div>\n'
        html += '        <span class="related-post-link">Read More →</span>\n'
        html += '      </a>\n'
    
    html += '    </div>\n'
    html += '  </div>'
    return html

blog_root = r"c:\App Projects\Website\ssc-site\ssc-site2\ssc-site\blog"

count = 0
for dir_name in os.listdir(blog_root):
    dir_path = os.path.join(blog_root, dir_name)
    if not os.path.isdir(dir_path):
        continue
    
    index_file = os.path.join(dir_path, "index.html")
    if not os.path.exists(index_file):
        continue
    
    if dir_name not in related_posts_map:
        continue
    
    # Read file
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has related-posts
    if '<div class="related-posts">' in content:
        print(f"Skip: {dir_name} (already added)")
        continue
    
    # Build related posts HTML
    related_html = build_related_posts_html(related_posts_map[dir_name])
    
    # Insert before footer - find </div>\n</div>\n\n<footer> and insert related-posts before it
    pattern = r'(  </div>\s*</div>\s*\n\n)(<footer>)'
    new_content = re.sub(pattern, r'\1\n' + related_html + r'\n\n\2', content)
    
    if new_content != content:
        # Write back
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added: {dir_name}")
        count += 1
    else:
        print(f"Failed: {dir_name} (pattern not matched)")

print(f"\nDone! Processed {count} files.")
