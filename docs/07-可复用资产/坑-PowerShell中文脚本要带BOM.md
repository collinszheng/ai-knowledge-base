# 坑-PowerShell 中文脚本要带 BOM

> **一句话：** 写含中文的 `.ps1` 时先加 UTF-8 BOM —— Windows PowerShell 5.1 靠 BOM 判断编码，没有 BOM 就按系统 ANSI 代码页（中文 Windows 上是 GBK）去读，中文字节会吞掉后面的字符。

## 来源

两个项目各撞过一次，而且撞的是同一件事的两面：

- [体重日记](../01-AI辅助工程/项目-体重日记.md)：`tools/*.ps1` 被脚本批量改过之后 BOM 丢了，之后每次运行都报语法错误，**而错误位置和真正的问题点相差几十行**
- 这个知识库仓库：读文件时拿到**假阴性** —— 文件本身干干净净，是读的时候解错了

## 机制

Windows PowerShell 5.1 **不会**在没有 BOM 时猜 UTF-8，而是回落到系统 ANSI 代码页。

一个中文字在 UTF-8 里占 3 个字节。按 GBK 去解释这 3 个字节，会得到 1.5 个字符 —— 于是引号提前闭合、字符串与代码的边界错位，报出来的错落在几十行之外。

读的方向上更隐蔽：文件没问题，是**读**的时候解错了，所以你会去查一个根本不存在的编码问题。

## 怎么用

写的时候显式声明 BOM：

```powershell
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($path, $text, $utf8Bom)
```

改完**立刻**做语法检查，不要等运行（报错位置会误导你）：

```powershell
$tokens = $null; $errors = $null
[System.Management.Automation.Language.Parser]::ParseFile(
    $path, [ref]$tokens, [ref]$errors) | Out-Null
if ($errors.Count) { $errors | ForEach-Object { $_.Message } }
```

读的时候别用 `Get-Content -Raw`：

```powershell
# 对无 BOM 的 UTF-8 文件同样按 GBK 解码 → 中文乱码、grep 出假阴性
$text = [System.IO.File]::ReadAllText($path, (New-Object System.Text.UTF8Encoding($false)))
```

同理，PS 5.1 里 `Set-Content -Encoding` **没有** `utf8NoBOM` 这个取值，而 `>` 重定向写出的是 UTF-16LE —— 要精确控制字节，就只用 `[System.IO.File]::WriteAllText`。

## 边界

- **只在 Windows PowerShell 5.1 需要。** PowerShell 7（`pwsh`）默认按 UTF-8 读，没有这个问题。跨版本共用的脚本，加 BOM 是安全的那个选择。
- **反过来，`.md` / 源码 / 配置不要加 BOM** —— 会给解析器带进去一个 `\ufeff`。BOM 只给「会被 PS 5.1 当脚本或数据读」的文件加。
- 判断一份文件有没有 BOM：看头三个字节是不是 `EF BB BF`。**别用编辑器切编码来修** —— 它们会顺手连换行符一起改掉。

## 相关

- [规则-AGENTS 模板](./规则-AGENTS模板.md) —— 这类「已经踩过、别重复」的条目该怎么写进红线
- [验证-Android 验证回路](./验证-Android验证回路.md) —— 上面那些 `.ps1` 的另一个坑（`$ErrorActionPreference`）
- [项目-体重日记](../01-AI辅助工程/项目-体重日记.md) —— 来源项目
