# AI Knowledge Base

> 我的 AI 学习文档库 —— 从数学与深度学习基础，到大模型原理，再到 RAG / Agent / 微调等工程落地，以及论文精读笔记。

**写作原则：** 能用自己的话讲清楚，才算真的学会。所以这里的每篇笔记都尽量做到「结论先行 + 推导过程 + 可运行的例子 + 踩坑记录」。

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## 目录导航

| 目录 | 内容 | 状态 |
| --- | --- | --- |
| [01-基础](./01-基础/) | 数学基础（线代 / 概率 / 微积分）、Python、PyTorch、深度学习入门 | 🚧 |
| [02-大模型](./02-大模型/) | Transformer 架构、注意力机制、Tokenizer、预训练 / SFT / RLHF、推理与量化 | 🚧 |
| [03-应用](./03-应用/) | Prompt 工程、RAG、Agent、Function Calling、微调实战、评测 | 🚧 |
| [04-论文笔记](./04-论文笔记/) | 一篇论文一个文件，按时间 / 主题归档 | 🚧 |
| [05-工具与环境](./05-工具与环境/) | 框架选型、环境配置、部署运维、报错与踩坑 | 🚧 |
| [06-AI辅助开发](./06-AI辅助开发/) | 用 AI 写软件的方法论：工具操作、提示词、规则文件、安全合规 | 🚧 |
| [assets](./assets/) | 图片等静态资源，按笔记名建子目录 | — |
| [_templates](./_templates/) | 笔记模板，新建文件时复制 | — |

> 状态图例：🚧 建设中 ｜ ✅ 已成体系 ｜ 💤 暂缓

---

## 建议的学习路线

按这个顺序推进，前面的内容是后面的前置知识：

```text
阶段一 · 地基
  线性代数 → 概率统计 → 微积分与梯度 → Python / NumPy → PyTorch 基础
        ↓
阶段二 · 原理
  神经网络 → 反向传播 → 序列模型(RNN/LSTM) → Attention → Transformer
        ↓
阶段三 · 大模型
  GPT 系架构 → Tokenizer → 预训练目标 → SFT → RLHF / DPO → 推理优化(量化/KV Cache)
        ↓
阶段四 · 工程应用
  Prompt 工程 → Embedding 与向量检索 → RAG → Agent / Function Calling → 评测与可观测性
        ↓
阶段五 · 前沿
  论文精读 → 复现实验 → 自己的小项目
```

> **横向专题：** [AI 辅助开发](./06-AI辅助开发/) —— 不绑定任何阶段，从第一天就可以开始用，越早越好。

---

## 笔记规范

保持一致的格式，以后回看和检索的成本会低很多。

**文件命名**

- 概念类：`主题-具体点.md`，例如 `注意力机制-从Seq2Seq到Self-Attention.md`
- 论文类：`年份-会议-简称.md`，例如 `2017-NeurIPS-AttentionIsAllYouNeed.md`
- 踩坑类：`工具名-问题简述.md`，例如 `PyTorch-CUDA版本不匹配.md`
- 尽量用中文或英文的一致命名，**不要在文件名里加日期前缀**（避免排序混乱，日期写在文件头部的元信息里）

**每篇笔记的开头**

```markdown
# 标题

> 一句话结论：这篇笔记要解决什么问题、得出什么结论。
> 最后更新：2026-01-01 ｜ 标签：`#Transformer` `#Attention`
```

**图片**：统一放 `assets/<笔记名>/xxx.png`，用相对路径引用：

```markdown
![注意力计算流程](./assets/注意力机制-从Seq2Seq到Self-Attention/qkv.png)
```

**公式**：直接用 LaTeX，GitHub 原生渲染：

```markdown
行内：$\text{Attention}(Q,K,V)=\text{softmax}(\frac{QK^T}{\sqrt{d_k}})V$

块级：
$$
\text{softmax}(z_i)=\frac{e^{z_i}}{\sum_j e^{z_j}}
$$
```

**新建笔记**：从 [`_templates`](./_templates/) 复制对应模板，别从零开始写。

---

## 本地使用

```bash
git clone https://github.com/collinszheng/ai-knowledge-base.git
cd ai-knowledge-base
```

日常更新：

```bash
git add .
git commit -m "docs(大模型): 补充 KV Cache 推导"
git push
```

提交信息建议用 `类型(范围): 说明` 的格式，类型沿用 Conventional Commits：

| 类型 | 用途 |
| --- | --- |
| `docs` | 新增 / 修改笔记正文 |
| `fix` | 修正笔记里的错误 |
| `refactor` | 重组目录或拆分长文 |
| `chore` | 仓库配置、模板、gitignore 等 |

---

## 这个仓库不适合放什么

避免仓库体积失控（这些一旦提交，历史里会永久保留，清理非常麻烦）：

- ❌ 模型权重：`*.pt` `*.safetensors` `*.gguf` `*.ckpt`
- ❌ 数据集：大型 `*.jsonl` `*.parquet` `*.csv`（`.gitignore` 已默认排除）
- ❌ 虚拟环境：`venv/` `.venv/` `__pycache__/`
- ❌ 密钥与凭据：`.env` `*.key` `credentials.json`

需要放示例数据时，放在 `examples/` 目录下（`.gitignore` 对它有白名单例外）。

---

## License

文档内容采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可，转载请注明出处。
代码片段采用 [MIT](https://opensource.org/licenses/MIT) 许可，可自由使用。
