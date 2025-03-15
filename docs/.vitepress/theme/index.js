import DefaultTheme from 'vitepress/theme'
import 'https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css'  // ✅ 全局引入 CSS
import Artalk from './components/Artalk.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Artalk', Artalk)
  }
}
