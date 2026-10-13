/**
 * GitHub 任务列表语法（`- [ ]` / `- [x]`）在 markdown-it 里没有内置支持：
 * 默认会当成普通文本，页面上直接显示成字面量「[ ]」。
 *
 * 这里补一个最小实现——把列表项开头的标记换成禁用的 checkbox，
 * 顺便给 li 和 ul 加上 class 供 CSS 使用。自己写十几行，省掉一个依赖。
 *
 * 只处理「列表项里的第一个段落」以行首标记开头的情况，与 GitHub 的行为一致。
 */

interface Token {
  type: string
  content: string
  children: Token[] | null
  attrJoin: (name: string, value: string) => void
}

interface CoreState {
  tokens: Token[]
  Token: new (type: string, tag: string, nesting: number) => Token
}

interface MarkdownItLike {
  core: {
    ruler: {
      after: (afterName: string, ruleName: string, fn: (state: CoreState) => void) => void
    }
  }
}

const TASK_MARK_RE = /^\[([ xX])\][ \t]+/

/** 从 li 的位置往回找包住它的 ul，给它加 class（同一个 ul 只加一次） */
function markEnclosingList(tokens: Token[], from: number, done: Set<number>): void {
  let depth = 0
  for (let j = from; j >= 0; j--) {
    const type = tokens[j].type
    if (type === 'bullet_list_close') {
      depth++
    } else if (type === 'bullet_list_open') {
      if (depth === 0) {
        if (!done.has(j)) {
          tokens[j].attrJoin('class', 'task-list')
          done.add(j)
        }
        return
      }
      depth--
    }
  }
}

export function taskListPlugin(md: MarkdownItLike): void {
  md.core.ruler.after('inline', 'akb-task-list', (state) => {
    const tokens = state.tokens
    const markedLists = new Set<number>()

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'inline') continue
      // 必须正好是「列表项 → 段落 → 行内」这个结构
      if (tokens[i - 1]?.type !== 'paragraph_open') continue
      if (tokens[i - 2]?.type !== 'list_item_open') continue

      const children = tokens[i].children
      if (!children || children.length === 0) continue

      const first = children[0]
      if (first.type !== 'text') continue

      const matched = TASK_MARK_RE.exec(first.content)
      if (!matched) continue

      first.content = first.content.slice(matched[0].length)
      if (first.content === '') children.shift()

      const checkbox = new state.Token('html_inline', '', 0)
      checkbox.content =
        `<input class="task-list-checkbox" type="checkbox" disabled` +
        (matched[1].toLowerCase() === 'x' ? ' checked' : '') +
        '> '
      children.unshift(checkbox)

      // 缩进后的续行段落不该带标记，只管第一段
      tokens[i - 2].attrJoin('class', 'task-list-item')
      markEnclosingList(tokens, i - 2, markedLists)
    }
  })
}
