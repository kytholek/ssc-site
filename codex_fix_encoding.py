from pathlib import Path

path = Path('codex/index.html')
raw = path.read_bytes()
text = raw.decode('utf-8')
# The file is double-encoded UTF-8: decode once, then reinterpret as Latin-1 bytes and decode again.
fixed = text.encode('latin-1').decode('utf-8')
# Remove any accidental BOM characters introduced by previous mis-encodings.
if fixed.startswith('\ufeff'):
    fixed = fixed.lstrip('\ufeff')
path.write_text(fixed, encoding='utf-8')
print('done')
