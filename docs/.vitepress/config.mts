import { defineConfig } from 'vitepress'
import { nav, rewrites, sidebar } from './sections'

const REPO = 'https://github.com/collinszheng/ai-knowledge-base'

// 项目主页地址是 https://collinszheng.github.io/ai-knowledge-base/，所以站点要挂在子路径下
const BASE = '/ai-knowledge-base/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Knowledge Base',
  description: 'AI 学习文档库：从数学基础到大模型原理，再到 RAG / Agent 工程落地与论文精读笔记',

  base: BASE,

  // 分区目录的 README.md 同时在站点里当 index.md（详见 sections.ts）
  rewrites,

  // 公式用 MathJax 在构建时渲染成 SVG：不加客户端 JS，复制出来的还是 LaTeX 源码
  markdown: {
    math: true,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI Knowledge Base' }],
  ],

  themeConfig: {
    nav,
    sidebar,

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' },
    },
    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '文档内容采用 CC BY 4.0 许可，转载请注明出处',
      copyright: 'Copyright © 2026 collinszheng',
    },
    socialLinks: [{ icon: 'github', link: REPO }],

    // 界面文案汉化（VitePress 默认主题只内置了英文）
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc',
            },
          },
        },
        miniSearch: {
          options: {
            /**
             * 中文、日文没有词间空格，MiniSearch 的默认分词会把「注意力机制」整段当成一个词，
             * 结果搜「注意力」搜不到 —— 这里把连续的无空格 CJK 片段交给 Intl.Segmenter 再切一遍。
             *
             * 注意：这个函数会被序列化后送进浏览器，所以必须自包含，
             * 不能引用本文件或模块作用域里的任何变量（正则、缓存都写在函数体内部）。
             * 实现与 VitePress 2.x 的 searchTextTokenizer 一致。
             */
            tokenize: (text: string): string[] => {
              const SPACE_OR_PUNCTUATION_RE = /[\n\r\p{Z}\p{P}]+/u
              const UNSPACED_RUN_RE =
                /[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+|[^\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]+/gu
              const UNSPACED_START_RE = /^[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]/u

              const terms = text.split(SPACE_OR_PUNCTUATION_RE)

              // Firefox < 125 等旧浏览器没有 Intl.Segmenter，退回按空格/标点切
              const SegmenterCtor = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter
              if (typeof SegmenterCtor !== 'function') return terms

              const cache = globalThis as unknown as { __akbSegmenter?: Intl.Segmenter }
              cache.__akbSegmenter ??= new SegmenterCtor(undefined, { granularity: 'word' })
              const segmenter = cache.__akbSegmenter

              return terms.flatMap((term) => {
                const runs = term.match(UNSPACED_RUN_RE)
                if (!runs) return term
                return runs.flatMap((run) =>
                  UNSPACED_START_RE.test(run)
                    ? Array.from(segmenter.segment(run), (part) => part.segment)
                    : run,
                )
              })
            },
          },
        },
      },
    },
  },
})
