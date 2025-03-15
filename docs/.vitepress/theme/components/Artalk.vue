<script setup>
import { onMounted } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  // 测试 HTTP 是否可访问
  fetch('http://xtech-comment.liuqiao.top:8085/api/v2/conf', {
    mode: 'cors' // 允许跨域
  })
    .then(response => response.json())
    .then(data => {
      console.log('Artalk 配置:', data)
      Artalk.init({
        el: '#comments',
        server: 'http://xtech-comment.liuqiao.top:8085/', // HTTP 地址
        site: 'My VitePress Blog',
        pageKey: location.pathname, // 文章唯一 ID
        pageTitle: document.title, // 页面标题
      })
    })
    .catch(error => {
      console.error('Artalk API 访问失败，请检查 CORS 设置:', error)
    })
})
</script>

<template>
  <div id="comments"></div>
</template>
