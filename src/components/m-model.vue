<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-space wrap>
          <el-switch
            v-for="i in items.sw"
            :key="i.name"
            v-model="i.active"
            inline-prompt :active-text="i.name"
            :inactive-text="i.name"/>
        </el-space>
        <el-space>
          <el-input v-model="items.inputItemAdd" :placeholder="tips.input" />
          <el-tooltip effect="dark" placement="top" :content="tips.add" >
            <el-button @click="items.Add(items.inputItemAdd)" type="primary" :icon="Plus" circle />
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.download" >
            <el-button @click="items.FileSave" type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.upload" >
            <el-upload
              class="upload-demo"
              action=""
              :on-error="items.FileLoad"
              accept=".txt">
              <el-button type="primary" :icon="Upload" circle />
            </el-upload>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.output" >
            <el-button @click="items.GetAllTags" type="success" :icon="CopyDocument" circle />
          </el-tooltip>
        </el-space>
      </div>
    </template>
    <el-collapse>
      <el-scrollbar>
        <ModelItem v-for="i in items.children.values()" :key="i.key"
                   :col-name="i.key"
                   :item="i"
                   :sw="items.sw"/>
      </el-scrollbar>
    </el-collapse>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import ModelItem from '@/components/model-item.vue'
import { CopyDocument, Plus, Download, Upload } from '@element-plus/icons-vue'
import { mainStore } from '@/store/main_store'
// todo: tag 翻译 和 提示

const items = mainStore()
//  Tips集合
const tips: IS2S = {
  add: '添加表',
  input: '输入表名',
  output: '复制 tag',
  download: '下载至本地',
  upload: '加载本地数据'
}

// 读取
onMounted(() => {
  const tags: string | null = window.localStorage.getItem('tags')
  if (tags !== null && tags !== '') {
    items.Load(tags)
  }
})
// 保存
watch(items.children, () => {
  window.localStorage.setItem('tags', items.Save())
}, { deep: true })

</script>

<style lang="less">
.el-card {
  .el-card__header {
    box-sizing: border-box;
    .card-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
.el-message {
  position: absolute;
}
.el-upload-list.el-upload-list--text {
  display: none !important;
}

.target {
  box-sizing: border-box;
  border: 1px dashed var(--el-border-color) ;
  width: 90%;
  height: 100vh;
  margin: 10px auto;
  #target {
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>
