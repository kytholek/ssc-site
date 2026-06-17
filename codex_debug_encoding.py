from pathlib import Path
path = Path('codex/index.html')
data = path.read_bytes()
print('length', len(data))
print(data[:80])
for i in range(0, 80):
    print(i, hex(data[i]), chr(data[i]) if 32 <= data[i] < 127 else '.', end='\n')
