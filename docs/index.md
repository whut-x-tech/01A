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
  - title: 个人介绍
    details: |
      &emsp;🏫 学校：武汉理工大学<br>
      &emsp;🎓 年级：大三<br>
      &emsp;💻 专业：计算机科学与技术
  - title: 荣誉和证书
    details: |
      &emsp;🏆 全国大学生数学建模 - 国家级一等奖 (2024)<br>
      &emsp;📜 CET-4、CET-6证书<br>
      &emsp;🥈 校小程序开发比赛二等奖<br>
  - title: 个人经历
    details: |
      &emsp;👨‍💻 海康威视 - 全栈开发实习生 (2024.12 - 2025.03)<br>
      &emsp;&emsp;🛠️ 参与公司对外日志收集系统的设计与开发。<br>
      &emsp;&emsp;📊 参与数据库设计与优化，提升系统查询性能。<br>
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