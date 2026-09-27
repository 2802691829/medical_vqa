from __future__ import annotations

from pathlib import Path

import openpyxl


ROOT = Path.home() / "xwechat_files" / "wxid_6p586amrjhon22_4737" / "msg" / "file" / "2026-07"


def main() -> None:
    secretary_dir = max([p for p in ROOT.iterdir() if p.is_dir()], key=lambda p: len(list(p.glob("*.txt"))))
    out_root = secretary_dir / "成品"
    folders = sorted([p for p in out_root.iterdir() if p.is_dir()])
    txts = sorted(out_root.rglob("*.txt"))
    xlsxs = sorted(out_root.rglob("*.xlsx"))

    problems = []
    for folder in folders:
        folder_txts = list(folder.glob("*.txt"))
        folder_xlsxs = list(folder.glob("*.xlsx"))
        if len(folder_txts) != 1 or len(folder_xlsxs) != 1:
            problems.append(("file_count", str(folder)))

    for txt in txts:
        text = txt.read_text(encoding="utf-8")
        lines = text.splitlines()
        if len(lines) < 3 or lines[0].startswith("论文名：") or lines[1].startswith("作者："):
            problems.append(("header", str(txt), lines[:3]))
        for marker in ["参考文献", "作者单位", "秘书之友", "学习与修养", "\ufffd", "■", "□"]:
            if marker in text:
                problems.append((f"residual:{marker}", str(txt), text.find(marker)))

    wb = openpyxl.load_workbook(xlsxs[0], read_only=True)
    ws = wb.active
    headers = [ws.cell(1, c).value for c in range(1, 7)]

    print(f"OUT={out_root}")
    print(f"FOLDERS={len(folders)} TXTS={len(txts)} XLSX={len(xlsxs)}")
    print(f"PROBLEMS={len(problems)}")
    for item in problems[:30]:
        print("PROBLEM", item)
    print("XLSX_HEADERS=" + "|".join(str(h) for h in headers))
    for seq in ["001", "007", "009", "015", "017"]:
        sample = next(p for p in txts if p.parent.name.endswith("_" + seq))
        print(f"SAMPLE_{seq}=" + sample.read_text(encoding="utf-8")[:260].replace("\n", " | "))


if __name__ == "__main__":
    main()
