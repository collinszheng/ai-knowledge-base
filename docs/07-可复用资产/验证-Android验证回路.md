# 验证-Android 验证回路

> **一句话：** 把「改完代码 → 真的在设备上看到效果」整条链路脚本化，别每次手搓一串 adb 命令 —— 手搓的那串没人复核，错了自己也不知道。

**为什么值得单独一页：** Android 是「编译通过 ≠ 功能是对的」特别严重的地方 —— 异步 UI、手势嵌套、状态残留、混淆后反射失败，全都只在运行时才暴露。没有这条回路，就只能凭代码推断，而推断经常错。

## 来源

[体重日记](../01-AI辅助工程/项目-体重日记.md)。那条链路在它的 `tools/` 下被拆成 5 个脚本（截图 1 个、里程碑验证 2 个、设计稿比对 1 个、约束验证 1 个）。**脚本正文留在项目里**，本页只保留骨架与每步的坑 —— 抄一份到这里就会变成两份会漂移的真相。

## 链路与每步的坑

### ① 构建

- 加 `--console=plain` 让输出可解析（否则有 ANSI 色彩码和进度条覆盖符）
- 判定成败**同时匹配失败模式**：`Select-String -Pattern 'BUILD |^e: |FAILURE'`。这不是洁癖 —— 曾经只用 `Select-String 'Success'` 过滤输出，结果漏掉了 `adb install` 的签名冲突静默失败，白测一轮
- 还要看 `$LASTEXITCODE`：Gradle 有时退出码非 0，而输出里照样出现「BUILD」字样

### ② 起模拟器

- `adb wait-for-device` 只保证**设备连上**，不保证**系统起来了** —— 之后还要轮询 `getprop sys.boot_completed` 直到 `1`
- 轮询必须带 **deadline**，并且检查启动进程是否还活着；否则模拟器崩了，脚本会一直等下去（体重日记那份给的是 8 分钟）

### ③ 装机

- `adb install -r -t`（`-t` 让 debug 包可测试）
- 同样别只匹配 `Success`，把 `Failure` 一起匹配

### ④ 造数 / 进到目标状态

- **先 `am force-stop <包名>`，再 `am start`。** 直接 `am start` 带 extra 的话，intent 会投给已经在跑的实例，`onCreate` 不走第二次，`--ez debugSeed true` 就白传了 —— 你会以为造数成功，其实截的是旧状态
- `pm clear` 与造数是两个用途，分开用

### ⑤ 截图与比对

- `screencap -p /sdcard/_shot.png` 再 `adb pull` 回本地
- **必须真的看图**，不要凭代码推断。元素偏移几像素、弹窗没关干净、空状态少一行 —— 这类问题只有看了才发现

## 三段跨项目通用的写法

**（1）SDK 路径靠探测，不写死。** 写死有两个代价：换台机器脚本就跑不起来；而且会把本机用户名（`C:\Users\<名字>\...`）带进版本库。三级回落够用，下面这段是从体重日记照抄的：

```powershell
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Resolve-AndroidSdk {
    foreach ($p in @($env:ANDROID_SDK_ROOT, $env:ANDROID_HOME)) {
        if ($p -and (Test-Path $p)) { return $p }
    }
    $lp = Join-Path $repo 'local.properties'
    if (Test-Path $lp) {
        $line = Select-String -Path $lp -Pattern '^\s*sdk\.dir\s*=\s*(.+?)\s*$' | Select-Object -First 1
        if ($line) {
            $dir = $line.Matches[0].Groups[1].Value -replace '\\\\', '\'
            if (Test-Path $dir) { return $dir }
        }
    }
    $guess = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
    if (Test-Path $guess) { return $guess }
    throw '找不到 Android SDK：请设置 ANDROID_SDK_ROOT，或在 local.properties 里写 sdk.dir'
}
```

**（2）`$ErrorActionPreference = 'Continue'`。** 不是为了忽略错误，而是因为 `adb` 会把「Activity not started」这类**正常**提示写到 stderr，而 PowerShell 5.1 在 `Stop` 下会把原生程序的 stderr 当成终止错误，整条链路提前中断。代价是**必须自己查退出码**，否则真错误会被一起吞掉。

**（3）造数的正确顺序**（`force-stop` 那句的注释就是这条知识的全部价值）：

```powershell
& $adb -s $device shell am force-stop $pkg 2>&1 | Out-Null
Start-Sleep -Seconds 1
& $adb -s $device shell am start -n "$pkg/.MainActivity" --ez debugSeed true 2>&1 | Out-Null
Start-Sleep -Seconds 3
```

## 顺带一种很划算的验证：用脚本证明一条约束

体重日记承诺「不联网」，但 `INTERNET` 权限可能从依赖的清单里**合并**进来 —— 于是它有个脚本解析**合并后**的 `AndroidManifest.xml`，断言没有这个权限。

这比在 README 里写一句「我们不联网」强得多：约束一旦变成可执行的断言，它就再也不会悄悄失效。

## 边界

- 这套是 **Windows + PowerShell** 的：SDK 探测、`$ErrorActionPreference`、BOM 相关都不适用于 Linux / macOS。adb 那几步（装机、`am start`、`screencap`）跨平台通用。
- **脚本正文不复制到这里**。要改就改项目里那份 —— 本页的价值是「每步为什么这么写」，不是提供第二份可执行文件。

## 相关

- [项目-体重日记](../01-AI辅助工程/项目-体重日记.md) —— 来源项目，脚本正文在它的 `tools/`
- [坑-PowerShell 中文脚本要带 BOM](./坑-PowerShell中文脚本要带BOM.md) —— 上面那些 `.ps1` 的另一个坑
- [学习清单 · 5. 验证与审查](../01-AI辅助工程/学习清单.md) —— 这一页对应的方法论
