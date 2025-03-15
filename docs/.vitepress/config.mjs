import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
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
      logo: '/hero-image.png', // 这里设置为图片的相对路径,
      siteTitle: 'x-tech 🏠',
      // 基础Hero配置
      hero: {
        name: 'My Project',
        text: 'Awesome Documentation',
        tagline: 'Make Documentation Great Again',
        image: {
          src: '/hero-image.png',    // 图片放在public目录
          alt: 'Project Logo',
          width: 200,               // 可选尺寸配置
          position: 'center'        // 位置：left/center/right
        },
        actions: [
          { text: 'Get Started', link: '/guide/getting-started' }
        ]
      },
      
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'hello', link: '/' },
      { text: '☕️ Java', link: '/java' },
      { text: '🗄️ 数据库', link: '/mysql' },
      { text: '🌐 前端', link: '/front' },
      { text: '⚙️ 中间件', link: '/center' },
      { text: '🚀 算法训练', link: '/leetcode' },
    ],

    sidebar: {
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
            { text: '🎨 Mark.js 的使用指南', link: '/front/mark-js' },
            { text: '📄 Mammoth.js 渲染 Word 文档为 HTML：详细教程 🚀', link: '/front/Mammoth-js' },
            { text: '🚀 后端程序员好上手的前端框架——layui', link: '/front/layui-admin' },
          ]
        }
      ],
      '/mysql/':[
        {
          text:'mysql学习',
          items:[
            { text: '🔓📈 MySQL乐观锁终极指南 | 高并发场景下的生存法则与实战陷阱', link: '/mysql/mysql-happy' },
            { text: '📚 MySQL悲观锁深度解析 | 从原理到实战避坑指南', link: '/mysql/mysql-sad' }
          ]
        }
      ],
      '/center/':[
        {
          text:'中间件学习',
          items:[
            { text: 'MongoDB快速上手（包会用）', link: '/center/MongoDB-fast' },
            { text: 'rabbitmq五种模式的实现——springboot', link: '/center/rabbitmq-sb' },
            { text: 'rabbitmq五种模式的总结', link: '/center/rabbitmq-base' },
            { text: '几种用户鉴权的方式对比', link: '/center/auth' },
            { text: 'RBAC 权限控制模型学习', link: '/center/RBAC' },
            { text: 'springSecurity学习笔记', link: '/center/springSecurity1' },
          ]
        }
      ],
      '/leetcode/':[
        {
          text:'算法板子和心得',
          items:[
            { text: '🚩 Java Queue 接口 API 介绍', link: '/leetcode/Java-Queue-API' },
            { text: '🚩 Java Stack 接口 API 介绍', link: '/leetcode/Java-Stack-API' },
            { text: '📝 面试算法通关秘籍：手撕 VS 笔试双线作战指南', link: '/leetcode/algo_mode' },
            { text: '📝 基础算法：快速排序和归并排序', link: '/leetcode/quick_merge' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/9lucifer' }
    ],
    // 启用目录索引
    outline: 'deep', // 或者设置为数字，例如 2
    lastUpdated: true, // 启用最后更新时间
    // 页脚配置
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024-present x-tech'
        }
      }
})
