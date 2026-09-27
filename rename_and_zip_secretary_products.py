from __future__ import annotations

import os
import zipfile
from datetime import datetime
from pathlib import Path


ROOT = Path.home() / "xwechat_files" / "wxid_6p586amrjhon22_4737" / "msg" / "file" / "2026-07"
OLD_PART = "_秘书学_秘书之友_"
NEW_PART = "_秘书学_学术期刊_秘书之友_"


def find_secretary_dir() -> Path:
    dirs = [p for p in ROOT.iterdir() if p.is_dir()]
    return max(dirs, key=lambda p: len(list(p.glob("*.txt"))))


def main() -> None:
    secretary_dir = find_secretary_dir()
    out_root = secretary_dir / "成品"
    if not out_root.exists():
        raise FileNotFoundError(out_root)

    for folder in sorted([p for p in out_root.iterdir() if p.is_dir()], reverse=True):
        if OLD_PART not in folder.name and NEW_PART not in folder.name:
            continue
        target_folder = folder.with_name(folder.name.replace(OLD_PART, NEW_PART))
        for item in sorted(folder.iterdir()):
            if OLD_PART in item.name:
                item.rename(item.with_name(item.name.replace(OLD_PART, NEW_PART)))
        if folder.name != target_folder.name:
            if target_folder.exists():
                raise FileExistsError(target_folder)
            folder.rename(target_folder)

    zip_path = secretary_dir / f"秘书成品_学术期刊_秘书之友_{datetime.now():%Y%m%d_%H%M%S}.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for path in sorted(out_root.rglob("*")):
            if path.is_file():
                zf.write(path, path.relative_to(secretary_dir))

    folders = sorted([p for p in out_root.iterdir() if p.is_dir()])
    txts = sorted(out_root.rglob("*.txt"))
    xlsxs = sorted(out_root.rglob("*.xlsx"))
    bad = []
    for folder in folders:
        if OLD_PART in folder.name or NEW_PART not in folder.name:
            bad.append(str(folder))
        for item in folder.iterdir():
            if item.is_file() and OLD_PART in item.name:
                bad.append(str(item))
    print(f"OUT={out_root}")
    print(f"ZIP={zip_path}")
    print(f"ZIP_SIZE={zip_path.stat().st_size}")
    print(f"FOLDERS={len(folders)} TXTS={len(txts)} XLSX={len(xlsxs)} BAD={len(bad)}")
    for sample in folders[:3]:
        print(f"SAMPLE_FOLDER={sample.name}")


if __name__ == "__main__":
    main()
