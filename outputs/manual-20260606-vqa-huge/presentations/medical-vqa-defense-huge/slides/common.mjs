const ROOT = "C:/Users/28026/Desktop/毕业设计";
const WORK = `${ROOT}/outputs/manual-20260606-vqa-huge/presentations/medical-vqa-defense-huge`;
const PAPER = `${WORK}/assets/paper_media`;

const C = {
  bg: "#F7FAFC",
  white: "#FFFFFF",
  ink: "#102033",
  muted: "#455A70",
  quiet: "#6F8193",
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
  text(ctx, slide, headline, 58, 93, 1120, 70, 40, C.ink, true);
  if (sub) text(ctx, slide, sub, 60, 166, 1100, 34, 22, C.muted);
}

function pageno(ctx, slide, n) {
  text(ctx, slide, String(n).padStart(2, "0"), 1138, 662, 70, 30, 18, C.blue, true, "right");
}

function card(ctx, slide, h, b, x, y, w, he, accent = C.blue, fill = C.white, headSize = 28, bodySize = 22) {
  shape(ctx, slide, x, y, w, he, fill, true, C.line, 1);
  shape(ctx, slide, x, y, 8, he, accent, true, accent, 0);
  text(ctx, slide, h, x + 24, y + 24, w - 48, 40, headSize, C.ink, true);
  if (b) text(ctx, slide, b, x + 24, y + 82, w - 48, he - 100, bodySize, C.muted);
}

function metric(ctx, slide, value, label, x, y, w, color = C.blue, fill = C.white) {
  shape(ctx, slide, x, y, w, 138, fill, true, C.line, 1);
  text(ctx, slide, value, x + 20, y + 18, w - 40, 58, 48, color, true, "center");
  text(ctx, slide, label, x + 18, y + 86, w - 36, 34, 22, C.muted, true, "center");
}

function chip(ctx, slide, s, x, y, w, fill = C.blue2, color = C.blue) {
  shape(ctx, slide, x, y, w, 42, fill, true, fill, 0);
  text(ctx, slide, s, x + 12, y + 8, w - 24, 24, 20, color, true, "center", "middle");
}

function arrow(ctx, slide, x, y, w, color = C.blue) {
  return ctx.addShape(slide, {
    geometry: "rightArrow",
    x, y, w, h: 34,
    fill: color,
    line: ctx.line(color, 0),
  });
}

function flowBox(ctx, slide, h, b, x, y, w, he, fill, color) {
  shape(ctx, slide, x, y, w, he, fill, true, color, 2);
  const multi = String(h).includes("\n");
  const headH = multi ? 62 : 34;
  const bodyY = multi ? 88 : 62;
  text(ctx, slide, h, x + 18, y + 18, w - 36, headH, multi ? 24 : 26, color, true, "center");
  if (b) text(ctx, slide, b, x + 18, y + bodyY, w - 36, he - bodyY - 12, 21, C.muted, false, "center");
}

function bar(ctx, slide, label, before, after, x, y, w, color) {
  text(ctx, slide, label, x, y - 2, 190, 30, 22, C.ink, true);
  shape(ctx, slide, x + 205, y + 6, w, 20, "#DFE9F2", true, "#DFE9F2", 0);
  shape(ctx, slide, x + 205, y + 6, w * before / 100, 20, C.blue, true, C.blue, 0);
  shape(ctx, slide, x + 205, y + 42, w, 20, "#DFE9F2", true, "#DFE9F2", 0);
  shape(ctx, slide, x + 205, y + 42, w * after / 100, 20, color, true, color, 0);
  text(ctx, slide, `${before.toFixed(2)}%`, x + 215 + w, y + 0, 100, 28, 20, C.blue, true);
  text(ctx, slide, `${after.toFixed(2)}%`, x + 215 + w, y + 36, 100, 28, 20, color, true);
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
    title(ctx, slide, "01 / 为什么做", "医疗视觉问答：让系统既能看图，也能回答问题", "它比单纯图像分类更接近真实交互场景。");
    card(ctx, slide, "看图", "输入医学图像，提取视觉特征。", 90, 250, 300, 190, C.blue, C.blue2, 32, 24);
    card(ctx, slide, "理解问题", "输入自然语言问题，理解用户想问什么。", 490, 250, 300, 190, C.cyan, C.cyan2, 32, 24);
    card(ctx, slide, "给出答案", "输出 Top-1 和 Top-5 候选答案。", 890, 250, 300, 190, C.green, C.green2, 32, 24);
    text(ctx, slide, "本文定位：轻量级原型系统，用于教学、演示和方法验证，不替代临床诊断。", 118, 520, 1040, 52, 30, C.red, true, "center");
    pageno(ctx, slide, n); return slide;
  }

  if (n === 3) {
    title(ctx, slide, "02 / 研究内容", "完成从数据到网页演示的完整闭环", "系统围绕数据、模型、训练和应用四个环节展开。");
    flowBox(ctx, slide, "数据处理", "PathVQA\n固定划分", 72, 252, 190, 176, C.blue2, C.blue);
    arrow(ctx, slide, 278, 323, 68, C.blue);
    flowBox(ctx, slide, "模型设计", "ResNet18\nLSTM\n特征融合", 360, 252, 190, 176, C.cyan2, C.cyan);
    arrow(ctx, slide, 566, 323, 68, C.cyan);
    flowBox(ctx, slide, "训练评估", "两阶段训练\nTop-1 / Top-5", 648, 252, 190, 176, C.amber2, C.amber);
    arrow(ctx, slide, 854, 323, 68, C.amber);
    flowBox(ctx, slide, "网页系统", "Gradio\n现场演示", 936, 252, 190, 176, C.green2, C.green);
    metric(ctx, slide, "闭环", "数据 → 模型 → 结果 → 系统", 370, 500, 540, C.blue, C.white);
    pageno(ctx, slide, n); return slide;
  }

  if (n === 4) {
    title(ctx, slide, "03 / 数据集", "PathVQA 数据固定划分，保证实验可复现", "词表和答案类别只从训练集构建。");
    metric(ctx, slide, "12,523", "训练样本", 90, 236, 300, C.blue, C.blue2);
    metric(ctx, slide, "2,438", "验证样本", 490, 236, 300, C.cyan, C.cyan2);
    metric(ctx, slide, "2,342", "测试样本", 890, 236, 300, C.green, C.green2);
    metric(ctx, slide, "4,331", "问题词表", 230, 470, 300, C.amber, C.amber2);
    metric(ctx, slide, "2,079", "答案类别", 750, 470, 300, C.red, C.red2);
    pageno(ctx, slide, n); return slide;
  }

  if (n === 5) {
    title(ctx, slide, "04 / 模型结构", "图像特征 + 文本特征 → 融合分类", "轻量级多模态模型由图像编码、文本编码、特征融合和答案分类组成。");
    flowBox(ctx, slide, "医学图像", "224×224", 70, 230, 180, 110, C.blue2, C.blue);
    arrow(ctx, slide, 270, 268, 58, C.blue);
    flowBox(ctx, slide, "ResNet18", "输出 512 维", 350, 230, 210, 110, C.blue2, C.blue);
    flowBox(ctx, slide, "问题文本", "最长 20 词", 70, 410, 180, 130, C.cyan2, C.cyan);
    arrow(ctx, slide, 270, 458, 58, C.cyan);
    flowBox(ctx, slide, "Embedding\n+ LSTM", "输出 256 维", 350, 410, 210, 130, C.cyan2, C.cyan);
    arrow(ctx, slide, 590, 278, 86, C.blue);
    arrow(ctx, slide, 590, 438, 86, C.cyan);
    flowBox(ctx, slide, "特征拼接", "512 + 256\n= 768 维", 705, 315, 210, 145, C.amber2, C.amber);
    arrow(ctx, slide, 940, 368, 62, C.amber);
    flowBox(ctx, slide, "答案分类器", "输出 2,079 类", 1020, 320, 200, 130, C.green2, C.green);
    pageno(ctx, slide, n); return slide;
  }

  if (n === 6) {
    title(ctx, slide, "05 / 关键设计", "选择轻量结构，保证能训练、能部署、能演示", "从模型复杂度、训练成本和系统部署三个方面进行取舍。");
    card(ctx, slide, "图像编码", "ResNet18 参数量较小，适合本地训练；保留预训练视觉特征。", 76, 238, 335, 250, C.blue, C.blue2, 30, 23);
    card(ctx, slide, "文本编码", "LSTM 结构简单，能把问题文本编码成语义向量。", 472, 238, 335, 250, C.cyan, C.cyan2, 30, 23);
    card(ctx, slide, "融合分类", "拼接图文特征，再从 2,079 个答案类别中选择候选答案。", 868, 238, 335, 250, C.green, C.green2, 30, 23);
    text(ctx, slide, "优点：结构清晰、训练成本低、适合网页端原型系统。", 130, 555, 1020, 45, 30, C.ink, true, "center");
    pageno(ctx, slide, n); return slide;
  }

  if (n === 7) {
    title(ctx, slide, "06 / 训练策略", "两阶段训练：先稳定，再微调", "先学会图文映射，再让高层视觉特征适应医学图像。");
    card(ctx, slide, "第一阶段", "冻结 ResNet18\n训练文本编码器 + 分类器\n训练 5 个 epoch", 110, 245, 450, 260, C.blue, C.blue2, 34, 26);
    card(ctx, slide, "第二阶段", "解冻 ResNet18 layer4\n小学习率微调\n训练 3 个 epoch", 720, 245, 450, 260, C.amber, C.amber2, 34, 26);
    arrow(ctx, slide, 585, 352, 100, C.dark);
    chip(ctx, slide, "Stage 1：lr = 1e-3", 160, 550, 300, C.blue2, C.blue);
    chip(ctx, slide, "Layer4：lr = 1e-5", 820, 550, 300, C.amber2, C.amber);
    pageno(ctx, slide, n); return slide;
  }

  if (n === 8) {
    title(ctx, slide, "07 / 实验结果", "二阶段微调后，Top-1 和 Top-5 都提升", "Top-5 更能体现候选答案推荐能力。");
    metric(ctx, slide, "49.87%", "最终 Top-1", 80, 225, 245, C.blue, C.blue2);
    metric(ctx, slide, "85.65%", "最终 Top-5", 365, 225, 245, C.green, C.green2);
    metric(ctx, slide, "+5.72%", "Top-1 提升", 650, 225, 245, C.cyan, C.cyan2);
    metric(ctx, slide, "+4.27%", "Top-5 提升", 935, 225, 245, C.amber, C.amber2);
    bar(ctx, slide, "Top-1", 44.15, 49.87, 155, 465, 600, C.cyan);
    bar(ctx, slide, "Top-5", 81.38, 85.65, 155, 565, 600, C.green);
    pageno(ctx, slide, n); return slide;
  }

  if (n === 9) {
    title(ctx, slide, "08 / 系统演示", "网页端把模型结果变成可交互流程", "系统完成从图像输入、问题输入到答案展示的推理链路。");
    flowBox(ctx, slide, "1 上传图像", "选择医学图像", 58, 275, 220, 160, C.blue2, C.blue);
    arrow(ctx, slide, 296, 338, 58, C.blue);
    flowBox(ctx, slide, "2 输入问题", "或选高频问题", 372, 275, 220, 160, C.cyan2, C.cyan);
    arrow(ctx, slide, 610, 338, 58, C.cyan);
    flowBox(ctx, slide, "3 模型推理", "输出概率排序", 686, 275, 220, 160, C.amber2, C.amber);
    arrow(ctx, slide, 924, 338, 58, C.amber);
    flowBox(ctx, slide, "4 展示答案", "Top-1 + Top-5", 1000, 275, 220, 160, C.green2, C.green);
    text(ctx, slide, "概率用于排序参考，不等同于临床诊断置信度。", 125, 535, 1030, 46, 30, C.red, true, "center");
    pageno(ctx, slide, n); return slide;
  }

  if (n === 10) {
    title(ctx, slide, "09 / 总结", "本文完成轻量级医疗视觉问答模型与网页原型系统", "总结已完成工作、主要结果与后续改进方向。");
    card(ctx, slide, "完成工作", "数据处理、模型设计、训练评估、网页演示。", 88, 235, 330, 190, C.blue, C.blue2, 30, 24);
    card(ctx, slide, "主要结果", "Top-1：49.87%\nTop-5：85.65%", 475, 235, 330, 190, C.green, C.green2, 30, 26);
    card(ctx, slide, "后续改进", "引入注意力机制、医学预训练模型和更严格专家评测。", 862, 235, 330, 190, C.amber, C.amber2, 30, 24);
    text(ctx, slide, "谢谢各位老师，请批评指正", 0, 560, 1280, 58, 42, C.blue, true, "center");
    pageno(ctx, slide, n); return slide;
  }

  return slide;
}
