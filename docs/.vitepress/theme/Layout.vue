<script setup>
import DefaultTheme from 'vitepress/theme'
import Artalk from './components/Artalk.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <Artalk /> <!-- ✅ 这里添加 Artalk 组件，自动出现在每篇文章底部 -->
    </template>
  </DefaultTheme.Layout>
</template>
