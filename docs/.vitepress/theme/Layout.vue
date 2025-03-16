<script setup>
import DefaultTheme from 'vitepress/theme';
import Artalk from './components/Artalk.vue';
import { onMounted } from 'vue';

// ✅ 仅在客户端加载 Pagefind
onMounted(() => {
  if (typeof window !== 'undefined') {
    // ✅ 加载 Pagefind 搜索 UI
    const script = document.createElement('script');
    script.src = 'https://pagefind.app/pagefind-ui.js';
    script.defer = true;
    document.head.appendChild(script);

    // ✅ 初始化 Pagefind 搜索
    script.onload = () => {
      new window.PagefindUI({ element: '#search' });
    };
  }
});
</script>

<template>
  <DefaultTheme.Layout>
    <!-- ✅ 在顶部导航栏下方添加搜索框 -->
    <template #layout-top>
      <div id="search" style="margin: 10px auto; text-align: center;"></div>
    </template>

    <!-- ✅ 在每篇文章底部自动插入 Artalk 评论区 -->
    <template #layout-bottom>
      <Artalk />
    </template>
  </DefaultTheme.Layout>
</template>
