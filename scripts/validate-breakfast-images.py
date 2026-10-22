#!/usr/bin/env python3
"""Validate individual SmartBasket recipe assets. No files are modified."""
import json, sys
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    sys.exit("Install Pillow first: python -m pip install Pillow")
root = Path(__file__).resolve().parents[2]
batch = json.loads((root / "docs" / "breakfast-image-production.json").read_text(encoding="utf-8"))
errors = []
for item in batch["images"]:
    path = root / item["targetPath"]
    if not path.is_file():
        errors.append(f"MISSING: {path.relative_to(root)}")
        continue
    try:
        with Image.open(path) as im:
            w, h = im.size
            if im.format != "WEBP": errors.append(f"NOT WEBP: {path.name}")
            if w < 1200 or h < 900: errors.append(f"TOO SMALL: {path.name}: {w}x{h}")
            if abs(w / h - 4 / 3) > .025: errors.append(f"WRONG RATIO: {path.name}: {w}x{h}")
    except Exception as exc:
        errors.append(f"UNREADABLE: {path.name}: {exc}")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"PASS: {len(batch['images'])} separate WebP recipe assets validated.")
