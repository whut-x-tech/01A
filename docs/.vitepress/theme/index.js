import DefaultTheme from 'vitepress/theme'
import Artalk from './components/Artalk.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Artalk', Artalk) // ✅ 让 Markdown 里可以用 <Artalk />
  }
}
