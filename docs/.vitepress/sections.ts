/**
 * 从 docs/ 的目录结构自动生成导航与侧边栏。
 *
 * 约定（加东西的时候不用碰这个文件）：
 *   - 新增一个分区 = 在 docs/ 下新建目录，放一个 README.md 当概览页
 *   - 新增一篇笔记 = 丢进对应分区目录
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** docs/ 的绝对路径（本文件位于 docs/.vitepress/ 下） */
const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** 这些目录不是「分区」，不参与导航（assets 存图片，下划线开头的是工具目录） */
const NOT_A_SECTION = new Set(['assets', 'public'])

const isIndexFile = (file: string) => file === 'README.md' || file === 'index.md'

/** 取文件的一级标题当侧边栏文案；取不到就退回文件名 */
function headingOf(dir: string, file: string): string {
  try {
    const md = readFileSync(join(docsRoot, dir, file), 'utf8')
    const matched = /^#\s+(.+?)\s*$/m.exec(md)
    if (matched) return matched[1].replace(/`/g, '')
  } catch {
    /* 读不到就算了，用文件名兜底 */
  }
  return file.replace(/\.md$/, '')
}

export interface Section {
  /** docs/ 下的目录名，如 01-基础 */
  dir: string
  /** 分区显示名，如 基础 */
  text: string
  /** 该分区的页面，概览页排在最前 */
  pages: { text: string; link: string }[]
}

export const sections: Section[] = readdirSync(docsRoot)
  .filter((name) => !name.startsWith('.') && !name.startsWith('_') && !NOT_A_SECTION.has(name))
  .filter((name) => statSync(join(docsRoot, name)).isDirectory())
  .sort()
  .map((dir) => {
    const files = readdirSync(join(docsRoot, dir)).filter((file) => file.endsWith('.md'))
    const ordered = [
      ...files.filter(isIndexFile),
      ...files.filter((file) => !isIndexFile(file)).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')),
    ]
    return {
      dir,
      text: dir.replace(/^\d+-/, ''),
      pages: ordered.map((file) => ({
        text: isIndexFile(file) ? '概览' : headingOf(dir, file),
        link: isIndexFile(file) ? `/${dir}/` : `/${dir}/${file.replace(/\.md$/, '')}`,
      })),
    }
  })

/**
 * 分区目录里的 README.md 是给 GitHub 网页看的（GitHub 只认 README.md），
 * 而 VitePress 只把 index.md 当目录首页 —— 用 rewrites 把前者映射成后者，两边都照顾到。
 */
export const rewrites = Object.fromEntries(
  sections.map((s) => [`${s.dir}/README.md`, `${s.dir}/index.md`]),
)

/** 顶部导航：首页 + 每个分区 */
export const nav = [
  { text: '首页', link: '/' },
  ...sections.map((s) => ({ text: s.text, link: `/${s.dir}/` })),
]

/**
 * 侧边栏按分区切换：进到某个分区只看这个分区的目录，
 * 其余分区的入口收进「其他分区」折叠组，既不丢全局又不刷屏。
 */
export const sidebar = Object.fromEntries([
  ...sections.map((s) => [
    `/${s.dir}/`,
    [
      { text: '全部笔记', link: '/' },
      { text: s.text, items: s.pages },
      {
        text: '其他分区',
        collapsed: true,
        items: sections.filter((o) => o.dir !== s.dir).map((o) => ({ text: o.text, link: `/${o.dir}/` })),
      },
    ],
  ]),
  [
    '/',
    [
      {
        text: '分区总览',
        items: sections.map((s) => ({ text: s.text, link: `/${s.dir}/` })),
      },
    ],
  ],
])
