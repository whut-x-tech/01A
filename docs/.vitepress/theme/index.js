import DefaultTheme from 'vitepress/theme';
import { inBrowser, useData, useRoute } from 'vitepress';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import busuanzi from 'busuanzi.pure.js';
import Artalk from './components/Artalk.vue';
import { onMounted, toRefs } from 'vue';


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
    // 获取前言和路由
    const { frontmatter } = toRefs(useData());
    const route = useRoute();
    
    // 评论组件 - https://giscus.app/
    giscusTalk({
        repo: 'whut-x-tech/01A',
        repoId: 'R_kgDOOIg2Zg',
        category: 'General', // 默认: `General`
        categoryId: '你的分类id',
        mapping: 'pathname', // 默认: `pathname`
        inputPosition: 'top', // 默认: `top`
        lang: 'zh-CN', // 默认: `zh-CN`
        // i18n 国际化设置（注意：该配置会覆盖 lang 设置的默认语言）
        // 配置为一个对象，里面为键值对组：
        // [你的 i18n 配置名称]: [对应 Giscus 中的语言包名称]
        locales: {
            'zh-Hans': 'zh-CN',
            'en-US': 'en'
        },
        homePageShowComment: false, // 首页是否显示评论区，默认为否
        lightTheme: 'light', // 默认: `light`
        darkTheme: 'transparent_dark', // 默认: `transparent_dark`
        // ...
    }, {
        frontmatter, route
    },
        true
    );
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
