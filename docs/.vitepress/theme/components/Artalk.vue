<script setup>
import { onMounted, nextTick } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  nextTick(() => { // ✅ 确保 DOM 渲染完成后再初始化 Artalk
    const commentEl = document.querySelector('#comments')
    if (commentEl) {
      Artalk.init({
        el: '#comments',  // 绑定评论区
        server: 'https://xtech-comment.liuqiao.top',  // API 地址
        site: 'My VitePress Blog',
        pageKey: location.pathname,  // 当前页面唯一 ID
        pageTitle: document.title,  // 页面标题
      })
    } else {
      console.error('❌ Error: #comments element not found!')
    }
  })
})
</script>

<template>
  <div id="comments"></div>
</template>
