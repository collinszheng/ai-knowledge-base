# 02 · 工具与环境

> 记录「怎么把环境装起来」和「报错怎么解决」。这类知识最容易忘，所以最值得记。

## 内容索引

- [学习清单](./学习清单.md) —— 从环境搭建、框架使用到部署与排错的 6 个模块，逐条可勾选

### 环境配置

- [ ] Python 环境管理：conda / uv / venv 怎么选
- [ ] CUDA / cuDNN / 驱动版本对应关系
- [ ] PyTorch 安装（含 CUDA 版）与验证
- [ ] WSL2 与 Windows 的选择
- [ ] 国内镜像源配置（pip / conda / HF）

### 框架与库

- [ ] Transformers 常用 API 速查
- [ ] 数据集加载与流式处理
- [ ] 训练框架：Trainer / Accelerate / DeepSpeed / LLaMA-Factory
- [ ] 向量库与检索框架
- [ ] 应用框架：LangChain / LlamaIndex

### 部署

- [ ] 本地推理：Ollama / llama.cpp / LM Studio
- [ ] 服务化：vLLM / SGLang / TGI
- [ ] 容器化与显存规划
- [ ] 模型格式转换（HF ↔ GGUF）

### 踩坑记录

_（按 `工具名-问题简述.md` 命名，例如 `PyTorch-CUDA版本不匹配.md`）_

- [ ] 第一条踩坑记录：现象 / 环境 / 根因 / 解法

## 常用命令速查

```bash
# 查看 CUDA 与驱动
nvidia-smi

# 验证 PyTorch 是否用上 GPU
python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.device_count())"
```

## 相关笔记

_（还没有，从 `_templates/学习笔记模板.md` 复制一份开始写）_
