<script setup>
import { onMounted } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  Artalk.init({
    el: '#comments',
    server: 'https://xtech-comment.liuqiao.top:8085', // ✅ 你的 Artalk API 地址
    site: 'My VitePress Blog', // ✅ 站点名称必须匹配
    pageKey: location.pathname,
    pageTitle: document.title,
  })
})
</script>

<template>
  <div id="comments"></div>
</template>

<!-- ✅ 确保 CSS 正确引入 -->
<link href="https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css" rel="stylesheet">
