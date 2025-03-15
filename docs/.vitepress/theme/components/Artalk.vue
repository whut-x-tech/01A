<script setup>
import { onMounted } from 'vue'
import Artalk from 'artalk'

onMounted(() => {
  Artalk.init({
    el: '#comments',
    server: 'https://xtech-comment.liuqiao.top', // ✅ 现在是 HTTPS 了
    site: 'My VitePress Blog',
    pageKey: location.pathname,
    pageTitle: document.title,
  })
})
</script>
