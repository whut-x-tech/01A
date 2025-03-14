---
layout: home


hero:
  name: "x-tech 🏠"
  text: "这里是whuter的知识沉淀之地，记录学习历程📚、分享技术实践与开发心得💡。期待与你一起进步，共同探索技术的奥秘！🌟"
  image:
    src: /hero-image.png
    alt: Showcase
  actions:
    - theme: brand
      text: 学习路线
      link: /route
    - theme: alt
      text: 我的简历
      link: http://imgtu.oss-cn-beijing.aliyuncs.com/pdf/2025_03_02/0581a3f7851b4bb2ad58776b14b020a8.pdf

features:
  - title: 团队介绍
    details: |
      &emsp;🚀 团队：武汉理工大学 X-Tech 学生技术团队<br>
      &emsp;🎯 使命：打造专属于Whuter的开源CS成长指南平台<br>
      &emsp;🌟 愿景：打破信息壁垒，助力更多学弟学妹快速成长
  - title: 项目进展
    details: |
      &emsp;💡 目前已初步完成平台搭建并上线试运行<br>
      &emsp;🛠️ 将参加校内相关技术比赛，逐步完善项目<br>
      &emsp;🤝 将与华师木犀团队进行技术交流与合作<br>
  - title: 技术方向
    details: |
      &emsp;💻 Web前端与后端开发、数据库设计与优化<br>
      &emsp;📚 VitePress、Vue3、Node.js、MongoDB 等主流技术栈<br>
      &emsp;🔧 持续开发和迭代校内技术产品，推动校园技术生态建设
---




<style>

/* 调整 hero 图片容器 */
.VPHero .image-container {
  position: relative;
  display: inline-block;
  margin-left: 50px; /* 容器整体右移 */
}
/* 创建光晕伪元素 */
.VPHero .image-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;  /* 光晕尺寸 */
  height: 500px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(100, 149, 237, 0.3) 0%,  /* 柔和的蓝色光晕 */
    rgba(100, 149, 237, 0.15) 50%,
    rgba(100, 149, 237, 0) 70%
  );
  filter: blur(60px);
  z-index: -1;
}

/* 调整图片样式 */
.VPHero img {
  width: 300px;
  height: 300px;
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(100, 149, 237, 0.3); /* 添加辅助光晕 */
}

/* 其他文字调整保持原样 */
.VPHero .text { font-size: 24px; }
.VPHero .name { font-size: 48px; }
.VPHero .tagline { font-size: 18px; }



/* 修改 hero 部分的字号 */
.VPHero .text {
  font-size: 24px; /* 调整为你需要的字号 */
}

.VPHero .name {
  font-size: 48px; /* 调整 hero name 的字号 */
}

.VPHero .tagline {
  font-size: 18px; /* 调整 tagline 的字号 */
}
</style>