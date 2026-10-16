# AGENTS.md

> **本仓库自己的规则文件**，不是模板。可复用的通用模板见 [`docs/07-可复用资产/规则-AGENTS模板.md`](docs/07-可复用资产/规则-AGENTS模板.md)。

个人 AI 学习文档库：VitePress 站点 + 纯 Markdown 笔记，正文全在 `docs/`，push 到 `main` 自动发布到 GitHub Pages。目标只有一个 —— **用 AI 把软件项目做得更快更好**，所以主线是 [`docs/01-AI辅助工程/`](docs/01-AI辅助工程/)。

这份文件是**给 AI 协作者的红线与索引**，每次会话自动加载。保持精简 —— 日常操作的细节都在 [`docs/使用手册/README.md`](docs/使用手册/README.md)，这里不重复。

## 读之前

| 要做什么 | 先看 |
|---|---|
| 写 / 改 / 发笔记、构建失败、死链排查 | [`docs/使用手册/README.md`](docs/使用手册/README.md) —— 这一套操作全在里面 |
| 改导航、侧边栏、站点配置 | [`docs/.vitepress/sections.ts`](docs/.vitepress/sections.ts) —— 约定写在文件头注释里 |
| 起手一篇新笔记 / 新清单 | [`_templates/`](_templates/) —— 模板在站点外，是故意的 |
| 确认「该学什么、练到什么程度」 | 各分区的 `学习清单.md`，主线是 [`docs/01-AI辅助工程/学习清单.md`](docs/01-AI辅助工程/学习清单.md) |

## 红线

1. **密钥不进版本库。** 推送 token、gh 配置目录里的 `hosts.yml`、`.env` 一律不提交，也不能进提交历史；命令输出里出现 token 必须 mask 成 `***` 再打印。
2. **不改用户的全局 git 配置。** 本机全局的 `http.https://github.com.proxy` 与 `http.sslbackend=openssl` 是用户环境的一部分；需要绕开时只在单条命令上用 `-c` 覆盖。
3. **不提交构建产物。** `node_modules/`、`docs/.vitepress/dist/`、`docs/.vitepress/cache/` 已在 `.gitignore`，不要 `-f` 强推。
4. **不手改构建产物。** `docs/.vitepress/dist/` 是生成的，要改就改 `docs/` 下的源文件。
5. **本机绝对路径不进版本库。** 仓库是公开的：盘符路径、`/Users/...`、`/home/...` 这类只属于某一台机器的路径，正文和提交信息里都不写。要用就换成中性描述（如「工作区外」），需要具体路径的人自己探。

## 工作方式

### 进入任务

**澄清模式。** 用户提出**设计、方案、方向性想法**时（不是「改这一行」这类明确指令）进入此模式：只追问，不执行。
用户说「直接做 / 别问了 / 动手」即刻退出。

- 每轮最多问 3 个，编号列出；每个问题给 2–4 个选项 + 推荐项 + 理由。
- 一次性可查的事实自己查（读文件、查代码、搜文档），只有需要用户拍板的才提问。
- 不接受「看情况」「回头再说」：换一个具体场景重新问，或明确记为未决项。

收尾条件：**未决项清零**——只剩用户明确拍板过的决策、或已写进「未决项」清单的。清不了零就继续追问，别自己消解。

要写入时：先复述将写什么、写到哪个路径，拿到明确授权再动手。此模式下默认不写文件；仅说「记一下」不算授权。

讨论结束时先输出结构化摘要（背景与目标 / 已确定决策 / 未决项 / 风险 / 下一步），确认路径与格式后再落盘。

**给计划。** 多步任务动手前先列步骤，每步带验证方式：

```
1. [做什么] → 验证：[怎么确认]
```

能自己验证的小事不要停下来问；但有歧义、要动红线或架构的，先摆选项再动手。

### 改动中

- **先摆假设，再动手。** 有多种理解就把选项说出来，不要静默挑一个；发现更简单的做法直接讲，不要顺着往下写。
- **手术式改动**：不重构没坏的东西，风格跟现有代码走，**每一行改动都要能直接追溯到本次需求**。不顺手「改进」相邻代码、注释和格式；不加没人要的功能，不为一次性代码造抽象，不上没要求的「可配置」。
- **发现无关的死代码，说出来，别删。** 只清理**你自己这次改动**造成的孤儿（不再被引用的 import / 变量 / 函数）。

### 收尾

**逐条对着需求原文核验**（不靠「感觉做完了」），且验证回路完整跑过一遍，才算完成。提交信息写清楚**为什么改**以及**怎么验证的**。

## 约定

**默认这样，不这样做要说原因。**

- **正文进 `docs/<分区>/`，模板留 `_templates/`。** 模板放在站点根之外是刻意的：模板正文里的 `<尖括号>` 占位符会被 Vue 编译吃掉，放进去就没法原样复制。
- **分区 = `docs/` 下的目录。** 目录名既是排序键又是导航显示名（`sections.ts:53` 去掉 `^\d+-`），所以**改编号就是改导航顺序** —— 那是刻意的排序杠杆。
- **丢一个 `.md` 进分区目录就会自动进侧边栏**，不用改任何配置；侧边栏文案取该文件的一级标题（`sections.ts:46`）。
- **分区里的 `README.md` 是给 GitHub 看的，站点首页是 `index.md`**，靠 `rewrites` 映射（`sections.ts:65`），两边的链接都要能点通。
- **图片放 `docs/assets/<笔记名>/`，笔记里用 `../assets/...` 引用** —— 笔记在 `docs/<分区>/` 下，比 `assets/` 少一层。
- **禁用 `[[双链]]`** —— GitHub 和站点都不认。
- **文件名不带日期前缀、不重复分类名**；论文用 `年份-会议-简称.md`。
- **每篇笔记带元信息头**：`最后更新：YYYY-MM-DD`。
- 提交信息用 Conventional Commits（`docs` / `fix` / `refactor` / `chore` / `feat`），**写中文**。

## 构建与验证

```bash
npm run docs:dev      # 本地预览，热重载
npm run docs:build    # 构建到 docs/.vitepress/dist
npm run docs:preview  # 预览构建产物
```

**`npm run docs:build` 必须提权运行。** 沙箱下 esbuild 要起子进程、走管道 stdio，会被直接拒（`spawn EPERM`），重试时用 `danger-full-access` 即可，构建本身只要 2–8 秒。

**验证回路**（只看「构建成功」不够，要真的看产物）：

1. 构建输出**零 `Found dead link`** —— 有死链构建会直接失败
2. `docs/.vitepress/dist/` 里每个分区目录：`index.html` 在、`README.html` 不在（确认 rewrites 生效）
3. 清单类页面数一下 `type="checkbox"`，与源文件里的 `- [ ]` 条数对得上，且残留的字面量 `[ ]` 为 0
4. 推送后 `web_fetch` 一次线上页面，确认 Pages 已经换新

**读文件用 `[System.IO.File]::ReadAllText($p, [System.Text.UTF8Encoding]::new($false))`。** 本机 pwsh 是 Windows PowerShell 5.1，`Get-Content -Raw` 会把无 BOM 的 UTF-8 按 GBK 解码，中文出现假阴性 —— 别据此判断文件损坏。

## 这台机器的操作备忘

- **推送**：走 token URL（`https://x-access-token:<tok>@github.com/...`），`<tok>` 从 gh 配置目录（`$env:GH_CONFIG_DIR` 指向的地方）里的 `hosts.yml` 或 `gh auth token` 取，输出里必须 mask。本机代理 `127.0.0.1:7897` 得是活的，否则直连也不通。
- **只在推送输出匹配 `main -> main` 且不含 `rejected` 时**，才 `git update-ref refs/remotes/origin/main <sha>` —— URL 推送不会自动建 tracking ref，无条件更新会让 `git status` 谎报「已同步」。
- **中文提交信息**写进 `.git/AKB_COMMIT_MSG.txt` 再 `git commit -F`，用完删掉（PS 5.1 的 `>` 重定向会写成 UTF-16LE）。
- **`gh run list` 要先 `Set-Location` 进仓库**；`gh api ... --jq '带 空格'` 会被拆参数，改用 `--json` + `ConvertFrom-Json`。
- 推送时 stderr 常出现 `sh.exe: *** fatal error - couldn't create signal pipe, Win32 error 5`，是沙箱噪音，看 `To https://...` 行判断成败。
