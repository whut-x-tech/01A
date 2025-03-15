<link href="https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css" rel="stylesheet">
<script setup>
import { onMounted } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  Artalk.init({
    el: '#comments', // 绑定元素
    server: 'https://xtech-comment.liuqiao.top:8085', // ✅ 你的 Artalk API 地址
    site: 'My VitePress Blog', // ✅ 站点名必须和后端一致
    pageKey: location.pathname, // 文章唯一 ID
    pageTitle: document.title, // 页面标题

    // ✅ 添加表情包支持
    emoticons: 'https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json',

    // ✅ 开启浏览量统计
    visitor: true, 

    // ✅ 开启点赞/投票功能
    vote: true, 
    voteDown: true, 

    // ✅ 开启 IP 属地显示
    ipRegion: true, 
  })
})
</script>

<template>
  <div id="comments"></div>
</template>
