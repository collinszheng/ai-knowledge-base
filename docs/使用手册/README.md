# 使用手册

> **一句话结论：** 日常只有三个动作 —— **写、提交、等一分钟**。其余内容都是出问题时才需要翻的。
>
> 最后更新：2026-10-13 ｜ 标签：`#使用手册` `#运维`

这份手册讲的是「怎么用这个仓库」，不是「学什么」。学习路线和笔记规范在[仓库根目录的 README](https://github.com/collinszheng/ai-knowledge-base#readme)。

---

## 速查卡

| 我想…… | 怎么做 |
| --- | --- |
| 写一篇新笔记 | 复制 [`_templates`](https://github.com/collinszheng/ai-knowledge-base/tree/main/_templates) 里的模板 → 丢进 `docs/` 下对应分区 → 写 |
| 改已有笔记 | 站点页脚点「在 GitHub 上编辑此页」，或本地改 |
| 边写边看效果 | `npm run docs:dev` → 打开 `http://localhost:5173/ai-knowledge-base/` |
| 提交并发布 | `git add .` → `git commit -m "docs(大模型): 补充 KV Cache 推导"` → `git push` |
| 确认发布成功 | <https://github.com/collinszheng/ai-knowledge-base/actions> 看到绿色 ✓ |
| 在线阅读 | <https://collinszheng.github.io/ai-knowledge-base/> |
| 提交前查死链 | `npm run docs:build`，把警告看完再推 |
| 本地看构建后的成品 | `npm run docs:build` → `npm run docs:preview` |

---

## 一、写一篇新笔记

1. **选分区。** 不知道放哪就放 [`03-应用`](https://github.com/collinszheng/ai-knowledge-base/tree/main/docs/03-应用)；实在跨领域，再考虑新开分区（见第五节）。
2. **复制模板。** 从 `_templates/` 拿 [`学习笔记模板.md`](https://github.com/collinszheng/ai-knowledge-base/blob/main/_templates/学习笔记模板.md) 或 [`论文笔记模板.md`](https://github.com/collinszheng/ai-knowledge-base/blob/main/_templates/论文笔记模板.md)。模板里已经有「一句话结论」和变更记录表，别从白纸开始。
3. **按规范命名。** 文件名**不带日期前缀**：

   | 类型 | 格式 | 例子 |
   | --- | --- | --- |
   | 概念 | `主题-具体点.md` | `注意力机制-从Seq2Seq到Self-Attention.md` |
   | 论文 | `年份-会议-简称.md` | `2017-NeurIPS-AttentionIsAllYouNeed.md` |
   | 踩坑 | `工具名-问题简述.md` | `PyTorch-CUDA版本不匹配.md` |

   分区内文件名不必再重复分区名（`02-大模型/` 下不要写 `大模型-xxx.md`）。

4. **开头写元信息头**，站点和 GitHub 都会显示：

   ```markdown
   # 标题

   > 一句话结论：这篇笔记要解决什么问题、得出什么结论。
   > 最后更新：2026-10-13 ｜ 标签：`#Transformer` `#Attention`
   ```

**图片**统一放 `docs/assets/<笔记名>/xxx.png`。笔记在 `docs/<分区>/` 下，比图片深一级，所以引用要**往上一级**：

```markdown
![注意力计算流程](../assets/注意力机制-从Seq2Seq到Self-Attention/qkv.png)
```

**公式**直接用 LaTeX，GitHub 原生渲染、站点构建时渲染成 SVG，两边语法一致：

```markdown
行内：$\text{Attention}(Q,K,V)=\text{softmax}(\frac{QK^T}{\sqrt{d_k}})V$

块级：
$$
\text{softmax}(z_i)=\frac{e^{z_i}}{\sum_j e^{z_j}}
$$
```

> **别用 Obsidian 的 `[[双链]]` 语法** —— GitHub 和静态站都不认，会把笔记锁在 Obsidian 里。要互链就用标准 Markdown 相对链接。

---

## 二、三种改法，按场景挑

| 场景 | 用什么 | 代价 |
| --- | --- | --- |
| 手机上、或临时改个错字 | 站点页脚「在 GitHub 上编辑此页」 | 无，改完提交即自动发布 |
| 电脑上正经写 | 任意 Markdown 编辑器打开**你的本地仓库目录**，写完 `git push` | 需要装 git |
| 想边写边看渲染效果 | `npm run docs:dev`，热重载 | 要跑一个本地服务 |

**关于打勾：** 站点上的复选框是**只读的**（静态站点没有后端）。要勾，就在 GitHub 网页编辑源文件、把 `- [ ]` 改成 `- [x]`，或者本地改完提交。GitHub 上会自动显示成进度条。

---

## 三、仓库地图：哪个文件管什么

```text
ai-knowledge-base/
├── README.md                  ← 仓库门面：学习路线 + 笔记规范 + 提交规范
├── LICENSE                    ← CC BY 4.0 全文
├── _templates/                ← 笔记模板（不在站点里，避免被渲染成占位页）
├── .github/workflows/deploy.yml  ← 发布流水线，一般不用动
├── package.json / package-lock.json
└── docs/                      ← ★ 站点根目录 = 笔记正文
    ├── index.md               ← 站点首页（分区导航 + 学习路线）
    ├── 01-基础/ … 06-AI辅助工程/  ← 各分区，README.md 是分区概览
    ├── assets/                ← 图片；不会被当成分区
    ├── public/favicon.svg     ← 站点图标
    └── .vitepress/
        ├── config.mts         ← 站点配置：标题、导航、搜索、公式、界面文案
        ├── sections.ts        ← 按目录结构自动生成导航与侧边栏
        ├── task-list.mts      ← 让 `- [ ]` 渲染成真复选框（markdown-it 默认不认）
        └── theme/custom.css   ← 排版微调（中文行高、公式横向滚动等）
```

---

## 四、发布链路：`git push` 之后发生了什么

1. GitHub 收到 `main` 上的新提交
2. 触发工作流 [Deploy site to GitHub Pages](https://github.com/collinszheng/ai-knowledge-base/actions/workflows/deploy.yml)
   - **build**：Ubuntu + Node 22 → `npm ci` → `npm run docs:build` → 上传产物
   - **deploy**：把产物推到 GitHub Pages
3. 一分钟左右，<https://collinszheng.github.io/ai-knowledge-base/> 更新

工作流配置里有几点是刻意的，改之前先知道：

- `fetch-depth: 0` —— 让 VitePress 能读每个文件的 **git 提交时间**，页脚的「最后更新于」就是这个
- `concurrency: pages, cancel-in-progress: false` —— 连续推送时**排队**而不是打断正在进行的发布
- 权限只要 `contents: read` + `pages: write` + `id-token: write`，不多给

**手动重跑：** Actions 页面 → 选这个工作流 → `Run workflow`。改了笔记但没改代码时，这是最快的重发方式。

**回滚：** `git revert <那个提交的 sha>` 然后 push。不要用 `git reset --hard` 强推，历史会乱。

---

## 五、导航和侧边栏为什么不用手动维护

[`sections.ts`](https://github.com/collinszheng/ai-knowledge-base/blob/main/docs/.vitepress/sections.ts) 在构建时扫描 `docs/` 目录，按约定自动生成顶部导航和侧边栏。约定只有两条：

- **加一篇笔记** = 丢进对应分区目录，侧边栏文案取文件里的**第一个 `# 一级标题`**
- **加一个分区** = 在 `docs/` 下新建目录，放一个 `README.md` 当概览页；目录名形如 `07-xxx`，前缀数字只用来排序，不会显示出来

另外三条隐含规则：

- `assets/`、`public/` 是保留目录，**不会**变成分区
- `.` 或 `_` 开头的目录被忽略（所以 `_templates` 不在站点里）
- 分区目录里的 `README.md` 会被映射成站点首页（GitHub 只认 `README.md`，VitePress 只认 `index.md`，用 `rewrites` 两边都照顾）

---

## 六、常见问题

**Q：站点上的中文搜索准吗？**
准。VitePress 默认分词会把「注意力机制」当成一个词，搜「注意力」搜不到；配置里覆盖了 `tokenize`，用 `Intl.Segmenter` 按词切分，所以搜词中词也能命中。搜索是**本地全文检索**，不需要联网。

**Q：图片放 `docs/assets/` 会不会被当成一个分区？**
不会，`assets` 和 `public` 在 `sections.ts` 里被排除。

**Q：`04-论文笔记/README.md` 里的模板链接为什么是 GitHub 绝对地址？**
因为 `_templates/` 在站点根目录之外，相对链接在站点里会是死链。凡是引用站点外的文件，就用 GitHub 的绝对 URL。

**Q：改了笔记但站点没变化？**
三个地方按顺序查：① Actions 页面有没有跑、是不是红的；② 浏览器强刷（Ctrl+F5），Pages 有 CDN 缓存；③ `git status` 看是不是压根没 push 上去。

**Q：`npm run docs:build` 报死链，但我确认链接是对的？**
多半是**相对路径写错层级**。笔记在 `docs/<分区>/` 下：引用同分区其他笔记用 `./xxx.md`，引用图片或是别的分区用 `../`。构建时的死链警告会直接告诉你是哪个文件哪一行。

**Q：不小心把大文件（模型权重、数据集）提交了？**
```bash
git rm --cached <文件>
# 加进 .gitignore，然后再提交
```
注意：**历史里已经留下了**，仓库体积不会因此变小。真的很大就要重写历史，代价高 —— 所以提交前一定看清楚 `git status`。

**Q：密钥不小心提交了？**
**轮换密钥，而不是删掉那次提交。** 历史里已经有了，删不干净，而且很可能已经被抓取。轮换完再考虑用 `git filter-repo` 清理历史。

**Q：推送被拒，说 `without 'workflow' scope`？**
只有改 `.github/workflows/` 下的文件才会遇到。本机的授权已经补上了 `workflow` 权限，凭据存在**工作区外**的 gh 配置目录（`$env:GH_CONFIG_DIR` 指向的地方，**在仓库外面，不会被提交**）。要是有一天那个目录被删了，重新授权即可。

---

## 七、出问题时先查这三处

1. **`git status`** —— 改动是不是根本没提交？分支是不是 `main`？
2. **Actions 页面** —— 构建日志里红色的那一步，报错原文通常直接说明问题
3. **`npm run docs:build` 的完整输出** —— 死链、语法错误都会在这里列出来

本地环境方面：`node_modules` 已经装好了，直接 `npm run docs:dev` 就能跑。npm 缓存被我挪到了**工作区外**的 `.npm-cache`（约 190 MB），删掉不影响使用，只是下次装依赖会慢一点。

---

## 八、红线

这几样一旦提交就会永久留在历史里，清理非常麻烦：

- ❌ 模型权重：`*.pt` `*.pth` `*.ckpt` `*.safetensors` `*.gguf` `*.onnx`
- ❌ 数据集：大型 `*.jsonl` `*.parquet` `*.csv`（需要放示例数据时放 `examples/`，`.gitignore` 对它开了白名单）
- ❌ 虚拟环境：`venv/` `.venv/` `__pycache__/`
- ❌ 密钥与凭据：`.env` `*.key` `*.pem` `credentials.json`

`.gitignore` 已经默认排除上述内容，但**别把它当保险** —— 提交前扫一眼 `git status` 比什么都可靠。
