<template>
  <div class="top">
    <h1 class="title">炼丹炉</h1>
    <h2 class="title">AI绘画tag模板管理器</h2>
    <span class="">By izum</span>
  </div>
  <div class="frame-tools">
    <model />
    <tools />
  </div>
</template>

<script setup>
import model from '@/components/m-model.vue'
import tools from '@/components/m-tools.vue'
import { onMounted } from 'vue'
onMounted(() => {
  document.title = '炼丹炉'
})
</script>

<style lang="less">
html {
  --header-heigh: 200px;
  --header-heigh-bck: 200px;
  --header-opacity: 1;
}

:root {
  --min-width: 800px;
  --min-heigh: 600px;

  --title-font-size: 2.6em;
  --title-sec-font-size: 1.5em;
  --title-pd-top: 25px;
  --title-pd: 15px;

  --body-margin-tb: 30px;
  --body-margin-lr: 10vw;
  --body-right-width: 300px;
  --body-item-gap: 20px;
  --body-item-pd: 10px;

  --card-body-item-heigh: 50px;
}

* {
  margin: 0;
  padding: 0;
  transition: all .3s;
}

#app {
  width: 100vw;
  height: 100vh;
  min-width: var(--min-width);
  min-height: var(--min-heigh);
}

.top {
  box-sizing: border-box;
  text-align: center;
  height: var(--header-heigh);
  opacity: var(--header-opacity);

  .title {
    box-sizing: border-box;
    font-size: var(--title-font-size);
    padding-top: var(--title-pd-top);
  }

  h2[class=title] {
    font-size: var(--title-sec-font-size);
    padding: var(--title-pd) 0;
  }
}

.frame-tools {
  margin: var(--body-margin-tb) var(--body-margin-lr);
  height: calc(100% - var(--header-heigh) - var(--body-margin-tb)*2);
  display: grid;
  grid-template-columns: 1fr var(--body-right-width);
  grid-gap: var(--body-item-gap);
}

.frame-tools > .el-card {
  box-sizing: border-box;

  position: relative;
}
</style>
