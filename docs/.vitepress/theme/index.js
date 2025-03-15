import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Artalk from './components/Artalk.vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Artalk) // 在每篇文章底部显示评论
    })
  }
}
