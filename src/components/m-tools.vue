<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-row>
          <el-tooltip effect="dark" :content="btnTips.open" placement="top">
            <el-button type="primary" circle>
              <svg t="1672897028804" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5658" width="16" height="16">
                <path
                  d="M330.5 474.3c-7.6-17.8-28.1-26.1-45.9-18.5-17.8 7.6-26.1 28.1-18.5 45.9l90.6 213.2c5.7 13.3 18.6 21.3 32.2 21.3 4.6 0 9.2-0.9 13.7-2.8l229.5-97.5c17.8-7.6 26.1-28.1 18.5-45.9-7.6-17.8-28.1-26.1-45.9-18.5l-152.3 64.7C517.1 480 669.7 251.5 921.5 178.4c18.6-5.4 29.2-24.8 23.9-43.4-5.4-18.6-24.8-29.2-43.4-23.9-71.8 20.8-140.5 54.2-204.2 99.1C641.6 249.8 589 298.5 541.6 355c-63.1 75-117.3 165-153.9 254l-57.2-134.7z"
                  fill="#ffffff" p-id="5659"></path>
                <path
                  d="M925.8 530.8c-19.3 0-35 15.7-35 35v278.4H133.2V287.4h269c19.3 0 35-15.7 35-35s-15.7-35-35-35h-304c-19.3 0-35 15.7-35 35v626.8c0 19.3 15.7 35 35 35h827.5c19.3 0 35-15.7 35-35V565.8c0.1-19.3-15.6-35-34.9-35z"
                  fill="#ffffff" p-id="5660"></path>
              </svg>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="btnTips.save" placement="top">
            <el-button type="success" circle>
              <svg t="1672881738985" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2859" data-spm-anchor-id="a313x.7781069.0.i3" width="16"
                height="16">
                <path
                  d="M814.805 128a51.179 51.179 0 0 1 51.179 51.179V844.01a51.179 51.179 0 0 1-51.179 51.157H201.173a51.179 51.179 0 0 1-51.178-51.157V179.179A51.179 51.179 0 0 1 201.173 128h613.654zM329.024 434.837a51.093 51.093 0 0 1-51.179-51.093V179.157h-76.672v664.854h613.76V179.179H738.22v204.48a51.179 51.179 0 0 1-51.179 51.178H329.024z m0-51.093h357.995V179.157H329.024v204.587z m357.91 204.501a25.557 25.557 0 1 1 0.085 51.072H329.024a25.536 25.536 0 1 1 0-51.072h357.91z"
                  fill="#fff" p-id="2860" data-spm-anchor-id="a313x.7781069.0.i2" class="selected">
                </path>
              </svg>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :content="btnTips.del" placement="top">
            <el-button type="danger" :icon="Delete" circle />
          </el-tooltip>
          <el-tooltip effect="dark" :content="btnTips.setting" placement="top">
            <el-button type="info" :icon="Setting" circle />
          </el-tooltip>
          <el-switch v-model="header" inline-prompt active-text="标题栏" inactive-text="标题栏"/>
        </el-row>
      </div>
    </template>
    <span style="color: var(--el-color-info-light-3)">开发中...</span>
  </el-card>
</template>

<script setup lang="ts">
import { Setting, Delete } from '@element-plus/icons-vue'
import { watch, ref } from 'vue'

const btnTips = {
  open: '打开模板',
  save: '保存模板',
  del: '删除模板',
  setting: '设置'
}

const header = ref(true)
watch(header, (n) => {
  const h = document.documentElement.style.getPropertyValue('--header-heigh-bck')
  const headerStyle = n ? { heigh: h, opacity: '1' } : { heigh: '0px', opacity: '0' }
  document.documentElement.style.setProperty('--header-heigh', headerStyle.heigh)
  document.documentElement.style.setProperty('--header-opacity', headerStyle.opacity)
})

</script>

<style lang="less">
.card-header {
  .el-row {
    .el-switch {
      margin-left: 10px;
    }
  }
}
</style>
