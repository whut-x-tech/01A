import DefaultTheme from 'vitepress/theme';
import Artalk from './components/Artalk.vue';
import { onMounted } from 'vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Artalk', Artalk);

    // ✅ 仅在客户端加载 Artalk CSS，避免 `build` 报错
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css';
      document.head.appendChild(link);
    }
  },
  setup() {
    onMounted(async () => {
      if (typeof window !== 'undefined') {
        // ✅ 加载 Pagefind 搜索 UI
        const script = document.createElement('script');
        script.src = 'https://pagefind.app/pagefind-ui.js';
        script.defer = true;
        document.head.appendChild(script);

        // ✅ 初始化 Pagefind 搜索
        script.onload = () => {
          new window.PagefindUI({ element: '#search' });
        };
      }
    });
  }
};
