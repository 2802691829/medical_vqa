from __future__ import annotations

import json
import re
import zipfile
from collections import Counter
from pathlib import Path

import jieba
import jieba.posseg as pseg
import pandas as pd


BASE = Path("C:/Users/28026/xwechat_files/wxid_6p586amrjhon22_4737/msg/file/2026-07") / "秘书" / "秘书"
SRC = BASE / "“点线面体”全链条提升督查督办效能-李亚伟.txt"
OUT_DIR = BASE / "成品" / "点线面体全链条提升督查督办效能-李亚伟"
OUT_DIR.mkdir(parents=True, exist_ok=True)


STOPWORDS = {
    "的", "了", "和", "与", "及", "在", "对", "把", "被", "为", "以", "等", "中", "上", "下", "要",
    "是", "有", "也", "就", "都", "而", "或", "一个", "一种", "通过", "进行", "不断", "同时",
    "以及", "对于", "方面", "工作", "公司", "任务", "实现", "形成", "确保", "提升", "推动",
}

DOMAIN_TERMS = [
    "督查督办", "全链条", "点线面体", "立项定题", "督办催办", "复核审查", "结果运用",
    "闭环管理", "党委办公室", "三服务", "督办通知单", "督办提示函", "督办警示函",
    "红黄绿预警", "回头看", "评分体系", "高质量发展", "资源优化", "精益管理",
    "全自动钻机", "碳资产管理", "能源安全", "新质生产力", "数智转型", "绿色低碳",
]


def decode_text(path: Path) -> str:
    data = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "gb18030", "gbk"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def normalize_fragment(text: str) -> str:
    text = text.replace("\u3000", " ")
    text = re.sub(r"[ \t]+", " ", text.strip())
    text = re.sub(r"(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])", "", text)
    text = re.sub(r"(?<=[A-Za-z])\s+(?=[A-Za-z])", "", text)
    text = re.sub(r"(?<=\d)\s+(?=\d)", "", text)
    text = re.sub(r"\s+([，。；：！？、）】》])", r"\1", text)
    text = re.sub(r"([（【《])\s+", r"\1", text)
    text = text.replace("［］", "［J］").replace("J .", "J].")
    return text.strip()


def split_three_columns(line: str) -> tuple[str, str, str]:
    # The source TXT was extracted from a three-column magazine layout.
    # Column gaps are long whitespace runs near fixed visual boundaries. Some
    # Chinese words inside a column also contain extraction spaces, so split
    # only on long gaps that appear around the expected column boundary zones.
    raw = line.rstrip()
    runs = list(re.finditer(r"[ \t]{5,}", raw))
    first = next((m for m in runs if 28 <= m.end() <= 38), None)
    if first:
        second = next((m for m in runs if m.start() > first.end() and 58 <= m.end() <= 68), None)
        if second:
            return (
                normalize_fragment(raw[: first.start()]),
                normalize_fragment(raw[first.end() : second.start()]),
                normalize_fragment(raw[second.end() :]),
            )
        rest = raw[first.end() :]
        soft_runs = [m for m in re.finditer(r"[ \t]{4,}", rest) if m.start() >= 18]
        if soft_runs:
            soft = soft_runs[-1]
            return (
                normalize_fragment(raw[: first.start()]),
                normalize_fragment(rest[: soft.start()]),
                normalize_fragment(rest[soft.end() :]),
            )
        return normalize_fragment(raw[: first.start()]), normalize_fragment(raw[first.end() :]), ""
    compact = normalize_fragment(raw)
    if compact:
        return compact, "", ""
    return "", "", ""


def is_noise_line(line: str) -> bool:
    raw = line.strip()
    compact = re.sub(r"\s+", "", raw)
    if not raw:
        return True
    if compact == "督查工作":
        return True
    if re.search(r"^\d+\s*秘书之友\s*2025·9$", raw):
        return True
    if re.search(r"^秘书之友\s*2025·9\s*\d+$", raw):
        return True
    return False


def reconstruct_article(raw: str) -> str:
    lines = raw.replace("\r", "").split("\n")
    title = "“点线面体”全链条提升督查督办效能"
    author = "李亚伟"

    page_columns: list[list[list[str]]] = []
    current = [[], [], []]
    ref_skip = [False, False, False]
    seen_body = False

    for line in lines:
        if is_noise_line(line):
            if re.search(r"秘书之友\s*2025·9|2025·9", line):
                if any(current):
                    page_columns.append(current)
                    current = [[], [], []]
                    ref_skip = [False, False, False]
            continue
        if "“点线面体”全链条提升" in line or "督查督办效能" in line or "□李亚伟" in line:
            continue
        if "一分部署" in line:
            seen_body = True
        if not seen_body:
            continue
        l, m, r = split_three_columns(line)
        for idx, frag in enumerate((l, m, r)):
            if frag:
                if ref_skip[idx]:
                    continue
                if "参考文献" in frag or "作者单位" in frag or re.match(r"^［\d+］", frag):
                    ref_skip[idx] = True
                    continue
                current[idx].append(frag)
    if any(current):
        page_columns.append(current)

    ordered_parts: list[str] = [title, f"作者：{author}"]
    for cols in page_columns:
        page_text = "".join("".join(col) for col in cols if col)
        if page_text:
            ordered_parts.append(page_text)

    text = "\n\n".join(ordered_parts)
    text = re.sub(r"参考文献：.*", "", text, flags=re.S)
    text = re.sub(r"（作者单位：.*?）", "", text, flags=re.S)
    text = re.sub(r"［\d+］", "", text)
    text = re.sub(r"\s+", " ", text)
    text = text.replace("作者：李亚伟 ", "作者：李亚伟\n\n")
    text = re.sub(r"([。！？])", r"\1\n", text)
    text = re.sub(r"\n{2,}", "\n\n", text)
    return text.strip() + "\n"


def tokenize(cleaned: str):
    for term in DOMAIN_TERMS:
        jieba.add_word(term, freq=200000, tag="n")
    body = re.sub(r"^.*?作者：李亚伟", "", cleaned, flags=re.S)
    tokens = []
    for word, flag in pseg.cut(body):
        word = word.strip()
        if not word or re.fullmatch(r"[\W_]+", word):
            continue
        if word in STOPWORDS:
            continue
        tokens.append((word, flag))
    return tokens


def main() -> None:
    raw = decode_text(SRC)
    cleaned = reconstruct_article(raw)
    cleaned_path = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_清洗正文.txt"
    cleaned_path.write_text(cleaned, encoding="utf-8-sig")

    tokens = tokenize(cleaned)
    token_df = pd.DataFrame(tokens, columns=["词语", "词性"])
    token_df.insert(0, "序号", range(1, len(token_df) + 1))
    token_csv = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_分词词性.csv"
    token_xlsx = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_分词词性.xlsx"
    token_df.to_csv(token_csv, index=False, encoding="utf-8-sig")
    token_df.to_excel(token_xlsx, index=False)

    freq = Counter(word for word, _ in tokens if len(word) >= 2)
    freq_rows = []
    first_pos = {}
    for word, flag in tokens:
        first_pos.setdefault(word, flag)
    for rank, (word, count) in enumerate(freq.most_common(), 1):
        freq_rows.append({"排名": rank, "词语": word, "词性": first_pos.get(word, ""), "词频": count})
    freq_df = pd.DataFrame(freq_rows)
    freq_csv = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_词频表.csv"
    freq_xlsx = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_词频表.xlsx"
    freq_df.to_csv(freq_csv, index=False, encoding="utf-8-sig")
    freq_df.to_excel(freq_xlsx, index=False)

    metadata = {
        "标题": "“点线面体”全链条提升督查督办效能",
        "作者": "李亚伟",
        "学科分支": "秘书学/办公事务/督查督办",
        "文献类型": "学术期刊/业务研究文章",
        "发表年份": "2025",
        "来源刊物": "秘书之友",
        "期号": "2025年第9期",
        "页码": "28-30",
        "原始文件": str(SRC),
        "处理说明": "按三栏版式重组正文；剔除页眉、页脚、页码、参考文献和作者单位；修复中文字符间异常空格；使用jieba进行分词和词性标注。",
    }
    metadata_json = OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_元数据.json"
    metadata_json.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8-sig")
    pd.DataFrame([metadata]).to_excel(OUT_DIR / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_元数据.xlsx", index=False)

    report = [
        "处理对象： “点线面体”全链条提升督查督办效能-李亚伟.txt",
        f"原文字符数：{len(raw)}",
        f"清洗后字符数：{len(cleaned)}",
        f"分词数量（去停用词后）：{len(tokens)}",
        f"词频条目数：{len(freq_df)}",
        "主要处理：三栏重组、页眉页脚清除、参考文献清除、异常空格修复、分词词性标注、词频统计、元数据标注。",
        "备注：本篇主题为秘书/督查督办领域，不属于农业词汇；词表按该文本实际领域生成。",
    ]
    (OUT_DIR / "处理说明.txt").write_text("\n".join(report) + "\n", encoding="utf-8-sig")

    zip_path = BASE / "成品" / "点线面体全链条提升督查督办效能-李亚伟_成品.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for item in sorted(OUT_DIR.iterdir()):
            zf.write(item, arcname=f"{OUT_DIR.name}/{item.name}")

    final_dir = BASE / "成品" / "点线面体全链条提升督查督办效能-李亚伟_最终提交包"
    txt_dir = final_dir / "转写的TXT材料包"
    pos_dir = final_dir / "词性标注表格"
    freq_dir = final_dir / "词频表"
    for folder in (txt_dir, pos_dir, freq_dir):
        folder.mkdir(parents=True, exist_ok=True)

    final_clean = txt_dir / "2025_秘书学_期刊_点线面体全链条提升督查督办效能.txt"
    final_pos = pos_dir / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_词性标注表.xlsx"
    final_freq = freq_dir / "2025_秘书学_期刊_点线面体全链条提升督查督办效能_词频表.xlsx"
    final_clean.write_bytes(cleaned_path.read_bytes())
    final_pos.write_bytes(token_xlsx.read_bytes())
    final_freq.write_bytes(freq_xlsx.read_bytes())

    final_zip = BASE / "成品" / "点线面体全链条提升督查督办效能-李亚伟_最终提交包.zip"
    if final_zip.exists():
        final_zip.unlink()
    with zipfile.ZipFile(final_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for item in sorted(final_dir.rglob("*")):
            if item.is_file():
                zf.write(item, arcname=item.relative_to(final_dir.parent))
    print(cleaned_path)
    print(freq_xlsx)
    print(token_xlsx)
    print(zip_path)
    print(final_zip)


if __name__ == "__main__":
    main()
