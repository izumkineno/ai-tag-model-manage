<template>
  <el-affix :offset="400" position="top">
    <el-icon @click="drawerSW = true" size="large"><ArrowLeft /></el-icon>
  </el-affix>
  <div class="frame-tools">
    <model />
  </div>
  <el-drawer
    v-model="drawerSW"
    :title="drawer.title"
    :direction="drawer.direction">
    <tools class="tool" />
  </el-drawer>
</template>

<script setup lang="ts">
import Model from '@/components/m-model.vue'
import Tools from '@/components/m-tools.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref } from 'vue'

const drawerSW = ref(false)
const drawer = {
  title: '模板管理',
  direction: 'rtl'
}

</script>

<style lang="less">
html {
  --header-heigh: 0px;
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
  height: 100vh;
}
.el-affix {
  height: 0;
}
.el-affix--fixed {
  display: flex;
  justify-content: right;
  right: 0;
}
.frame-tools {
  box-sizing: border-box;
  margin: 0 20px;
  padding: 20px 0;
  height: 100%;
}
.el-drawer__header {
  margin-bottom: 0 !important;
}
.tool {
  height: 100%;
}

.frame-tools > .el-card {
  box-sizing: border-box;
}
</style>
