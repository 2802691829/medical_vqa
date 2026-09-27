const ROOT = "C:/Users/28026/Desktop/毕业设计";
const WORK = `${ROOT}/outputs/manual-20260605-vqa-show/presentations/medical-vqa-defense-show`;
const PAPER = `${WORK}/assets/paper_media`;
const FIG = `${ROOT}/round10_figures`;

const C = {
  bg: "#F7FAFC",
  white: "#FFFFFF",
  ink: "#102033",
  muted: "#516579",
  quiet: "#7A8B9A",
  line: "#D8E3EC",
  blue: "#1E5AA8",
  blue2: "#E8F1FB",
  cyan: "#0EA5A8",
  cyan2: "#E6F7F7",
  amber: "#C98017",
  amber2: "#FFF4DF",
  green: "#27845C",
  green2: "#E7F5EE",
  red: "#B5121B",
  red2: "#FBE9EB",
};

function shape(ctx, slide, x, y, w, h, fill = C.white, r = true, line = C.line, lw = 1) {
  return ctx.addShape(slide, { geometry: r ? "roundRect" : "rect", x, y, w, h, fill, line: ctx.line(line, lw) });
}

function text(ctx, slide, s, x, y, w, h, size = 20, color = C.ink, bold = false, align = "left", valign = "top") {
  return ctx.addText(slide, {
    text: s, x, y, w, h, size, color, bold, align, valign, face: "Microsoft YaHei",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function title(ctx, slide, section, headline, sub = "") {
  shape(ctx, slide, 0, 0, 1280, 720, C.bg, false, C.bg, 0);
  shape(ctx, slide, 0, 0, 1280, 12, C.blue, false, C.blue, 0);
  shape(ctx, slide, 62, 50, 7, 28, C.cyan, true, C.cyan, 0);
  text(ctx, slide, section, 82, 48, 420, 30, 18, C.cyan, true, "left", "middle");
  text(ctx, slide, headline, 62, 88, 1110, 62, 36, C.ink, true);
  if (sub) text(ctx, slide, sub, 64, 156, 1080, 34, 18, C.muted);
}

function footer(ctx, slide, n) {
  shape(ctx, slide, 64, 674, 1110, 1, C.line, false, C.line, 0);
  text(ctx, slide, "基于 PathVQA 数据集的轻量级医疗视觉问答模型设计与实现", 64, 688, 760, 18, 11, C.quiet);
  text(ctx, slide, String(n).padStart(2, "0"), 1138, 686, 40, 18, 12, C.blue, true, "right");
}

function card(ctx, slide, h, b, x, y, w, he, accent = C.blue, fill = C.white) {
  shape(ctx, slide, x, y, w, he, fill, true, C.line, 1);
  shape(ctx, slide, x, y, 6, he, accent, true, accent, 0);
  text(ctx, slide, h, x + 20, y + 18, w - 38, 30, 22, C.ink, true);
  text(ctx, slide, b, x + 20, y + 58, w - 40, Math.max(26, he - 68), 15, C.muted);
}

function metric(ctx, slide, value, label, x, y, w, color = C.blue, fill = C.white) {
  shape(ctx, slide, x, y, w, 108, fill, true, C.line, 1);
  text(ctx, slide, value, x + 16, y + 12, w - 32, 44, 36, color, true);
  text(ctx, slide, label, x + 18, y + 70, w - 36, 26, 16, C.muted);
}

function chip(ctx, slide, s, x, y, w, fill = C.blue2, color = C.blue) {
  shape(ctx, slide, x, y, w, 30, fill, true, fill, 0);
  text(ctx, slide, s, x + 8, y + 4, w - 16, 20, 15, color, true, "center", "middle");
}

function table(ctx, slide, rows, x, y, widths, rowH) {
  rows.forEach((row, r) => {
    let cx = x;
    row.forEach((cell, c) => {
      const fill = r === 0 ? C.blue : (r % 2 ? C.white : "#F0F5FA");
      const color = r === 0 ? C.white : (c === 1 ? C.blue : C.ink);
      shape(ctx, slide, cx, y + r * rowH, widths[c], rowH, fill, false, C.line, 1);
      text(ctx, slide, cell, cx + 12, y + r * rowH + 8, widths[c] - 24, rowH - 12, 16, color, r === 0 || c === 1, c === 1 ? "center" : "left", "middle");
      cx += widths[c];
    });
  });
}

function step(ctx, slide, n, h, b, x, y, w, he, accent = C.blue) {
  shape(ctx, slide, x, y, w, he, C.white, true, C.line, 1);
  shape(ctx, slide, x + 18, y + 18, 38, 38, accent, true, accent, 0);
  text(ctx, slide, String(n), x + 18, y + 22, 38, 24, 20, C.white, true, "center", "middle");
  text(ctx, slide, h, x + 70, y + 18, w - 86, 30, 20, C.ink, true);
  text(ctx, slide, b, x + 20, y + 64, w - 40, Math.max(34, he - 82), 14, C.muted);
}

function bar(ctx, slide, label, val, x, y, w, color, max = 100) {
  text(ctx, slide, label, x, y - 3, 150, 22, 15, C.muted);
  shape(ctx, slide, x + 155, y + 3, w, 14, "#E2EAF2", true, "#E2EAF2", 0);
  shape(ctx, slide, x + 155, y + 3, Math.max(4, w * val / max), 14, color, true, color, 0);
  text(ctx, slide, `${val.toFixed(2)}%`, x + 165 + w, y - 3, 85, 22, 15, C.ink, true);
}

async function image(ctx, slide, path, x, y, w, h) {
  await ctx.addImage(slide, { path, x, y, w, h, fit: "contain" });
}

export async function buildSlide(presentation, ctx, n) {
  const slide = presentation.slides.add();

  if (n === 1) {
    shape(ctx, slide, 0, 0, 1280, 720, C.bg, false, C.bg, 0);
    shape(ctx, slide, 0, 0, 1280, 18, C.blue, false, C.blue, 0);
    shape(ctx, slide, 0, 610, 1280, 110, C.blue2, false, C.blue2, 0);
    await image(ctx, slide, `${PAPER}/image1.png`, 76, 58, 88, 88);
    await image(ctx, slide, `${PAPER}/image2.png`, 176, 70, 255, 62);
    chip(ctx, slide, "毕业设计答辩", 76, 180, 130, C.red2, C.red);
    text(ctx, slide, "基于 PathVQA 数据集的", 76, 238, 970, 52, 39, C.ink, true);
    text(ctx, slide, "轻量级医疗视觉问答模型设计与实现", 76, 300, 1080, 64, 43, C.blue, true);
    text(ctx, slide, "从数据处理、轻量级多模态模型、两阶段训练到网页端原型系统的完整实现", 78, 395, 1000, 30, 18, C.muted);
    text(ctx, slide, "答辩人：周健    学号：208221335    专业：人工智能", 78, 642, 750, 24, 16, C.ink, true);
    text(ctx, slide, "指导教师：王青云 / 蔡亮亮    通信与人工智能学院、集成电路学院", 78, 672, 820, 22, 14, C.muted);
    text(ctx, slide, "建议汇报时长：约 7 分钟", 1010, 660, 180, 22, 14, C.blue, true, "right");
    return slide;
  }

  if (n === 2) {
    title(ctx, slide, "01 / 研究背景", "医疗视觉问答把“看图”和“理解问题”放到同一个任务中", "目标不是单纯图像分类，而是根据用户问题输出有针对性的候选答案。");
    card(ctx, slide, "现实意义", "病理图像、影像图片等医学视觉数据增长较快，交互式问答可以辅助教学、检索和初步分析。", 80, 225, 330, 168, C.blue);
    card(ctx, slide, "技术难点", "医学图像细节复杂，问题文本包含专业术语；模型需要同时处理视觉特征和语言语义。", 475, 225, 330, 168, C.amber);
    card(ctx, slide, "本文定位", "构建轻量级 VQA 原型，不追求临床诊断替代，而是验证小模型完成图文问答闭环的可行性。", 870, 225, 330, 168, C.green);
    await image(ctx, slide, `${FIG}/fig2_1_vqa_flow.png`, 210, 430, 850, 175);
    footer(ctx, slide, n); return slide;
  }

  if (n === 3) {
    title(ctx, slide, "02 / 研究内容", "本文完成了从数据到系统演示的完整闭环", "答辩汇报按“数据、模型、训练、评估、系统”展开。");
    step(ctx, slide, 1, "数据处理", "解析 PathVQA 图像、问题和答案；建立词表、答案映射和固定数据划分。", 90, 238, 210, 185, C.blue);
    step(ctx, slide, 2, "模型设计", "ResNet18 提取图像特征，Embedding+LSTM 编码问题，拼接后进行答案分类。", 325, 238, 210, 185, C.cyan);
    step(ctx, slide, 3, "训练优化", "第一阶段冻结图像骨干，第二阶段微调 ResNet18 高层特征。", 560, 238, 210, 185, C.amber);
    step(ctx, slide, 4, "实验评估", "使用 Loss、Top-1 Accuracy 和 Top-5 Accuracy 评价模型效果。", 795, 238, 210, 185, C.green);
    step(ctx, slide, 5, "系统实现", "基于 Gradio 搭建网页端，支持图像上传、问题输入和 Top-5 候选展示。", 1030, 238, 170, 185, C.red);
    metric(ctx, slide, "闭环实现", "数据预处理 → 模型训练 → 测试评估 → Web 展示", 300, 510, 680, C.blue, C.blue2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 4) {
    title(ctx, slide, "03 / 数据集与预处理", "固定划分和统一映射保证实验结果可复现", "词表和答案类别只由训练集构建，验证集和测试集复用同一套映射。");
    await image(ctx, slide, `${FIG}/fig3_1_fields.png`, 70, 216, 530, 252);
    table(ctx, slide, [
      ["数据划分", "样本数量", "用途"],
      ["训练集", "12,523", "模型参数学习"],
      ["验证集", "2,438", "训练过程选择最优模型"],
      ["测试集", "2,342", "最终泛化性能评估"],
    ], 665, 228, [180, 150, 270], 56);
    chip(ctx, slide, "最大问题长度 20", 665, 486, 150, C.blue2, C.blue);
    chip(ctx, slide, "词表 4,331", 835, 486, 120, C.cyan2, C.cyan);
    chip(ctx, slide, "答案类别 2,079", 975, 486, 150, C.green2, C.green);
    footer(ctx, slide, n); return slide;
  }

  if (n === 5) {
    title(ctx, slide, "04 / 模型总体结构", "图像分支和文本分支分别编码，再融合为答案分类特征", "本质上把医疗视觉问答建模为 2,079 类候选答案分类任务。");
    await image(ctx, slide, `${FIG}/fig3_2_model.png`, 72, 215, 770, 330);
    card(ctx, slide, "图像编码", "ResNet18 输出 512 维视觉特征。", 890, 212, 285, 98, C.blue, C.blue2);
    card(ctx, slide, "文本编码", "Embedding + LSTM 输出 256 维问题语义特征。", 890, 334, 285, 108, C.cyan, C.cyan2);
    card(ctx, slide, "特征融合", "拼接为 768 维联合特征，再输入全连接分类器。", 890, 466, 285, 108, C.green, C.green2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 6) {
    title(ctx, slide, "05 / 关键模块设计", "轻量化体现在模型选择、融合方式和分类器设计上", "结构简单的好处是训练成本低、调试清晰，适合本科设计中的完整工程实现。");
    card(ctx, slide, "ResNet18 图像编码器", "输入图像统一调整为 224×224；使用本地预训练权重；第一阶段冻结卷积层，第二阶段只微调 layer4。", 82, 226, 330, 220, C.blue);
    card(ctx, slide, "Embedding + LSTM 文本编码器", "词嵌入维度为 128，LSTM 隐藏维度为 256；取最后隐藏状态作为问题语义表示。", 475, 226, 330, 220, C.cyan);
    card(ctx, slide, "融合分类器", "图文特征拼接为 768 维；经过 Linear、ReLU、Dropout 和最终 Linear 输出答案类别。", 868, 226, 330, 220, C.green);
    metric(ctx, slide, "512", "视觉特征维度", 200, 505, 205, C.blue);
    metric(ctx, slide, "256", "文本特征维度", 538, 505, 205, C.cyan);
    metric(ctx, slide, "2,079", "答案分类数量", 876, 505, 205, C.green);
    footer(ctx, slide, n); return slide;
  }

  if (n === 7) {
    title(ctx, slide, "06 / 两阶段训练策略", "先稳定学习图文映射，再小步微调医学图像高层特征", "这样在训练成本和性能提升之间取得折中。");
    await image(ctx, slide, `${FIG}/fig4_4_training.png`, 78, 220, 600, 220);
    step(ctx, slide, 1, "第一阶段：冻结视觉骨干", "冻结 ResNet18 卷积层，训练文本编码器和分类器；训练 5 个 epoch。", 730, 218, 370, 120, C.blue);
    step(ctx, slide, 2, "第二阶段：微调 layer4", "加载第一阶段最优模型，解冻 ResNet18 的 layer4；训练 3 个 epoch。", 730, 372, 370, 120, C.amber);
    chip(ctx, slide, "Stage 1 学习率 1e-3", 180, 498, 170, C.blue2, C.blue);
    chip(ctx, slide, "Layer4 学习率 1e-5", 375, 498, 170, C.amber2, C.amber);
    chip(ctx, slide, "其他模块学习率 1e-4", 570, 498, 175, C.green2, C.green);
    footer(ctx, slide, n); return slide;
  }

  if (n === 8) {
    title(ctx, slide, "07 / 实验设置与评价指标", "评价既看首选答案，也看候选答案排序能力", "Top-5 对候选推荐型问答系统更有参考价值。");
    table(ctx, slide, [
      ["项目", "配置 / 取值", "说明"],
      ["开发环境", "Windows + PyCharm", "本地训练、调试与演示"],
      ["深度学习框架", "PyTorch", "模型训练与推理"],
      ["硬件", "RTX 3060 + CUDA 11.8", "加速训练与推理"],
      ["损失函数", "Cross Entropy", "多类别分类任务"],
      ["核心指标", "Loss / Top-1 / Top-5", "从误差、首选和候选覆盖三方面评价"],
    ], 90, 220, [170, 270, 600], 58);
    card(ctx, slide, "指标解释", "Top-1 表示首选答案是否正确；Top-5 表示正确答案是否进入前五个候选。网页端展示 Top-5，能更贴合“辅助参考”的系统定位。", 145, 560, 940, 92, C.cyan, C.cyan2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 9) {
    title(ctx, slide, "08 / 实验结果", "二阶段微调后，Top-1 和 Top-5 均明显提升", "最终测试集 Top-1 为 49.87%，Top-5 为 85.65%。");
    metric(ctx, slide, "49.87%", "第二阶段 Top-1 Accuracy", 78, 214, 245, C.blue, C.blue2);
    metric(ctx, slide, "85.65%", "第二阶段 Top-5 Accuracy", 358, 214, 245, C.green, C.green2);
    metric(ctx, slide, "1.6937", "第二阶段 Test Loss", 638, 214, 245, C.amber, C.amber2);
    metric(ctx, slide, "+5.72%", "Top-1 提升幅度", 918, 214, 245, C.cyan, C.cyan2);
    bar(ctx, slide, "Top-1 阶段1", 44.15, 160, 405, 430, C.blue);
    bar(ctx, slide, "Top-1 阶段2", 49.87, 160, 452, 430, C.cyan);
    bar(ctx, slide, "Top-5 阶段1", 81.38, 160, 522, 430, C.blue);
    bar(ctx, slide, "Top-5 阶段2", 85.65, 160, 569, 430, C.green);
    card(ctx, slide, "结论", "解冻 ResNet18 高层后，模型对医学图像特征的适配更充分，候选答案排序能力进一步增强。", 880, 425, 285, 140, C.green, C.green2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 10) {
    title(ctx, slide, "09 / 网页端系统实现", "Gradio 将模型能力转换为可现场演示的交互系统", "系统支持图像上传、问题输入、Top-1 输出、Top-5 候选展示和结果解释。");
    await image(ctx, slide, `${PAPER}/image8.png`, 70, 205, 765, 425);
    card(ctx, slide, "输入", "上传医学图像；输入英文问题；可加载内置示例。", 875, 220, 280, 88, C.blue, C.blue2);
    card(ctx, slide, "推理", "加载二阶段最优模型；自动选择 GPU/CPU；输出答案概率排序。", 875, 338, 280, 100, C.cyan, C.cyan2);
    card(ctx, slide, "展示", "显示 Top-1 推荐答案、Top-5 候选答案和 Top1-Top2 差值解释。", 875, 468, 280, 112, C.green, C.green2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 11) {
    title(ctx, slide, "10 / 系统测试与演示流程", "演示重点是稳定展示完整问答闭环，而不是临时输入陌生样例", "建议现场使用内置示例和高频问题，保证答辩节奏。");
    step(ctx, slide, 1, "加载示例", "点击“加载示例”按钮，自动填入图像和问题。", 88, 235, 230, 170, C.blue);
    step(ctx, slide, 2, "点击问答", "系统完成预处理、模型推理和结果排序。", 355, 235, 230, 170, C.cyan);
    step(ctx, slide, 3, "解释结果", "先说明 Top-1，再说明 Top-5 是候选参考。", 622, 235, 230, 170, C.green);
    step(ctx, slide, 4, "说明边界", "概率用于排序，不等同于临床置信度。", 889, 235, 230, 170, C.amber);
    await image(ctx, slide, `${PAPER}/image9.png`, 200, 455, 870, 125);
    card(ctx, slide, "已测试功能", "图像上传、问题输入、高频问题选择、模型推理、Top-5 展示和清空操作均可正常运行。", 215, 575, 840, 82, C.green, C.green2);
    footer(ctx, slide, n); return slide;
  }

  if (n === 12) {
    title(ctx, slide, "11 / 总结与展望", "本文完成了轻量级医疗视觉问答模型与网页原型系统", "最后主动说明贡献、局限和后续改进方向。");
    card(ctx, slide, "完成工作", "完成 PathVQA 数据预处理、轻量级多模态模型设计、两阶段训练、实验评估和 Gradio 系统实现。", 82, 225, 330, 160, C.blue, C.blue2);
    card(ctx, slide, "主要结果", "二阶段模型测试集 Top-1 达到 49.87%，Top-5 达到 85.65%，具备较好的候选答案推荐能力。", 475, 225, 330, 160, C.green, C.green2);
    card(ctx, slide, "系统价值", "系统可以作为医学图像问答的教学与原型验证工具，展示图文联合理解的基本流程。", 868, 225, 330, 160, C.cyan, C.cyan2);
    card(ctx, slide, "不足", "融合方式较简单，缺少区域级注意力；答案类别存在长尾分布；模型尚不能用于临床诊断。", 162, 450, 410, 135, C.amber, C.amber2);
    card(ctx, slide, "展望", "后续可引入注意力机制、医学视觉语言预训练模型、答案归一化和更严格的医学专家评测。", 708, 450, 410, 135, C.red, C.red2);
    text(ctx, slide, "谢谢各位老师，请批评指正", 0, 640, 1280, 38, 24, C.blue, true, "center");
    footer(ctx, slide, n); return slide;
  }

  return slide;
}
