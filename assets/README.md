# assets · 静态资源

图片、示意图、截图统一放这里，**按所属笔记名建子目录**：

```
assets/
├── 注意力机制-从Seq2Seq到Self-Attention/
│   ├── qkv.png
│   └── softmax-shape.png
└── 2017-NeurIPS-AttentionIsAllYouNeed/
    └── architecture.png
```

## 在笔记里引用

从仓库根目录算起的相对路径取决于笔记所在位置。笔记在子目录里时用 `../assets/...`：

```markdown
![注意力计算流程](../assets/注意力机制-从Seq2Seq到Self-Attention/qkv.png)
```

## 建议

- 用 `png` 而非 `jpg`，示意图和截图里的文字才清晰
- 单张图控制在 300 KB 以内，太大的先压缩（[squoosh.app](https://squoosh.app/)）
- 矢量图用 `svg`，文字不会糊，且能直接 diff
- 文件名用英文小写加连字符，避免空格
