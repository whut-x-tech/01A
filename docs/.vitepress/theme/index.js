import DefaultTheme from 'vitepress/theme'
import Artalk from './components/Artalk.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Artalk', Artalk)

    // ✅ 仅在客户端加载 Artalk CSS，避免 `build` 报错
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css'
      document.head.appendChild(link)
    }
  }
}
