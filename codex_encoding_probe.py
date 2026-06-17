from pathlib import Path
path = Path('codex/index.html')
raw = path.read_bytes()
print('length', len(raw))
for needle in [b'3\xc3\x83\xc2\x97', b'\xc3\x82\xc2\xb7', b'\xc3\x82\xc2\xb0\xc3\x82\xc2\xb0', b'\xc3\x83\xc2\xa2\xc3\x82\xc2\xac\xc3\x82\xc2\x80\xc3\x82\xc2\x9d']:
    idx = raw.find(needle)
    print(needle, idx)
    if idx != -1:
        print(raw[max(0, idx-20):idx+50])
