from __future__ import annotations

import re
import shutil
from datetime import datetime
from pathlib import Path


ROOT = Path.home() / "xwechat_files" / "wxid_6p586amrjhon22_4737" / "msg" / "file" / "2026-07"


def find_secretary_dir() -> Path:
    candidates = [p for p in ROOT.iterdir() if p.is_dir()]
    return max(candidates, key=lambda p: len(list(p.glob("*.txt"))))


def normalize_fragment(text: str) -> str:
    text = text.replace("\ufeff", "")
    text = text.replace("□", "")
    text = text.replace("“ ", "“").replace(" ”", "”")
    text = text.replace("（ ", "（").replace(" ）", "）")
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])", "", text)
    text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[，。；：！？、）》])", "", text)
    text = re.sub(r"(?<=[《（])\s+(?=[\u4e00-\u9fffA-Za-z])", "", text)
    text = re.sub(r"(?<=[A-Za-z])\s+(?=[，。；：！？、）》])", "", text)
    text = re.sub(r"(?<=[，。；：！？、》）])\s+(?=[\u4e00-\u9fff])", "", text)
    text = text.replace("Chat GPT", "ChatGPT")
    text = text.replace("ArtificialIntelligence", "Artificial Intelligence")
    text = text.replace("AI （Artificial Intelligence） 在", "AI（Artificial Intelligence）在")
    text = text.replace("AI 写作", "AI写作")
    text = text.replace("AI 工具", "AI工具")
    text = text.replace("AI 技术", "AI技术")
    text = text.replace("AI 大模型", "AI大模型")
    text = text.replace("AIGC 趋势", "AIGC趋势")
    text = text.replace("GB/T 9704-2012", "GB/T 9704-2012")
    text = re.sub(r"[［\[]\d+[］\]]", "", text)
    text = re.sub(r"（\d+）", "", text)
    return text.strip()


def normalize_paragraph(text: str) -> str:
    text = normalize_fragment(text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])", "", text)
    text = text.replace("Artificial Intelligence Generated Content", "Artificial Intelligence Generated Content")
    text = text.replace("AI Hallucinations", "AI Hallucinations")
    text = text.replace("PREP 模式", "PREP模式")
    text = text.replace("算。法能力", "算法能力")
    text = text.replace("Meta 公示", "Meta 公司")
    text = text.replace("在Galactica", "在 Galactica")
    text = text.replace("起革乡村", "起草乡村")
    text = text.replace("公。文既要", "公文既要")
    text = text.replace("彰显了代公文", "彰显了AI时代公文")
    return text.strip()


def join_fragments(fragments: list[str]) -> str:
    text = ""
    for frag in fragments:
        frag = normalize_fragment(frag)
        if not frag:
            continue
        if text and re.search(r"[A-Za-z]$", text) and re.match(r"[A-Za-z]", frag):
            text += " "
        text += frag
    return normalize_paragraph(text)


def split_by_gaps(line: str, target1: int, target2: int) -> list[str]:
    gaps = [(m.start(), m.end()) for m in re.finditer(r" {2,}", line)]

    def choose(target: int, after: int = 0) -> tuple[int, int] | None:
        candidates = [
            gap
            for gap in gaps
            if gap[0] >= after and target - 9 <= gap[1] <= target + 9 and gap[1] - gap[0] >= 4
        ]
        if not candidates:
            return None
        return min(candidates, key=lambda gap: (abs(gap[1] - target), -1 * (gap[1] - gap[0])))

    g1 = choose(target1)
    if g1:
        g2 = choose(target2, g1[1])
    else:
        g2 = choose(target2)

    if g1 and g2:
        return [line[: g1[0]], line[g1[1] : g2[0]], line[g2[1] :]]
    if g2:
        return [line[: min(target1, g2[0])], line[min(target1, g2[0]) : g2[0]], line[g2[1] :]]
    return [line[:target1], line[target1:target2], line[target2:]]


def split_page12(line_no: int, line: str) -> list[str]:
    if line_no == 13:
        return ["人工智能生成内容（Artificial", "国外的研究多聚焦于自动化生", "短时间内生成一篇内容丰富的"]
    if line_no == 14:
        return ["Intelligence Generated Content）", "成、格式规范与内容准确性方", "文稿，提升公文起草效率。二"]
    if line_no == 23:
        return [
            "AI（Artificial Intelligence）在",
            "值平衡的探讨有待深化，也缺",
            "致写作主体性被蚕食，写作者",
        ]
    if line_no == 27:
        return [
            "鑫、唐琳、张娜等学者在《人",
            "避免公文写作沦为“技术流水",
            "作”。二是AI写作尚处在",
        ]
    parts = split_by_gaps(line, 34, 64)
    if line_no == 8 and parts[1].lstrip().startswith("工智能"):
        parts[1] = parts[1].replace("工智能", "人工智能", 1)
    return parts


def split_page13(line: str) -> list[str]:
    return split_by_gaps(line, 31, 61)


def split_page14(line: str) -> list[str]:
    return split_by_gaps(line, 34, 64)


def split_page15(line: str) -> list[str]:
    return split_by_gaps(line, 31, 61)


def collect_columns(lines: list[str], start: int, end: int, splitter, keep: int = 3) -> list[str]:
    cols = [[], [], []]
    for line_no in range(start, end + 1):
        parts = splitter(line_no, lines[line_no - 1]) if splitter is split_page12 else splitter(lines[line_no - 1])
        for idx in range(keep):
            frag = normalize_fragment(parts[idx])
            if frag:
                cols[idx].append(frag)
    return [join_fragments(col) for col in cols[:keep] if join_fragments(col)]


def rebuild_article(raw: str) -> str:
    lines = raw.splitlines()
    sections: list[str] = [
        "AIGC趋势下党政公文写作的认知升维",
        "作者：杨艺珂、张松林",
    ]

    # The source text is a three-column PDF extraction. These ranges are the article
    # body only; headers, footers, another article, the table, and references are excluded.
    sections.extend(collect_columns(lines, 8, 27, split_page12))
    sections.extend(collect_columns(lines, 48, 90, split_page13))
    sections.extend(collect_columns(lines, 95, 129, split_page14))
    page15 = [[], [], []]
    for line_no in range(145, 200):
        parts = split_page15(lines[line_no - 1])
        page15[0].append(parts[0])
        page15[1].append(parts[1])
        if line_no <= 162:
            page15[2].append(parts[2])
    sections.extend(join_fragments(col) for col in page15 if join_fragments(col))

    clean_sections = []
    for section in sections:
        section = normalize_paragraph(section)
        if not section:
            continue
        if any(bad in section for bad in ("参考文献", "作者单位", "秘书之友", "学习与修养", "表1")):
            continue
        clean_sections.append(section)

    repaired = "\n\n".join(clean_sections)
    repaired = repaired.replace("在《人\n\n人工智能", "在《人工智能")
    repaired = repaired.replace("“技术流水\n\n线产物”", "“技术流水线产物”")
    repaired = repaired.replace("人才市\n\n场需求", "人才市场需求")
    repaired = repaired.replace("可行之路国外", "可行之路。国外")
    repaired = repaired.replace("人文温度真正", "人文温度，真正")
    repaired = repaired.replace("“数智文秘” 。", "“数智文秘”。")
    repaired = repaired.replace("结语21 世纪", "结语\n\n21 世纪")
    return repaired + "\n"


def main() -> None:
    secretary_dir = find_secretary_dir()
    source = sorted(secretary_dir.glob("*.txt"))[0]
    raw = source.read_text(encoding="utf-8")
    repaired = rebuild_article(raw)

    backup = source.with_suffix(source.suffix + f".bak_{datetime.now():%Y%m%d_%H%M%S}")
    shutil.copy2(source, backup)
    source.write_text(repaired, encoding="utf-8", newline="\n")

    product_root = next((p for p in secretary_dir.iterdir() if p.is_dir() and p.name == "成品"), None)
    if product_root:
        product_dir = product_root / "2025_秘书学_秘书之友_001"
        product_dir.mkdir(parents=True, exist_ok=True)
        (product_dir / "2025_秘书学_秘书之友_001.txt").write_text(repaired, encoding="utf-8", newline="\n")

    print(f"SOURCE={source}")
    print(f"BACKUP={backup}")
    print(f"CHARS={len(repaired)}")
    print("PREVIEW_START")
    print(repaired[:900])
    print("PREVIEW_END")
    print(repaired[-900:])


if __name__ == "__main__":
    main()
