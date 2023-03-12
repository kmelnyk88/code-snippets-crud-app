import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

export const md = MarkdownIt({
  html: false,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs rounded-2 p-3"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
      } catch (__) { }
    }

    return '<pre class="hljs rounded-2 p-3"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})
