const ROOT = "C:/Users/28026/Desktop/毕业设计";
const WORK = `${ROOT}/outputs/manual-20260607-vqa-expanded/presentations/medical-vqa-defense-expanded`;
const PAPER = `${WORK}/assets/paper_media`;

const C = {
  bg: "#F7FAFC",
  white: "#FFFFFF",
  ink: "#102033",
  muted: "#455A70",
  line: "#D7E2EC",
  blue: "#1E5AA8",
  blue2: "#E6F0FA",
  cyan: "#0B9EA4",
  cyan2: "#E4F7F7",
  green: "#22845A",
  green2: "#E6F5EE",
  amber: "#C47A12",
  amber2: "#FFF1D8",
  red: "#B5121B",
  red2: "#FBE8EA",
  dark: "#0B1F33",
};

function shape(ctx, slide, x, y, w, h, fill = C.white, r = true, line = C.line, lw = 1) {
  return ctx.addShape(slide, { geometry: r ? "roundRect" : "rect", x, y, w, h, fill, line: ctx.line(line, lw) });
}

function text(ctx, slide, s, x, y, w, h, size = 24, color = C.ink, bold = false, align = "left", valign = "top") {
  return ctx.addText(slide, {
    text: s, x, y, w, h, size, color, bold, align, valign, face: "Microsoft YaHei",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function title(ctx, slide, section, headline, sub = "") {
  shape(ctx, slide, 0, 0, 1280, 720, C.bg, false, C.bg, 0);
  shape(ctx, slide, 0, 0, 1280, 16, C.blue, false, C.blue, 0);
  shape(ctx, slide, 58, 50, 8, 34, C.cyan, true, C.cyan, 0);
  text(ctx, slide, section, 82, 48, 420, 34, 20, C.cyan, true, "left", "middle");
  text(ctx, slide, headline, 58, 93, 1120, 70, 39, C.ink, true);
  if (sub) text(ctx, slide, sub, 60, 166, 1100, 34, 22, C.muted);
}

function page(ctx, slide, n) {
  text(ctx, slide, String(n).padStart(2, "0"), 1138, 662, 70, 30, 18, C.blue, true, "right");
}

function card(ctx, slide, h, b, x, y, w, he, accent = C.blue, fill = C.white, headSize = 28, bodySize = 22) {
  shape(ctx, slide, x, y, w, he, fill, true, C.line, 1);
  shape(ctx, slide, x, y, 8, he, accent, true, accent, 0);
  text(ctx, slide, h, x + 24, y + 22, w - 48, 42, headSize, C.ink, true);
  if (b) text(ctx, slide, b, x + 24, y + 78, w - 48, he - 92, bodySize, C.muted);
}

function metric(ctx, slide, value, label, x, y, w, color = C.blue, fill = C.white) {
  shape(ctx, slide, x, y, w, 138, fill, true, C.line, 1);
  text(ctx, slide, value, x + 20, y + 17, w - 40, 58, 46, color, true, "center");
  text(ctx, slide, label, x + 18, y + 86, w - 36, 34, 22, C.muted, true, "center");
}

function chip(ctx, slide, s, x, y, w, fill = C.blue2, color = C.blue) {
  shape(ctx, slide, x, y, w, 42, fill, true, fill, 0);
  text(ctx, slide, s, x + 12, y + 8, w - 24, 24, 20, color, true, "center", "middle");
}

function arrow(ctx, slide, x, y, w, color = C.blue) {
  return ctx.addShape(slide, { geometry: "rightArrow", x, y, w, h: 34, fill: color, line: ctx.line(color, 0) });
}

function flowBox(ctx, slide, h, b, x, y, w, he, fill, color, headSize = 25, bodySize = 20) {
  shape(ctx, slide, x, y, w, he, fill, true, color, 2);
  text(ctx, slide, h, x + 16, y + 18, w - 32, 34, headSize, color, true, "center");
  if (b) text(ctx, slide, b, x + 16, y + 62, w - 32, he - 76, bodySize, C.muted, false, "center");
}

function barPair(ctx, slide, label, before, after, x, y, w, color) {
  text(ctx, slide, label, x, y + 14, 150, 30, 22, C.ink, true);
  shape(ctx, slide, x + 170, y + 6, w, 20, "#DFE9F2", true, "#DFE9F2", 0);
  shape(ctx, slide, x + 170, y + 6, w * before / 100, 20, C.blue, true, C.blue, 0);
  shape(ctx, slide, x + 170, y + 48, w, 20, "#DFE9F2", true, "#DFE9F2", 0);
  shape(ctx, slide, x + 170, y + 48, w * after / 100, 20, color, true, color, 0);
  text(ctx, slide, `${before.toFixed(2)}%`, x + 180 + w, y + 0, 100, 28, 19, C.blue, true);
  text(ctx, slide, `${after.toFixed(2)}%`, x + 180 + w, y + 42, 100, 28, 19, color, true);
}

async function image(ctx, slide, path, x, y, w, h) {
  await ctx.addImage(slide, { path, x, y, w, h, fit: "contain" });
}

export async function buildSlide(presentation, ctx, n) {
  const slide = presentation.slides.add();

  if (n === 1) {
    shape(ctx, slide, 0, 0, 1280, 720, C.bg, false, C.bg, 0);
    shape(ctx, slide, 0, 0, 1280, 18, C.blue, false, C.blue, 0);
    shape(ctx, slide, 0, 606, 1280, 114, C.blue2, false, C.blue2, 0);
    await image(ctx, slide, `${PAPER}/image1.png`, 76, 56, 96, 96);
    await image(ctx, slide, `${PAPER}/image2.png`, 190, 72, 270, 66);
    chip(ctx, slide, "毕业设计答辩", 76, 190, 180, C.red2, C.red);
    text(ctx, slide, "基于 PathVQA 数据集的", 76, 258, 1050, 58, 44, C.ink, true);
    text(ctx, slide, "轻量级医疗视觉问答模型", 76, 328, 1080, 70, 52, C.blue, true);
    text(ctx, slide, "设计与实现", 76, 408, 720, 66, 50, C.blue, true);
    text(ctx, slide, "答辩人：周健    学号：208221335    专业：人工智能", 76, 634, 820, 30, 21, C.ink, true);
    text(ctx, slide, "指导教师：王青云 / 蔡亮亮", 76, 670, 520, 26, 19, C.muted);
    text(ctx, slide, "医疗视觉问答系统", 960, 652, 220, 28, 20, C.blue, true, "right");
    return slide;
  }

  if (n === 2) {
    title(ctx, slide, "01 / 研究背景", "医疗视觉问答让系统同时理解图像和问题", "任务目标是根据医学图像与自然语言问题，输出有针对性的候选答案。");
    card(ctx, slide, "医学图像数量增长", "病理、影像等医学视觉数据不断积累，人工逐一分析成本较高。", 80, 250, 330, 210, C.blue, C.blue2, 30, 23);
    card(ctx, slide, "问答交互更直观", "用户可以围绕图像提出具体问题，系统返回与问题相关的答案。", 475, 250, 330, 210, C.cyan, C.cyan2, 30, 23);
    card(ctx, slide, "轻量模型更易落地", "在普通本地环境中完成训练、评估和网页端演示，具有工程可行性。", 870, 250, 330, 210, C.green, C.green2, 30, 23);
    text(ctx, slide, "系统定位：教学辅助、原型验证和候选答案推荐。", 0, 540, 1280, 42, 30, C.red, true, "center");
    page(ctx, slide, n); return slide;
  }

  if (n === 3) {
    title(ctx, slide, "02 / 研究目标", "构建轻量级医疗视觉问答模型与网页原型系统", "本文关注模型可训练、结果可评估、系统可演示。");
    card(ctx, slide, "目标一", "完成 PathVQA 数据解析、清洗、词表构建和答案类别映射。", 80, 245, 330, 210, C.blue, C.blue2, 32, 24);
    card(ctx, slide, "目标二", "设计图像分支、文本分支和融合分类器，完成多模态建模。", 475, 245, 330, 210, C.cyan, C.cyan2, 32, 24);
    card(ctx, slide, "目标三", "通过两阶段训练提升效果，并用 Top-1、Top-5 等指标进行评估。", 870, 245, 330, 210, C.amber, C.amber2, 32, 24);
    card(ctx, slide, "目标四", "搭建网页端问答系统，实现图像上传、问题输入和候选答案展示。", 260, 492, 760, 120, C.green, C.green2, 28, 22);
    page(ctx, slide, n); return slide;
  }

  if (n === 4) {
    title(ctx, slide, "03 / 技术路线", "形成从数据到网页演示的完整闭环", "系统围绕数据、模型、训练、评估和应用五个环节展开。");
    flowBox(ctx, slide, "数据处理", "PathVQA\n固定划分", 50, 260, 180, 176, C.blue2, C.blue);
    arrow(ctx, slide, 245, 330, 55, C.blue);
    flowBox(ctx, slide, "模型设计", "ResNet18\nLSTM", 315, 260, 180, 176, C.cyan2, C.cyan);
    arrow(ctx, slide, 510, 330, 55, C.cyan);
    flowBox(ctx, slide, "训练优化", "两阶段\n微调", 580, 260, 180, 176, C.amber2, C.amber);
    arrow(ctx, slide, 775, 330, 55, C.amber);
    flowBox(ctx, slide, "结果评估", "准确率\n候选命中", 845, 260, 180, 176, C.green2, C.green);
    arrow(ctx, slide, 1040, 330, 55, C.green);
    flowBox(ctx, slide, "网页系统", "页面\n交互", 1110, 260, 140, 176, C.red2, C.red);
    metric(ctx, slide, "闭环实现", "数据 → 模型 → 结果 → 系统", 370, 505, 540, C.blue, C.white);
    page(ctx, slide, n); return slide;
  }

  if (n === 5) {
    title(ctx, slide, "04 / 数据集与预处理", "PathVQA 数据固定划分，保证实验可复现", "训练集构建词表与答案类别，验证集和测试集复用同一映射。");
    metric(ctx, slide, "12,523", "训练样本", 80, 230, 300, C.blue, C.blue2);
    metric(ctx, slide, "2,438", "验证样本", 490, 230, 300, C.cyan, C.cyan2);
    metric(ctx, slide, "2,342", "测试样本", 900, 230, 300, C.green, C.green2);
    card(ctx, slide, "预处理流程", "读取问答数据 → 文本分词 → 建立词表 → 答案映射 → 张量输入", 125, 445, 1030, 135, C.amber, C.amber2, 30, 24);
    page(ctx, slide, n); return slide;
  }

  if (n === 6) {
    title(ctx, slide, "05 / 数据表示", "问题文本和答案空间被转换为模型可学习的形式", "模型输入不仅包括图像，还包括经过编码的问题序列。");
    metric(ctx, slide, "224×224", "图像输入尺寸", 85, 245, 260, C.blue, C.blue2);
    metric(ctx, slide, "20", "最大问题长度", 385, 245, 260, C.cyan, C.cyan2);
    metric(ctx, slide, "4,331", "问题词表规模", 685, 245, 260, C.amber, C.amber2);
    metric(ctx, slide, "2,079", "答案类别数量", 985, 245, 220, C.red, C.red2);
    card(ctx, slide, "建模方式", "医疗视觉问答被建模为多类别分类任务，模型从 2,079 个候选答案中选择最可能答案。", 150, 485, 980, 125, C.green, C.green2, 30, 24);
    page(ctx, slide, n); return slide;
  }

  if (n === 7) {
    title(ctx, slide, "06 / 模型总体结构", "图像特征 + 文本特征 → 融合分类", "轻量级多模态模型由图像编码、文本编码、特征融合和答案分类组成。");
    flowBox(ctx, slide, "医学图像", "224×224", 70, 230, 180, 120, C.blue2, C.blue);
    arrow(ctx, slide, 270, 273, 58, C.blue);
    flowBox(ctx, slide, "ResNet18", "输出 512 维", 350, 230, 210, 120, C.blue2, C.blue);
    arrow(ctx, slide, 590, 278, 86, C.blue);
    flowBox(ctx, slide, "问题文本", "最长 20 词", 70, 410, 180, 130, C.cyan2, C.cyan);
    arrow(ctx, slide, 270, 458, 58, C.cyan);
    flowBox(ctx, slide, "Embedding\n+ LSTM", "输出 256 维", 350, 410, 210, 130, C.cyan2, C.cyan, 24, 20);
    arrow(ctx, slide, 590, 438, 86, C.cyan);
    flowBox(ctx, slide, "特征拼接", "512 + 256\n= 768 维", 705, 315, 210, 145, C.amber2, C.amber, 25, 20);
    arrow(ctx, slide, 940, 368, 62, C.amber);
    flowBox(ctx, slide, "答案分类器", "输出 2,079 类", 1020, 320, 200, 130, C.green2, C.green);
    page(ctx, slide, n); return slide;
  }

  if (n === 8) {
    title(ctx, slide, "07 / 图像编码模块", "ResNet18 提取医学图像的高层视觉特征", "图像分支负责把医学图像压缩成固定维度的视觉表示。");
    card(ctx, slide, "输入处理", "图像统一调整为 224×224，并转换为模型可接收的张量。", 85, 245, 330, 225, C.blue, C.blue2, 31, 24);
    card(ctx, slide, "骨干网络", "采用 ResNet18 作为视觉编码器，兼顾表达能力与训练成本。", 475, 245, 330, 225, C.cyan, C.cyan2, 31, 24);
    card(ctx, slide, "特征输出", "去除原分类层后，输出 512 维图像特征，用于后续图文融合。", 865, 245, 330, 225, C.green, C.green2, 31, 24);
    chip(ctx, slide, "第一阶段冻结骨干", 205, 535, 250, C.blue2, C.blue);
    chip(ctx, slide, "第二阶段微调高层特征", 500, 535, 310, C.amber2, C.amber);
    chip(ctx, slide, "减少过拟合风险", 855, 535, 250, C.green2, C.green);
    page(ctx, slide, n); return slide;
  }

  if (n === 9) {
    title(ctx, slide, "08 / 文本编码与融合分类", "LSTM 编码问题语义，拼接后完成答案预测", "文本分支和图像分支共同决定最终候选答案。");
    card(ctx, slide, "文本编码", "问题先映射为词索引，再经过 Embedding 与 LSTM，得到 256 维语义特征。", 76, 238, 335, 250, C.cyan, C.cyan2, 30, 23);
    card(ctx, slide, "特征融合", "将 512 维图像特征与 256 维文本特征拼接，形成 768 维联合特征。", 472, 238, 335, 250, C.amber, C.amber2, 30, 23);
    card(ctx, slide, "答案分类", "联合特征进入全连接分类器，输出 2,079 个答案类别的预测得分。", 868, 238, 335, 250, C.green, C.green2, 30, 23);
    text(ctx, slide, "模型输出 Top-1 首选答案，同时保留 Top-5 候选答案用于系统展示。", 115, 555, 1050, 44, 30, C.ink, true, "center");
    page(ctx, slide, n); return slide;
  }

  if (n === 10) {
    title(ctx, slide, "09 / 训练策略", "两阶段训练兼顾稳定性与特征适配", "先学习图文到答案的基础映射，再微调高层视觉特征。");
    card(ctx, slide, "第一阶段", "冻结图像骨干网络\n训练文本编码器 + 分类器\n训练 5 轮", 110, 245, 450, 260, C.blue, C.blue2, 34, 26);
    arrow(ctx, slide, 585, 352, 100, C.dark);
    card(ctx, slide, "第二阶段", "解冻高层视觉特征\n使用小学习率微调\n训练 3 轮", 720, 245, 450, 260, C.amber, C.amber2, 34, 26);
    chip(ctx, slide, "基础训练：学习率 0.001", 145, 550, 330, C.blue2, C.blue);
    chip(ctx, slide, "高层微调：学习率 0.00001", 795, 550, 360, C.amber2, C.amber);
    page(ctx, slide, n); return slide;
  }

  if (n === 11) {
    title(ctx, slide, "10 / 评价指标", "从首选答案和候选答案两个角度评价模型", "既评价模型第一答案是否正确，也评价正确答案是否进入候选列表。");
    card(ctx, slide, "损失值", "衡量预测结果与真实答案之间的差距，数值越低说明分类误差越小。", 80, 250, 330, 220, C.blue, C.blue2, 32, 24);
    card(ctx, slide, "首选答案准确率", "模型排名第一的答案与标准答案一致时，记为预测正确。", 475, 250, 330, 220, C.cyan, C.cyan2, 32, 24);
    card(ctx, slide, "前五候选命中率", "标准答案出现在前五个候选答案中时，记为候选命中。", 870, 250, 330, 220, C.green, C.green2, 32, 24);
    text(ctx, slide, "网页端展示前五个候选答案，更符合辅助参考场景。", 0, 545, 1280, 42, 30, C.red, true, "center");
    page(ctx, slide, n); return slide;
  }

  if (n === 12) {
    title(ctx, slide, "11 / 实验结果", "二阶段微调后，Top-1 和 Top-5 均有提升", "最终测试集 Top-1 为 49.87%，Top-5 为 85.65%。");
    metric(ctx, slide, "49.87%", "最终 Top-1", 80, 225, 245, C.blue, C.blue2);
    metric(ctx, slide, "85.65%", "最终 Top-5", 365, 225, 245, C.green, C.green2);
    metric(ctx, slide, "+5.72%", "Top-1 提升", 650, 225, 245, C.cyan, C.cyan2);
    metric(ctx, slide, "+4.27%", "Top-5 提升", 935, 225, 245, C.amber, C.amber2);
    barPair(ctx, slide, "Top-1", 44.15, 49.87, 155, 455, 600, C.cyan);
    barPair(ctx, slide, "Top-5", 81.38, 85.65, 155, 560, 600, C.green);
    page(ctx, slide, n); return slide;
  }

  if (n === 13) {
    title(ctx, slide, "12 / 系统实现", "网页端将模型预测结果转化为可交互问答流程", "系统围绕图像输入、问题输入、模型推理和结果展示进行设计。");
    flowBox(ctx, slide, "图像上传", "输入医学图像", 65, 275, 230, 160, C.blue2, C.blue, 27, 22);
    arrow(ctx, slide, 315, 338, 62, C.blue);
    flowBox(ctx, slide, "问题输入", "文本问题\n高频问题", 397, 275, 230, 160, C.cyan2, C.cyan, 27, 22);
    arrow(ctx, slide, 647, 338, 62, C.cyan);
    flowBox(ctx, slide, "模型推理", "加载最优模型\n输出排序", 729, 275, 230, 160, C.amber2, C.amber, 27, 22);
    arrow(ctx, slide, 979, 338, 62, C.amber);
    flowBox(ctx, slide, "答案展示", "Top-1\nTop-5", 1061, 275, 160, 160, C.green2, C.green, 27, 22);
    text(ctx, slide, "概率用于排序参考，不等同于临床诊断置信度。", 125, 535, 1030, 46, 30, C.red, true, "center");
    page(ctx, slide, n); return slide;
  }

  if (n === 14) {
    title(ctx, slide, "13 / 总结与展望", "本文完成轻量级医疗视觉问答模型与网页原型系统", "工作覆盖数据处理、模型训练、实验评估与系统实现。");
    card(ctx, slide, "完成工作", "构建 PathVQA 数据处理流程，完成轻量级多模态模型训练与评估。", 80, 230, 330, 190, C.blue, C.blue2, 30, 23);
    card(ctx, slide, "主要结果", "测试集 Top-1 为 49.87%，Top-5 为 85.65%，候选排序能力较好。", 475, 230, 330, 190, C.green, C.green2, 30, 23);
    card(ctx, slide, "系统价值", "网页端实现完整问答交互，可用于原型验证和教学展示。", 870, 230, 330, 190, C.cyan, C.cyan2, 30, 23);
    card(ctx, slide, "后续方向", "引入注意力机制、医学视觉语言预训练模型，并开展更严格的专家评测。", 210, 455, 860, 125, C.amber, C.amber2, 30, 24);
    text(ctx, slide, "谢谢各位老师，请批评指正", 0, 602, 1280, 48, 38, C.blue, true, "center");
    page(ctx, slide, n); return slide;
  }

  return slide;
}
