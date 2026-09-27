const PAPER = "C:/Users/28026/Desktop/毕业设计/outputs/manual-20260605-vqa-detail/presentations/medical-vqa-defense-detail/assets/paper_media";
const FIG = "C:/Users/28026/Desktop/毕业设计/round10_figures";
const PROJ = "C:/Users/28026/Desktop/pathvqa_project";

const C = {
  bg: "#07111D",
  bg2: "#0D2030",
  panel: "#132B3D",
  panel2: "#18384E",
  ink: "#F6FAFC",
  muted: "#AFC1CC",
  quiet: "#7692A3",
  cyan: "#45D2D0",
  blue: "#4D7CFE",
  amber: "#FFC857",
  green: "#62D69B",
  coral: "#FF7A7A",
  red: "#B5121B",
  dark: "#07111D",
};

function box(ctx, slide, x, y, w, h, fill = C.panel, r = true, line = "#00000000", lw = 0, name) {
  return ctx.addShape(slide, { geometry: r ? "roundRect" : "rect", x, y, w, h, fill, line: ctx.line(line, lw), name });
}
function txt(ctx, slide, s, x, y, w, h, size = 20, color = C.ink, bold = false, align = "left", valign = "top") {
  return ctx.addText(slide, {
    text: s, x, y, w, h, size, color, bold, align, valign, face: "Microsoft YaHei",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}
function title(ctx, slide, sec, h, sub = "") {
  box(ctx, slide, 0, 0, 1280, 720, C.bg, false);
  box(ctx, slide, 58, 42, 6, 25, C.cyan, true);
  txt(ctx, slide, sec, 78, 39, 780, 30, 17, C.cyan, true, "left", "middle");
  txt(ctx, slide, h, 58, 80, 1160, 56, 34, C.ink, true);
  if (sub) txt(ctx, slide, sub, 60, 148, 1120, 32, 18, C.muted);
}
function footer(ctx, slide, n) {
  box(ctx, slide, 58, 684, 1164, 1, "#2B4859", false);
  txt(ctx, slide, "基于 PathVQA 数据集的轻量级医疗视觉问答模型设计与实现", 58, 691, 780, 18, 11, C.quiet);
  txt(ctx, slide, String(n).padStart(2, "0"), 1175, 690, 45, 20, 12, C.cyan, true, "right");
}
function chip(ctx, slide, s, x, y, w, fill = C.panel2, color = C.cyan) {
  box(ctx, slide, x, y, w, 30, fill, true);
  txt(ctx, slide, s, x, y + 4, w, 20, 14, color, true, "center", "middle");
}
function callout(ctx, slide, s, x = 58, y = 622, w = 900) {
  box(ctx, slide, x, y, w, 42, "#102A3C", true);
  txt(ctx, slide, "答辩话术", x + 14, y + 11, 84, 20, 14, C.cyan, true);
  txt(ctx, slide, s, x + 105, y + 11, w - 118, 20, 14, C.muted);
}
function card(ctx, slide, h, b, x, y, w, he, accent = C.cyan) {
  box(ctx, slide, x, y, w, he, C.panel, true);
  box(ctx, slide, x, y, 5, he, accent, true);
  txt(ctx, slide, h, x + 18, y + 14, w - 34, 28, 20, C.ink, true);
  txt(ctx, slide, b, x + 18, y + 52, w - 34, he - 64, 15, C.muted);
}
function metric(ctx, slide, v, l, x, y, w, col = C.cyan) {
  box(ctx, slide, x, y, w, 105, C.panel, true);
  txt(ctx, slide, v, x + 17, y + 14, w - 28, 44, 34, col, true);
  txt(ctx, slide, l, x + 18, y + 68, w - 36, 22, 15, C.muted);
}
function step(ctx, slide, num, h, b, x, y, w, he, accent = C.cyan) {
  box(ctx, slide, x, y, w, he, C.panel, true);
  box(ctx, slide, x + 16, y + 16, 40, 40, accent, true);
  txt(ctx, slide, String(num), x + 16, y + 20, 40, 28, 20, C.dark, true, "center", "middle");
  txt(ctx, slide, h, x + 70, y + 18, w - 86, 28, 19, C.ink, true);
  txt(ctx, slide, b, x + 18, y + 68, w - 36, he - 84, 14, C.muted);
}
function arrow(ctx, slide, x, y, w, col = C.cyan) {
  box(ctx, slide, x, y + 7, w - 13, 4, col, true);
  box(ctx, slide, x + w - 16, y, 16, 18, col, true);
}
function bar(ctx, slide, label, val, x, y, w, color, max = 100) {
  txt(ctx, slide, label, x, y - 2, 155, 22, 15, C.muted);
  box(ctx, slide, x + 160, y + 3, w, 14, "#25485A", true);
  box(ctx, slide, x + 160, y + 3, Math.max(4, w * val / max), 14, color, true);
  txt(ctx, slide, `${val.toFixed(2)}%`, x + 173 + w, y - 2, 84, 22, 15, C.ink, true);
}
function table(ctx, slide, rows, x, y, widths, rowH, headerFill = C.cyan) {
  rows.forEach((row, r) => {
    let cx = x;
    row.forEach((cell, c) => {
      const fill = r === 0 ? headerFill : (r % 2 ? C.panel : C.panel2);
      const color = r === 0 ? C.dark : (c === 1 ? C.cyan : C.ink);
      box(ctx, slide, cx, y + r * rowH, widths[c], rowH, fill, false, "#365468", 1);
      txt(ctx, slide, cell, cx + 12, y + r * rowH + 9, widths[c] - 24, rowH - 15, 14, color, r === 0 || c === 1, c === 1 ? "center" : "left", "middle");
      cx += widths[c];
    });
  });
}

export async function buildSlide(presentation, ctx, n) {
  const slide = presentation.slides.add();
  if (n === 1) {
    box(ctx, slide, 0, 0, 1280, 720, C.bg, false);
    await ctx.addImage(slide, { path: `${PAPER}/image1.png`, x: 82, y: 62, w: 106, h: 100, fit: "contain" });
    await ctx.addImage(slide, { path: `${PAPER}/image2.png`, x: 204, y: 85, w: 270, h: 70, fit: "contain" });
    chip(ctx, slide, "详细答辩版｜主讲 + 备用页", 82, 210, 210, C.cyan, C.dark);
    txt(ctx, slide, "基于 PathVQA 数据集的轻量级", 82, 272, 1000, 58, 42, C.ink, true);
    txt(ctx, slide, "医疗视觉问答模型设计与实现", 82, 338, 1080, 65, 48, C.cyan, true);
    txt(ctx, slide, "围绕“为什么做、怎么做、效果如何、系统如何演示、局限在哪里”展开", 84, 438, 1030, 34, 20, C.muted);
    box(ctx, slide, 82, 526, 1110, 1, "#3A5E70", false);
    txt(ctx, slide, "答辩人：周健   学号：208221335   专业：人工智能", 84, 558, 780, 26, 18, C.ink);
    txt(ctx, slide, "指导教师：王青云 / 蔡亮亮    通信与人工智能学院、集成电路学院", 84, 596, 850, 25, 16, C.muted);
    txt(ctx, slide, "建议主讲 7 分钟，附录用于问答", 84, 634, 430, 22, 15, C.cyan, true);
    return slide;
  }
  if (n === 2) {
    title(ctx, slide, "00 / 答辩路线", "先讲清楚主线，再用附录兜住追问", "答辩时不要逐字念论文，抓住每页的核心结论。");
    const items = [
      ["1", "研究背景", "为什么医疗 VQA 有意义，为什么选择轻量化"],
      ["2", "数据与模型", "PathVQA 数据处理、ResNet18 + LSTM 多模态结构"],
      ["3", "训练与评估", "两阶段训练、Top-1/Top-5、Loss 与推理时间"],
      ["4", "系统演示", "Gradio 页面、Top-5 候选解释、演示边界"],
      ["5", "总结展望", "已完成工作、局限性、后续改进方向"],
    ];
    items.forEach((it, i) => step(ctx, slide, it[0], it[1], it[2], 75 + i * 230, 260, 190, 190, [C.cyan, C.blue, C.amber, C.green, C.coral][i]));
    callout(ctx, slide, "每页只记一句话：我解决了什么问题，用什么方法证明，结果说明什么。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 3) {
    title(ctx, slide, "01 / 研究背景", "医疗视觉问答要同时理解图像和问题，比单一分类更接近交互式辅助分析", "它不是只判断一张图属于哪类，而是根据用户提出的问题输出有针对性的答案。");
    card(ctx, slide, "现实需求", "医学图像数量增长，基层医疗和教学场景需要更高效的图像信息提取方式。", 70, 225, 330, 160, C.cyan);
    card(ctx, slide, "技术难点", "医学图像细节细微，问题文本包含专业术语，答案空间比普通分类更复杂。", 475, 225, 330, 160, C.amber);
    card(ctx, slide, "本文切入点", "不追求大模型堆参数，而是验证轻量级多模态模型在原型系统中的可行性。", 880, 225, 330, 160, C.green);
    await ctx.addImage(slide, { path: `${FIG}/fig2_1_vqa_flow.png`, x: 185, y: 420, w: 900, h: 180, fit: "contain" });
    callout(ctx, slide, "这一页重点说：我的系统定位是“医学图像问答原型”，不是临床诊断系统。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 4) {
    title(ctx, slide, "02 / 研究现状与本文定位", "高性能方法越来越复杂，本文强调轻量化、可复现和可演示", "本科设计更重要的是把数据、模型、训练、测试、系统串成闭环。");
    card(ctx, slide, "已有方向", "CNN/RNN 基础框架\n注意力机制与双线性融合\nTransformer 与视觉语言预训练\n知识增强与医学先验", 70, 220, 315, 280, C.blue);
    card(ctx, slide, "现实约束", "数据量与标注成本有限\n答案类别多且分布不均衡\n大模型训练和部署成本高\n普通设备演示稳定性要求高", 475, 220, 315, 280, C.coral);
    card(ctx, slide, "本文贡献", "固定划分保证可复现\n轻量模型降低实现成本\n两阶段训练提升适配能力\n网页端完成交互展示", 880, 220, 315, 280, C.green);
    metric(ctx, slide, "完整闭环", "数据处理 → 训练 → 评估 → Web 演示", 310, 535, 660, C.cyan);
    callout(ctx, slide, "如果老师问创新点，就答：创新不是提出全新大模型，而是轻量化方案的完整实现和工程验证。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 5) {
    title(ctx, slide, "03 / 数据集与预处理", "固定划分和统一映射，是后续实验可信的基础", "词表和答案类别只由训练集构建，验证集与测试集复用映射，避免信息泄露。");
    await ctx.addImage(slide, { path: `${FIG}/fig3_1_fields.png`, x: 65, y: 210, w: 540, h: 256, fit: "contain" });
    table(ctx, slide, [
      ["数据划分", "样本数量", "用途"],
      ["训练集", "12,523", "模型参数学习"],
      ["验证集", "2,438", "训练过程选择模型"],
      ["测试集", "2,342", "最终泛化评估"],
    ], 665, 226, [180, 150, 260], 52);
    chip(ctx, slide, "问题最大长度 20", 665, 470, 150, C.panel2, C.cyan);
    chip(ctx, slide, "词表 4,331", 835, 470, 120, C.panel2, C.amber);
    chip(ctx, slide, "答案类别 2,079", 975, 470, 150, C.panel2, C.green);
    callout(ctx, slide, "这一页要强调“可复现”：不是每次随机切分，而是固定 train / val / test。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 6) {
    title(ctx, slide, "04 / 数据特点", "答案类别多且不均衡，所以需要同时看 Top-1 和 Top-5", "Top-5 能反映模型把正确答案放入候选范围的能力，更适合候选推荐系统。");
    await ctx.addImage(slide, { path: `${PROJ}/fig3_4_answer_distribution.png`, x: 70, y: 205, w: 710, h: 370, fit: "contain" });
    card(ctx, slide, "现象 1：高频答案集中", "yes / no、检查方式、器官名等高频答案占比较高，模型容易学习到这些分布规律。", 830, 220, 330, 105, C.cyan);
    card(ctx, slide, "现象 2：长尾答案较多", "答案类别达到 2,079，医学异常和诊断表达有长尾分布，Top-1 难度较高。", 830, 350, 330, 105, C.amber);
    card(ctx, slide, "展示策略", "网页端展示 Top-5 候选，不把单个概率包装为临床置信度。", 830, 480, 330, 95, C.green);
    callout(ctx, slide, "如果老师问为什么 Top-5 高很多：因为答案空间大，正确答案进入前五说明模型有候选排序能力。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 7) {
    title(ctx, slide, "05 / 总体模型结构", "图像分支和文本分支分别编码，再拼接为联合特征进行答案分类", "本文把医疗 VQA 建模为多类别分类任务：从训练答案集合中选出最可能答案。");
    await ctx.addImage(slide, { path: `${FIG}/fig3_2_model.png`, x: 70, y: 200, w: 820, h: 345, fit: "contain" });
    card(ctx, slide, "输入", "医学图像\n英文问题文本", 930, 212, 230, 82, C.cyan);
    card(ctx, slide, "编码", "ResNet18 → 512维\nEmbedding+LSTM → 256维", 930, 317, 230, 100, C.blue);
    card(ctx, slide, "输出", "融合特征 768维\n分类器输出 2079 类", 930, 440, 230, 100, C.green);
    callout(ctx, slide, "讲的时候按输入、编码、融合、分类四步走，不需要一上来讲公式。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 8) {
    title(ctx, slide, "06 / 关键模块细化", "模型轻量化主要体现在 ResNet18、单层 LSTM 和简单特征拼接", "结构简单的好处是训练成本低、调试清晰，缺点是细粒度对齐能力有限。");
    card(ctx, slide, "图像编码器：ResNet18", "使用本地预训练权重；将 fc 层替换为 Identity；输出 512 维视觉特征；第一阶段冻结，第二阶段只微调 layer4。", 70, 218, 340, 230, C.cyan);
    card(ctx, slide, "文本编码器：Embedding + LSTM", "简单分词后映射到词表；Embedding 维度 128；LSTM hidden 维度 256；取最后隐藏状态表示问题语义。", 470, 218, 340, 230, C.amber);
    card(ctx, slide, "融合与分类", "torch.cat 拼接为 768 维；Linear → ReLU → Dropout → Linear；输出 2,079 个答案类别的 logits。", 870, 218, 340, 230, C.green);
    metric(ctx, slide, "768维", "512 图像特征 + 256 文本特征", 252, 505, 280, C.cyan);
    metric(ctx, slide, "Dropout 0.3", "降低分类器过拟合风险", 585, 505, 280, C.amber);
    metric(ctx, slide, "Softmax", "用于候选答案排序", 918, 505, 280, C.green);
    callout(ctx, slide, "老师问为什么不用更复杂模型：因为本文目标是轻量原型，优先保证可训练、可部署、可解释。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 9) {
    title(ctx, slide, "07 / 训练策略", "两阶段训练让模型先学会图文映射，再适配医学图像高层特征", "这是一种在性能和训练成本之间折中的微调策略。");
    await ctx.addImage(slide, { path: `${FIG}/fig4_4_training.png`, x: 70, y: 210, w: 620, h: 230, fit: "contain" });
    step(ctx, slide, 1, "第一阶段", "冻结 ResNet18 卷积层\n训练文本编码与分类器\n5 个 epoch，学习基础映射", 745, 210, 390, 135, C.cyan);
    step(ctx, slide, 2, "第二阶段", "加载第一阶段最佳模型\n解冻 ResNet18.layer4\n分组学习率微调 3 个 epoch", 745, 380, 390, 145, C.amber);
    chip(ctx, slide, "stage1 lr = 1e-3", 210, 485, 160, C.panel2, C.cyan);
    chip(ctx, slide, "layer4 lr = 1e-5", 390, 485, 160, C.panel2, C.amber);
    chip(ctx, slide, "其他模块 lr = 1e-4", 570, 485, 175, C.panel2, C.green);
    callout(ctx, slide, "讲清原因：底层边缘纹理通用，高层语义更需要适配医学图像。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 10) {
    title(ctx, slide, "08 / 实验设置", "评价指标围绕分类效果和演示实时性展开", "Top-1 看首选答案是否正确，Top-5 看候选排序是否覆盖正确答案。");
    table(ctx, slide, [
      ["项目", "配置 / 取值", "说明"],
      ["操作系统", "Windows", "本地实验与演示环境"],
      ["框架", "PyTorch", "模型训练与推理"],
      ["GPU", "RTX 3060 + CUDA 11.8", "用于加速训练与推理"],
      ["损失函数", "Cross Entropy", "多类别分类常用损失"],
      ["批大小", "8 / 16", "训练与评估分别设置"],
      ["Top-k", "5", "网页端展示前五候选"],
    ], 84, 205, [170, 310, 560], 52);
    card(ctx, slide, "核心评价逻辑", "测试集不参与训练和调参，因此最终测试结果更能反映模型泛化能力。", 84, 585, 1040, 64, C.cyan);
    footer(ctx, slide, n); return slide;
  }
  if (n === 11) {
    title(ctx, slide, "09 / 验证集结果", "二阶段训练过程中验证损失下降，验证准确率提升到 0.4987", "说明解冻高层视觉特征后，模型对医学图像特征的适配更好。");
    table(ctx, slide, [
      ["阶段", "Val Loss", "Val Acc", "说明"],
      ["第一阶段第5轮", "2.1022", "0.4171", "冻结图像编码器训练"],
      ["二阶段第1轮", "2.0060", "0.4500", "开始微调 ResNet 高层"],
      ["二阶段第2轮", "1.9683", "0.4635", "验证性能继续提升"],
      ["二阶段第3轮", "1.9472", "0.4987", "保存二阶段最佳模型"],
    ], 90, 225, [250, 170, 170, 520], 62);
    metric(ctx, slide, "0.4987", "最高验证准确率", 210, 560, 260, C.cyan);
    metric(ctx, slide, "1.9472", "最低验证损失", 510, 560, 260, C.amber);
    metric(ctx, slide, "layer4", "高层视觉特征微调", 810, 560, 260, C.green);
    footer(ctx, slide, n); return slide;
  }
  if (n === 12) {
    title(ctx, slide, "10 / 测试集结果", "最终测试显示二阶段模型 Top-1、Top-5 均有提升", "Top-5 达到 85.65%，说明模型具备较好的候选答案排序能力。");
    metric(ctx, slide, "49.87%", "第二阶段 Top-1 Acc", 70, 215, 250, C.cyan);
    metric(ctx, slide, "85.65%", "第二阶段 Top-5 Acc", 350, 215, 250, C.green);
    metric(ctx, slide, "1.6937", "第二阶段 Test Loss", 630, 215, 250, C.amber);
    metric(ctx, slide, "0.007s", "平均单样本推理", 910, 215, 250, C.blue);
    bar(ctx, slide, "Top-1 阶段1", 44.15, 120, 390, 500, C.blue);
    bar(ctx, slide, "Top-1 阶段2", 49.87, 120, 435, 500, C.cyan);
    bar(ctx, slide, "Top-5 阶段1", 81.38, 120, 505, 500, C.blue);
    bar(ctx, slide, "Top-5 阶段2", 85.65, 120, 550, 500, C.green);
    card(ctx, slide, "一句话结论", "二阶段微调后 Top-1 提升 5.72 个百分点，Top-5 提升 4.27 个百分点，Loss 下降 0.1840。", 900, 390, 270, 150, C.cyan);
    footer(ctx, slide, n); return slide;
  }
  if (n === 13) {
    title(ctx, slide, "11 / 网页端系统", "Gradio 页面把模型能力转成可现场演示的交互流程", "重点展示上传图像、输入问题、Top-1 推荐、Top-5 候选和结果解释。");
    await ctx.addImage(slide, { path: `${PAPER}/image8.png`, x: 65, y: 198, w: 775, h: 432, fit: "contain" });
    card(ctx, slide, "输入层", "医学图像上传\n英文问题输入\n示例图片加载", 875, 210, 280, 102, C.cyan);
    card(ctx, slide, "推理层", "加载二阶段最佳模型\n使用 GPU/CPU 自动选择\nSoftmax 输出排序", 875, 336, 280, 118, C.amber);
    card(ctx, slide, "展示层", "Top-1 推荐答案\nTop-5 候选答案\nTop1-Top2 差值解释", 875, 480, 280, 118, C.green);
    footer(ctx, slide, n); return slide;
  }
  if (n === 14) {
    title(ctx, slide, "12 / 演示策略", "现场演示要稳定，不要临时自由输入太多陌生问题", "使用系统内置示例和高频问题，既能展示功能，也能减少输入分布偏移。");
    step(ctx, slide, 1, "载入示例", "点击“载入示例1/2/3”\n自动填入图像与问题", 82, 240, 230, 185, C.cyan);
    arrow(ctx, slide, 330, 315, 48);
    step(ctx, slide, 2, "开始问答", "点击按钮后等待推理\n状态栏显示设备与差值", 395, 240, 230, 185, C.blue);
    arrow(ctx, slide, 643, 315, 48);
    step(ctx, slide, 3, "解释结果", "先读 Top-1\n再说明 Top-5 候选范围", 708, 240, 230, 185, C.green);
    arrow(ctx, slide, 956, 315, 48);
    step(ctx, slide, 4, "说明边界", "概率用于排序参考\n不能替代医生诊断", 1021, 240, 180, 185, C.amber);
    await ctx.addImage(slide, { path: `${PAPER}/image9.png`, x: 210, y: 465, w: 860, h: 125, fit: "contain" });
    callout(ctx, slide, "演示时说：为了稳定展示模型能力，我使用训练集中高频问题作为演示入口。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 15) {
    title(ctx, slide, "13 / 局限性", "模型已经可运行，但仍是原型系统，不是临床诊断工具", "主动说明局限，反而能体现你对系统边界的理解。");
    card(ctx, slide, "结构局限", "融合方式是简单拼接，没有共同注意力或交叉注意力，对细粒度区域和词语对齐能力有限。", 70, 225, 330, 190, C.coral);
    card(ctx, slide, "数据局限", "答案类别长尾分布明显，同义答案和长短表达混杂，会增加分类难度。", 475, 225, 330, 190, C.amber);
    card(ctx, slide, "系统局限", "目前不能主动识别分布外输入，输入偏离训练集时仍会给出某个候选答案。", 880, 225, 330, 190, C.cyan);
    card(ctx, slide, "展示策略", "所以网页端强调 Top-5 候选和排序参考，避免把概率当作临床置信度。", 255, 475, 770, 80, C.green);
    callout(ctx, slide, "老师如果指出准确率不高，要承认：任务难、类别多；本文价值在轻量化闭环和候选排序能力。");
    footer(ctx, slide, n); return slide;
  }
  if (n === 16) {
    title(ctx, slide, "14 / 总结与展望", "本文完成了从数据处理到网页演示的轻量级医疗 VQA 闭环", "后续可从数据、模型和系统三方面继续优化。");
    card(ctx, slide, "本文完成", "固定数据划分与预处理\nResNet18 + LSTM 多模态模型\n两阶段训练与测试评估\nGradio 网页演示系统", 80, 225, 330, 245, C.cyan);
    card(ctx, slide, "实验结论", "二阶段模型 Top-1 为 49.87%\nTop-5 为 85.65%\n平均单样本推理 0.007s\n具备实时演示能力", 475, 225, 330, 245, C.green);
    card(ctx, slide, "未来改进", "答案归一化与数据增强\n轻量注意力或轻量 Transformer\n分布外拒答与结果解释\nONNX / TorchScript 部署", 870, 225, 330, 245, C.amber);
    txt(ctx, slide, "谢谢各位老师，欢迎批评指正", 80, 555, 760, 42, 32, C.ink, true);
    chip(ctx, slide, "备用页从下一页开始", 80, 614, 170, C.panel2, C.cyan);
    footer(ctx, slide, n); return slide;
  }
  if (n === 17) {
    title(ctx, slide, "附录 A / 代码结构", "老师追问代码时，可以按文件职责回答", "不要背全部代码，抓住数据、模型、训练、评估、演示五条线。");
    table(ctx, slide, [
      ["文件", "作用", "答辩时怎么说"],
      ["data_preprocess.py", "固定划分数据读取、清洗、编码", "保证 train/val/test 映射一致"],
      ["model.py", "定义 VQAModel", "ResNet18 + Embedding/LSTM + 分类器"],
      ["train.py", "第一阶段训练", "冻结图像编码器，先学基础映射"],
      ["train_finetune.py", "第二阶段微调", "只解冻 layer4，降低训练成本"],
      ["evaluate.py", "测试集评估", "计算 Loss、Top-1、Top-5、推理时间"],
      ["app.py", "Gradio 演示系统", "完成上传、问答、候选结果展示"],
    ], 70, 205, [220, 330, 560], 58);
    footer(ctx, slide, n); return slide;
  }
  if (n === 18) {
    title(ctx, slide, "附录 B / 常见追问速答", "把问题往“设计取舍”和“工程闭环”上回答", "这里不是主讲页，是老师问到时翻出来支撑。");
    card(ctx, slide, "为什么用 ResNet18？", "参数量相对小，预训练权重容易获得，推理快，适合轻量化原型和普通设备演示。", 70, 215, 350, 130, C.cyan);
    card(ctx, slide, "为什么用 LSTM？", "问题文本较短，LSTM 足够表达基本语义，同时实现简单、训练成本低。", 465, 215, 350, 130, C.blue);
    card(ctx, slide, "为什么 Top-5？", "答案类别多，Top-1 不能完全反映候选排序能力，Top-5 更适合推荐式展示。", 860, 215, 350, 130, C.green);
    card(ctx, slide, "为什么不用临床置信度？", "Softmax 概率受答案空间和训练分布影响，只用于排序参考，不能直接解释为医学置信度。", 70, 390, 350, 130, C.amber);
    card(ctx, slide, "准确率不高怎么办？", "医学 VQA 类别多、长尾明显；本文重点是轻量模型可行性和工程闭环，后续可用注意力和答案归一化提升。", 465, 390, 350, 130, C.coral);
    card(ctx, slide, "系统价值是什么？", "它能把模型训练结果转成可交互原型，适合教学演示和候选答案推荐验证。", 860, 390, 350, 130, C.cyan);
    footer(ctx, slide, n); return slide;
  }
  throw new Error(`Unsupported slide ${n}`);
}
