<script setup>
import { onMounted } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  Artalk.init({
    el: '#comments',
    server: 'http://117.72.11.152:8085', // Artalk 后端 API 地址
    site: 'My VitePress Blog', // 站点名称
    pageKey: location.pathname, // 文章唯一 ID
    pageTitle: document.title, // 页面标题
  })
})
</script>

<template>
  <div id="comments"></div>
</template>
