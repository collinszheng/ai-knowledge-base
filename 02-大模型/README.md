# 02 · 大模型

> 从 Attention 到 GPT，把「大模型为什么能work」拆开看。

## 内容索引

### 架构

- [ ] 序列建模的演进：RNN → LSTM → Seq2Seq → Attention
- [ ] Self-Attention：QKV 到底在算什么
- [ ] Multi-Head Attention：为什么要多头
- [ ] 位置编码：绝对 / 相对 / RoPE / ALiBi
- [ ] Transformer 完整结构逐层拆解
- [ ] 归一化位置之争：Post-LN vs Pre-LN vs RMSNorm
- [ ] 前馈层与激活：ReLU / GELU / SwiGLU
- [ ] 解码器-only 架构（GPT 系）

### 分词

- [ ] 为什么需要 Tokenizer：字符 / 词 / 子词
- [ ] BPE / WordPiece / Unigram 原理对比
- [ ] 词表大小的影响与中英文差异

### 训练

- [ ] 预训练目标：自回归语言建模
- [ ] 缩放定律（Scaling Laws）
- [ ] 分布式训练：DP / TP / PP / ZeRO
- [ ] 混合精度、梯度累积、梯度检查点
- [ ] 指令微调（SFT）与数据配比
- [ ] 对齐：RLHF、PPO、DPO、GRPO

### 推理与效率

- [ ] 解码策略：贪心 / Beam / Top-k / Top-p / 温度
- [ ] KV Cache：原理、显存占用、优化方向
- [ ] 量化：INT8 / INT4 / GPTQ / AWQ / GGUF
- [ ] 注意力加速：FlashAttention、GQA / MQA
- [ ] 推理框架：vLLM、SGLang、llama.cpp

### 能力与现象

- [ ] 涌现能力是真的吗
- [ ] 上下文学习（ICL）与思维链（CoT）
- [ ] 幻觉的成因与缓解

## 相关笔记

_（还没有，从 `_templates/学习笔记模板.md` 复制一份开始写）_
