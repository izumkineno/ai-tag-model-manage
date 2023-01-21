<template>
    <div class="top">
      <h2 class="title">{{ main.title }}</h2>
      <h3 class="title">{{ main.subhead }}</h3>
      <div>
        <el-link :href="main.tag.url" target="_blank" type="success">{{ main.tag.name }}</el-link>
        <span style="margin-left: 10px">{{ main.linkText }}</span>
      </div>
      <a :href="main.github" class="github-corner" target="_blank" title="Follow me on GitHub" aria-label="Follow me on GitHub">
        <svg width="80" height="80" viewBox="0 0 250 250" style="fill:var(--el-color-primary); color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
        </svg>
      </a>
      <el-row style="display: flex;justify-content: center">
        <el-link style="margin: 5px" v-for="i of links" :key="i.url" type="primary" :href="i.url" target="_blank" >{{ i.name }}</el-link>
      </el-row>
    </div>
    <div class="frame-tools">
      <model />
      <tools />
    </div>
</template>

<script setup lang="ts">
import Model from '@/components/m-model.vue'
import Tools from '@/components/m-tools.vue'
const main = {
  title: '炼金桌',
  subhead: 'AI绘画tag模板管理器',
  linkText: '词典推荐',
  github: 'https://github.com/izumkineno/ai-tag-model-manage',
  tag: {
    name: 'tag串编写指南',
    url: 'https://www.bilibili.com/read/cv19513926'
  }
}
interface IUrl {
  name: string
  url: string
}
const links: IUrl[] = [
  {
    name: 'Black Lily',
    url: 'http://heizicao.gitee.io/novelai/#/book'
  },
  {
    name: 'Danbooru 标签超市',
    url: 'https://tags.novelai.dev/'
  },
  {
    name: '魔导绪论',
    url: 'https://magic-tag.netlify.app/#/'
  },
  {
    name: '《鳖哲法典》',
    url: 'http://tomxlysplay.com.cn/#/'
  },
  {
    name: '魔咒百科词典',
    url: 'https://aitag.top/'
  }
]
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

#toprow {
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

  h3[class=title] {
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
