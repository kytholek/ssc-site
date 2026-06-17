from pathlib import Path
path = Path('codex/index.html')
raw = path.read_bytes()
text = raw.decode('utf-8')
print('decoded text sample:')
print(repr(text[0:300]))
for needle in ['Â·', 'Ã—', 'â€”', 'â†’', 'â†º', 'â€“', 'â”€', 'âš¡', 'â—‰', 'â—Œ', 'âˆ’', 'Ã¢']:
    idx = text.find(needle)
    print(needle, idx)
    if idx != -1:
        print(repr(text[max(0, idx-20):idx+60]))
        break
