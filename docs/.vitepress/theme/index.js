import DefaultTheme from 'vitepress/theme';
import { inBrowser } from 'vitepress';
import busuanzi from 'busuanzi.pure.js';
import Artalk from './components/Artalk.vue';
import { onMounted } from 'vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    // 注册 Artalk 组件
    app.component('Artalk', Artalk);

    // ✅ 仅在客户端加载 Artalk CSS，避免 `build` 报错
    if (inBrowser) {
      // Artalk CSS 加载
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css';
      document.head.appendChild(link);
      
      // 添加 busuanzi 统计功能
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
      }
    }
  },
  setup() {
    onMounted(async () => {
      if (inBrowser) {
        // ✅ 加载 Pagefind 搜索 UI
        const script = document.createElement('script');
        script.src = 'https://pagefind.app/pagefind-ui.js';
        script.defer = true;
        document.head.appendChild(script);

        // ✅ 初始化 Pagefind 搜索
        script.onload = () => {
          new window.PagefindUI({ element: '#search' });
        };
        
        // 初始化 busuanzi 统计
        busuanzi.fetch();
      }
    });
  }
};
