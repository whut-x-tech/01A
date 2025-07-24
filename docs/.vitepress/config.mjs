import { defineConfig } from 'vitepress';
import { execSync } from 'child_process';

export default defineConfig({
  base: '/01A/',
  title: "x-tech 🏠",
  description: "null",
  head: [
    // 基础favicon
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // 现代浏览器适配
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' }],
  ],
  
  themeConfig: {
    logo: '/logo.png', 
    siteTitle: 'x-tech 🏠',
    search: {
      provider: 'local', // 启用本地搜索，Pagefind 会自动接管
    },

    // 导航栏
    nav: [
      {
        text:"🛠️后端开发",
        items:[
          {text:"🗄️学习路线",link:"/backend_router"},
          // {text:"🚀速成版",link:"/backend_router/fast"},
          // {text:"⚙️资源汇总",link:"/"},
          {text:"⚙️面经收集", link: "/backend_review" },
        ]
      },
      {
        text: "🌐 前端开发",
        items: [
          { text: "📚 学习路线", link: "/frontend_router" },
          { text:"🔧 优质资源整理",link:"/front/fronted_resources"}
          // { text: "🚀 速成版", link: "/frontend_quick" },
          // { text: "🔧 资源汇总", link: "/frontend_resources" }
        ]
      },
      // {
      //   text: "📲 客户端开发",
      //   items: [
      //     { text: "📚 学习路线", link: "/client_guide" },
      //     { text: "⚡ 速成版", link: "/client_quick" },
      //     { text: "🛠️ 资源汇总", link: "/client_resources" }
      //   ]
      // },
      {
        text: "💻 算法刷题",
        items: [
          { text: "📚 学习路线", link: "/algo_roadmap" },
          // { text: "🔢 经典题目", link: "/classic_problems" },
          // { text: "💡 解题技巧", link: "/problem_solving" }
        ]
      },
      { text: '📝 简历撰写', link: '/resume/', activeMatch: '/resume/' },
      // { 
      //   text: '💬 X-Nexus', 
      //   link: 'https://www.cnblogs.com/', // 必须添加 .html 扩展名
      //   target: '_blank' // 添加新标签页打开（可选）
      // },
      {
        text:'nexTop:打卡榜',link:'http://120.46.27.50:8011/',target: '_blank'
      },{
        text:'学长大厂说',link:'/shixi/'
      }
    ],

    // 侧边栏
    sidebar: {
      '/backend_router/':{
          text:"🗄️学习路线",
          items:[
            { text: '写在前面', link: '/backend_router/info' },
            { text: 'java相关', link: '/backend_router/base' },
            { text: '数据库相关', link: '/backend_router/database' },
            { text: '中间件相关', link: '/backend_router/center' },
            { text: '框架相关', link: '/backend_router/frame' },
          ]
      },
      '/backend_review/':{
        text:"⚙️面经收集",
        items:[
          { text: '作业帮-Java', link: '/backend_review/zyb_0612' }
          // { text: 'Python', link: '/backend_review/python' },
          // { text: 'Go', link: '/backend_review/go' },
        ]
      },
      '/java/': [
        {
          text: '后端学习',
          items: [
            { text: '📌《每天搞懂一道Hard》之数独终结者（LeetCode 37', link: '/java/hard-37' },
            { text: '📌《每天搞懂一个JDK源码》之HashMap解读', link: '/java/jdk-hashmap' },
            { text: '🚀 手写线程池实战：从原理到实现，深入理解线程池工作机制', link: '/java/myThreadPool' },
          ]
        }
      ],
      '/front/': [
        {
          text: '前端学习',
          items: [
            // { text: '🎨 Mark.js 的使用指南', link: '/front/mark-js' },
            { text:"🔧 优质资源整理",link:"/front/fronted_resources"}
          ]
        }
      ],
      '/mysql/': [
        {
          text: 'MySQL 学习',
          items: [
            { text: '🔓📈 MySQL乐观锁终极指南', link: '/mysql/mysql-happy' },
            { text: '📚 MySQL悲观锁深度解析', link: '/mysql/mysql-sad' }
          ]
        }
      ],
      '/center/': [
        {
          text: '中间件学习',
          items: [
            { text: 'MongoDB快速上手（包会用）', link: '/center/MongoDB-fast' },
            { text: 'RabbitMQ 五种模式的实现——SpringBoot', link: '/center/rabbitmq-sb' },
            { text: 'RabbitMQ 五种模式总结', link: '/center/rabbitmq-base' },
            { text: '几种用户鉴权的方式对比', link: '/center/auth' },
            { text: 'RBAC 权限控制模型学习', link: '/center/RBAC' },
            { text: 'SpringSecurity 学习笔记', link: '/center/springSecurity1' },
          ]
        }
      ],
      '/leetcode/': [
        {
          text: '算法板子和心得',
          items: [
            { text: '🚩 Java Queue 接口 API 介绍', link: '/leetcode/Java-Queue-API' },
            { text: '🚩 Java Stack 接口 API 介绍', link: '/leetcode/Java-Stack-API' },
            { text: '📝 面试算法通关秘籍', link: '/leetcode/algo_mode' },
            { text: '📝 基础算法：快速排序和归并排序', link: '/leetcode/quick_merge' },
          ]
        }
      ],
      '/resume/':{
        text:"📝 简历撰写",
        items:[
          { text: '简历怎么写', link: '/resume/info' },
          { text: '示范简历1', link: '/resume/resume1' },
          { text: '示范简历2', link: '/resume/resume2' },
        ]
      },
      '/shixi/':{
        text:"学长大厂说",
        items:[
          { text: '大厂见闻录——后端单测', link: '/shixi/dance' },
        ]
      }

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/whut-x-tech/01A' },
      { icon: 'bilibili', link: 'https://space.bilibili.com/662223993?spm_id_from=333.1007.0.0' } // 🔹 添加 Bilibili 主页
    
    ],
    

    // 启用目录索引
    outline: 'deep', // 或者设置为数字，例如 2
    lastUpdated: true, // 启用最后更新时间

    // 页脚配置
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present x-tech'
    }
  },

  // ✅ 添加 `buildEnd` 钩子，确保构建后自动生成 Pagefind 索引
  buildEnd: () => {
    console.log('📌 构建完成，正在生成 Pagefind 搜索索引...');
    execSync('npx pagefind --site docs/.vitepress/dist', { stdio: 'inherit' });
    console.log('✅ Pagefind 搜索索引生成完成！');
  }
});
