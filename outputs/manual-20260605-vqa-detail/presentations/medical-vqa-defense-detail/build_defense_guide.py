from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT = r"C:\Users\28026\Desktop\毕业设计\outputs\manual-20260605-vqa-detail\presentations\medical-vqa-defense-detail\output\周健_答辩解析与老师提问应答.docx"


slides = [
    ("1", "封面", "交代题目、姓名和系统定位，不展开技术细节。",
     "各位老师好，我的题目是《基于 PathVQA 数据集的轻量级医疗视觉问答模型设计与实现》。本课题围绕医学图像和自然语言问题，设计一个轻量级问答模型，并实现网页端演示系统。"),
    ("2", "答辩路线", "告诉老师你会按背景、数据模型、训练评估、系统演示、总结展望来讲。",
     "我会先说明为什么做医疗视觉问答，再介绍数据处理和模型结构，然后给出训练评估结果，最后展示网页端系统和本文的不足与展望。"),
    ("3", "研究背景", "强调医疗 VQA 是图像理解与自然语言理解的结合。",
     "医疗视觉问答不同于单纯图像分类，它需要根据用户提出的问题，从医学图像中提取相关信息并给出答案，因此更接近交互式辅助分析。"),
    ("4", "研究现状与定位", "承认大模型效果强，但本文目标是轻量化、可复现、可演示。",
     "现有方法中 Transformer 和预训练视觉语言模型效果较好，但训练和部署成本较高。本文更关注普通设备上的轻量化实现，以及从数据到系统展示的完整闭环。"),
    ("5", "数据集与预处理", "讲固定划分、路径规范化、词表和答案映射。",
     "我将数据固定划分为训练集、验证集和测试集，训练集 12523 条，验证集 2438 条，测试集 2342 条。词表和答案类别只由训练集构建，验证集和测试集复用映射，避免信息泄露。"),
    ("6", "数据特点", "解释为什么要看 Top-5，不要只看 Top-1。",
     "因为答案类别达到 2079 类，并且高频和长尾答案同时存在，所以 Top-1 准确率不能完全反映模型能力。Top-5 可以体现模型把正确答案放入候选范围的能力，更符合候选答案推荐系统的定位。"),
    ("7", "总体模型结构", "按输入、编码、融合、分类四步讲。",
     "模型有两个输入：医学图像和问题文本。图像经过 ResNet18 得到 512 维视觉特征；文本经过 Embedding 和 LSTM 得到 256 维语义特征；两者拼接成 768 维联合特征，再通过全连接分类器输出答案类别。"),
    ("8", "关键模块", "讲为什么轻量：ResNet18、单层 LSTM、简单拼接。",
     "本文选择 ResNet18 是因为参数量较小、推理快，并且可以使用预训练权重。问题文本较短，因此用 Embedding 加 LSTM 进行语义编码。融合方式采用拼接，优点是简单稳定，缺点是细粒度对齐能力有限。"),
    ("9", "训练策略", "讲两阶段训练的动机和做法。",
     "第一阶段冻结 ResNet18 的卷积层，让文本编码器和分类器先学习图文映射。第二阶段在第一阶段模型基础上，只解冻 ResNet18 的 layer4，用较小学习率微调高层视觉特征，以适配医学图像。"),
    ("10", "实验设置", "讲损失函数、评价指标、设备环境。",
     "模型使用交叉熵损失函数，评价指标包括 Top-1、Top-5、Test Loss 和平均推理时间。实验环境为 Windows、PyTorch、CUDA 11.8 和 RTX 3060。"),
    ("11", "验证集结果", "讲验证准确率从 0.4171 提升到 0.4987。",
     "从验证集结果看，二阶段微调后 Val Loss 从 2.1022 下降到 1.9472，Val Acc 从 0.4171 提升到 0.4987，说明高层视觉特征微调对医学图像适配有帮助。"),
    ("12", "测试集结果", "讲最终测试指标和提升幅度。",
     "在测试集上，第一阶段 Top-1 为 44.15%，Top-5 为 81.38%；第二阶段 Top-1 提升到 49.87%，Top-5 提升到 85.65%，Loss 下降到 1.6937。"),
    ("13", "网页端系统", "讲系统功能闭环。",
     "网页端使用 Gradio 实现，可以上传医学图像、输入问题，并展示 Top-1 推荐答案、Top-5 候选结果和 Top1-Top2 差值解释。"),
    ("14", "演示策略", "讲为什么用固定示例和高频问题。",
     "为了保证现场演示稳定，我会使用系统内置示例和训练集高频问题。这样输入更接近训练分布，能更稳定展示模型的候选排序能力。"),
    ("15", "局限性", "主动说明不是诊断工具。",
     "当前模型仍有局限：融合方式较简单，不能主动识别分布外输入，答案类别也存在长尾和同义表达问题。因此系统定位为候选答案推荐原型，不能直接用于临床诊断。"),
    ("16", "总结与展望", "收束到闭环和后续改进。",
     "本文完成了数据处理、轻量模型设计、两阶段训练、测试评估和网页演示系统。后续可以从答案归一化、轻量注意力机制、拒答机制和部署优化等方面改进。"),
    ("17", "附录 A 代码结构", "老师问代码时翻到这一页。",
     "如果老师问代码实现，我会按 data_preprocess、model、train、train_finetune、evaluate、app 这几条线说明。"),
    ("18", "附录 B 常见追问", "用于支撑问答，不一定主动讲。",
     "这一页是常见问题速答，核心思路是把回答落到设计取舍、工程闭环和系统边界上。"),
]

qa = [
    ("为什么选择 PathVQA 数据集？", "PathVQA 是公开的医学视觉问答数据集，包含医学图像、问题和答案，适合验证医学图像问答模型。公开数据集也便于实验复现。"),
    ("为什么把任务建模为分类，而不是生成文本？", "本科设计更强调稳定训练和工程实现。分类式答案预测更容易训练、评价和部署，适合轻量级原型。生成式方法表达能力更强，但需要更大数据和模型。"),
    ("为什么使用 ResNet18？", "ResNet18 参数量相对小，推理速度快，预训练权重容易获得，适合普通设备和网页演示。本文目标是轻量化原型，不是追求最大模型。"),
    ("为什么不用 ResNet50、ViT 或 CLIP？", "这些模型通常表达能力更强，但训练与部署成本更高。本文选择 ResNet18 是为了在性能、速度、实现难度之间取得平衡。"),
    ("为什么使用 LSTM？", "问题文本较短，LSTM 能够建模词序和上下文关系，实现简单、计算成本较低，适合轻量级文本编码。"),
    ("Embedding 128 维、LSTM 256 维是怎么考虑的？", "这是轻量化和表达能力之间的折中。维度过低可能表达不足，过高会增加参数和过拟合风险。"),
    ("为什么采用特征拼接？", "特征拼接实现简单、训练稳定，适合验证轻量级模型可行性。缺点是细粒度跨模态对齐能力弱，后续可以加入注意力机制改进。"),
    ("为什么两阶段训练？", "第一阶段冻结图像骨干，先让文本分支和分类器学习基本映射；第二阶段只微调 layer4，让高层视觉特征更适应医学图像，成本比全量微调低。"),
    ("为什么只解冻 layer4？", "ResNet 的底层特征多是边缘、纹理等通用特征，高层特征与任务语义更相关。只微调 layer4 可以提高医学图像适配能力，同时避免训练成本过高。"),
    ("Top-1 和 Top-5 分别代表什么？", "Top-1 表示首位答案是否正确，Top-5 表示正确答案是否进入前五个候选。答案类别多时，Top-5 更能体现候选排序能力。"),
    ("为什么 Top-5 明显高于 Top-1？", "因为医学 VQA 答案类别多且相近答案较多，模型可能首位不完全准确，但能把正确答案排在前五，说明有候选推荐能力。"),
    ("准确率 49.87% 是否偏低？", "需要结合任务难度看。本文答案类别有 2079 类，且医学图像和文本都较复杂。Top-5 达到 85.65%，说明候选排序能力较好。"),
    ("Softmax 概率能不能当作临床置信度？", "不能。Softmax 概率受训练分布和答案空间影响，在本文中只作为候选排序参考，不能解释为临床诊断置信度。"),
    ("平均推理时间 0.007s 说明什么？", "说明模型推理本身较快，网页端交互瓶颈更多来自图像上传、界面刷新和展示过程，轻量模型适合实时演示。"),
    ("系统为什么设计高频问题按钮？", "模型的问题词表来自训练集，高频问题更接近训练分布。按钮可以提高演示稳定性，也减少现场自由输入造成的不可控情况。"),
    ("如果现场演示结果不理想怎么办？", "先说明模型定位是候选推荐原型，再结合 Top-5 候选解释；必要时换固定示例，不要临时输入偏离训练集太远的问题。"),
    ("本文的主要创新点是什么？", "不是提出全新的大模型，而是在轻量化模型下完成数据处理、两阶段训练、测试评估和网页演示的完整工程闭环，并用 Top-5 策略进行候选解释。"),
    ("本文最大不足是什么？", "跨模态融合方式较简单，缺少注意力机制；不能主动识别分布外输入；答案类别存在同义表达和长尾问题。"),
    ("下一步怎么改进？", "数据上做答案归一化和清洗；模型上加入轻量注意力或轻量 Transformer；系统上增加拒答机制、结果解释和日志记录；部署上尝试 ONNX 或 TorchScript。"),
    ("系统能否用于临床？", "目前不能。它只能作为教学演示和候选答案推荐原型，不能替代医生诊断，也不能直接用于临床决策。"),
    ("为什么说是轻量级？", "图像编码器选 ResNet18，文本编码器是 Embedding + 单层 LSTM，融合方式简单，推理时间短，整体训练和部署成本较低。"),
    ("数据划分为什么固定？", "固定划分可以保证实验可复现，也能避免因为每次随机划分不同导致指标不可比较。"),
    ("验证集和测试集有什么区别？", "验证集用于训练过程中的模型选择和调参，测试集只用于最后评估泛化能力，不能参与训练。"),
    ("为什么不用中文问答？", "公开可用的中文医学视觉问答数据较少，本文基于 PathVQA 英文数据集完成原型验证。后续可扩展中文数据或做中英文映射。"),
    ("答辩时最该强调的一句话是什么？", "本文的重点是用轻量级多模态模型完成医疗视觉问答从数据处理、模型训练、测试评估到网页演示的完整闭环。"),
]


def shade_cell(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_cell_text(cell, text, bold=False, color="000000"):
    cell.text = ""
    p = cell.paragraphs[0]
    r = p.add_run(text)
    r.bold = bold
    r.font.name = "Microsoft YaHei"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    for r in p.runs:
        r.font.name = "Microsoft YaHei"
        r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(text)
    run.font.name = "Microsoft YaHei"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    run.font.size = Pt(10.5)


def add_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    for i, h in enumerate(headers):
        shade_cell(table.rows[0].cells[i], "D9EAF7")
        set_cell_text(table.rows[0].cells[i], h, True, "0B2545")
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            set_cell_text(cells[i], value)
    if widths:
        for row in table.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Inches(w)
    doc.add_paragraph()
    return table


doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.75)
section.bottom_margin = Inches(0.75)
section.left_margin = Inches(0.8)
section.right_margin = Inches(0.8)

styles = doc.styles
styles["Normal"].font.name = "Microsoft YaHei"
styles["Normal"]._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
styles["Normal"].font.size = Pt(10.5)

title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = title.add_run("周健毕业答辩解析与老师提问应答")
r.font.name = "Microsoft YaHei"
r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
r.font.size = Pt(22)
r.bold = True
r.font.color.rgb = RGBColor(11, 37, 69)

sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = sub.add_run("配套 PPT：周健_毕业答辩PPT_详细版_医疗视觉问答系统.pptx")
r.font.name = "Microsoft YaHei"
r._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
r.font.size = Pt(10.5)
r.font.color.rgb = RGBColor(85, 85, 85)

add_heading(doc, "一、7 分钟答辩节奏", 1)
pace_rows = [
    ["0:00-0:30", "封面 + 路线", "先让老师知道你讲什么，别急着进细节。"],
    ["0:30-1:30", "背景 + 研究定位", "强调轻量化、可复现、可演示。"],
    ["1:30-2:40", "数据处理", "固定划分、词表、答案类别、Top-5 的必要性。"],
    ["2:40-4:00", "模型结构", "输入、编码、融合、分类四步。"],
    ["4:00-5:10", "训练与评估", "两阶段训练和最终指标。"],
    ["5:10-6:10", "网页系统", "说明演示流程和展示策略。"],
    ["6:10-7:00", "局限 + 总结", "主动说明边界，收束到工程闭环。"],
]
add_table(doc, ["时间", "内容", "提醒"], pace_rows, [1.2, 1.8, 4.5])

add_heading(doc, "二、逐页讲稿", 1)
for no, name, point, speech in slides:
    add_heading(doc, f"第 {no} 页：{name}", 2)
    add_bullet(doc, f"本页目标：{point}")
    add_bullet(doc, f"推荐讲法：{speech}")

add_heading(doc, "三、老师常见追问与回答模板", 1)
qa_rows = [[q, a] for q, a in qa]
add_table(doc, ["老师可能会问", "建议回答"], qa_rows, [2.3, 5.2])

add_heading(doc, "四、现场演示防卡壳话术", 1)
for line in [
    "如果结果很好：可以说“这个样例 Top-1 排序优势比较明显，同时 Top-5 中也给出了相关候选答案。”",
    "如果结果一般：可以说“这个结果体现了候选推荐系统的特点，所以我不只看 Top-1，而是结合 Top-5 候选一起分析。”",
    "如果老师质疑概率低：可以说“这里的概率只用于答案排序，不解释为临床置信度。”",
    "如果老师让自由输入：优先选择和训练集中高频问题接近的英文问句，例如 What can be observed in this image?",
    "如果系统短暂卡顿：可以说“网页刷新和图像显示会有一点延迟，模型平均单样本推理约 0.007 秒。”",
]:
    add_bullet(doc, line)

add_heading(doc, "五、最后要背熟的三句话", 1)
for line in [
    "本文价值：完成了轻量级医疗视觉问答从数据处理、模型训练、测试评估到网页演示的完整闭环。",
    "模型取舍：选择 ResNet18 + LSTM + 简单融合，是为了在普通设备上实现可训练、可部署、可演示的原型。",
    "系统边界：本系统是候选答案推荐原型，不是临床诊断工具，Top-5 和概率只用于排序参考。",
]:
    add_bullet(doc, line)

doc.save(OUT)
print(OUT)
