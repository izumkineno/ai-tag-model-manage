<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-space wrap>
          <el-switch
            v-for="i in sw"
            :key="i.name"
            v-model="i.active"
            inline-prompt :active-text="i.name"
            :inactive-text="i.name"/>
        </el-space>
        <el-space>
          <el-input v-model="input" :placeholder="tips.input" />
          <el-tooltip effect="dark" placement="top" :content="tips.add" >
            <el-button @click="itemAdd(input)" type="primary" :icon="Plus" circle />
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.download" >
            <el-button @click="FileSave" type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.upload" >
<!--            <el-button @click="FileLoad" type="primary" :icon="Upload" circle />-->
            <el-upload
              class="upload-demo"
              action=""
              :on-error="FileLoad"
              accept=".txt">
              <el-button type="primary" :icon="Upload" circle />
            </el-upload>
          </el-tooltip>
          <el-tooltip effect="dark" placement="top" :content="tips.output" >
            <el-button @click="tagsGet" type="success" :icon="CopyDocument" circle />
          </el-tooltip>
        </el-space>
      </div>
    </template>
    <el-collapse>
      <el-scrollbar>
        <ModelItem v-for="i in items.values()" :key="i.key"
                   :col-name="i.key"
                   :item="i"
                   :sw="sw"
                   :draggable="sw.drag.active"
                   @dragenter="Drag($event,  i, items)"
                   @dragleave="Drag($event,  i, items)"
                   @dragstart="Drag($event,  i, items)"
                   @dragend="Drag($event,  i, items)"
                   @itemState="itemState"
                   @itemDelete="itemDelete"
                   @itemChange="itemChange"/>
      </el-scrollbar>
    </el-collapse>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import ModelItem from '@/components/model-item.vue'
import { CopyDocument, Plus, Download, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import FileSaver from 'file-saver'
// todo: tag 翻译 和 提示
//  Tips集合
const tips: IS2S = {
  add: '添加表',
  input: '输入表名',
  output: '复制 tag',
  download: '下载至本地',
  upload: '加载本地数据'
}
//  开关集合
const sw: ISwitch = reactive({
  del: {
    name: '删除',
    active: false
  },
  edit: {
    name: '编辑',
    active: false
  },
  drag: {
    name: '拖拽',
    active: false
  },
  weight: {
    name: '权重',
    active: false
  },
  weightNu: {
    name: '数字权重',
    active: false
  },
  mode: {
    name: '组输出模式',
    active: false
  }
})

const items: TItem = reactive(new Map())
const input = ref('')
const itemAdd = (v: string) => {
  const v1 = v.trim()
  if (v1.length !== 0) {
    const v2 = v1 + (Math.random() * 1000).toFixed(0).toString()
    const t: IItem = {
      key: v2,
      name: v1,
      editing: false,
      active: true,
      children: new Map()
    }
    items.set(v2, t)
    input.value = ''
  }
}
const itemState = (v: TBaseMapKey) => {
  const cu = items.get(v)
  cu!.active = !cu!.active
}
const itemDelete = (v: TBaseMapKey) => {
  items.delete(v)
}
const itemChange = (v: [TBaseMapKey, IItem]) => {
  // console.log(v)
  if (items.has(v[0])) {
    items.set(v[0], v[1])
  }
}

let Drag: (e: DragEvent, i: IItem, parents: TItem) => void
{
  let key = ''
  let lastKey = ''
  Drag = (e: DragEvent, i: IItem, parents: TItem) => {
    console.log(e.type, e, i.key)
    const TagDrag = () => {
      console.log(key, lastKey)
      const t1 = parents.get(key)
      const t2 = parents.get(lastKey)
      parents.set(key, t2)
      parents.set(lastKey, t1)
    }
    switch (e.type) {
      case 'dragstart':
        key = i.key
        lastKey = ''
        break
      case 'dragenter':
        break
      case 'dragleave':
        lastKey = i.key
        break
      case 'dragend':
        TagDrag()
        break
    }
  }
}

let tagsGet: () => void
{
  // 输出tag集合
  const tags: string[] = []
  // 粘贴板
  const { toClipboard } = useClipboard()
  // 扫描所有启用的tag
  tagsGet = () => {
    // 大列表
    items.forEach(v2 => {
      if (v2.active && v2.children.size > 0) {
        // tag 组
        const t2: string[] = []
        v2.children.forEach(v1 => {
          if (v1.active && v1.children.size > 0) {
            // console.log(v.tags)
            // tag
            const t1: string[] = []
            v1.children.forEach(v => {
              if (v.active) {
                // console.log(v)
                tagDispose(v, t1)
              }
            })
            if (v1.wordMode) {
              tagAll(v1, t2, t1.join(' '))
            } else {
              tagAll(v1, t2, t1.join())
            }
          }
        })
        tagAll(v2, tags, t2.join())
      }
    })
    // console.log(tags.toString())
    toClipboard(tags.join())
    ElMessage({
      message: `复制成功：\n${tags.toString()}`,
      type: 'success'
    })
    tags.length = 0
  }
  const add = ['(', ')']
  const sub = ['{', '}']
  // 扫描后的处理函数
  const tagDispose = (v: IBase, t: string[]) => {
    let name
    if (typeof v.weight !== 'undefined' && v.weight !== 0) {
      const s = v.weight > 0 ? add : sub
      name = v.name.padStart(v.name.length + Math.abs(v.weight), s[0])
      name = name.padEnd(v.name.length + Math.abs(v.weight) * 2, s[1])
    } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0) {
      name = `(${v.name}:${v.weightNu})`
    } else {
      name = v.name
    }
    t.push(name)
  }
  const tagAll = (v: IBase, t: string[], name: string) => {
    if (typeof v.weight !== 'undefined' && v.weight !== 0) {
      const s = v.weight > 0 ? add : sub
      name = name.padStart(name.length + Math.abs(v.weight), s[0])
      name = name.padEnd(name.length + Math.abs(v.weight), s[1])
    } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0) {
      name = `(${name}:${v.weightNu})`
    }
    t.push(name)
  }
}
// 保存和读取
let Load: (tags: string | null) => void
let Save: () => string
{
  // 保存
  Save = () => {
    const t: ISaveItem[] = []
    const template = (v: ISaveBase | ISaveTagGroup | ISaveItem,
                      v2?: ISaveBase[] | ISaveTagGroup[]) => {
      const temp: ISaveBase | ISaveTagGroup | ISaveItem = {
        key: v.key,
        name: v.name,
        active: v.active
        // weight: v.weight,
        // weightNu: v.weightNu
      }
      // 检查权重
      if (typeof v.weight === 'undefined') {
        temp.weightNu = v.weightNu
      } else {
        v.weight.toString() === '0' ? temp.weightNu = v.weightNu : temp.weight = v.weight
      }
      // 作为tagGroup检查属性
      const tempG = temp as ISaveTagGroup
      const vG = v as ISaveTagGroup
      const v2G = v2 as ISaveBase[]
      if (typeof v2G !== 'undefined') {
        tempG.children = v2G
      }
      if (typeof vG.wordMode !== 'undefined') {
        tempG.wordMode = vG.wordMode
      }
      // 作为tagItem检查属性
      const tempI = temp as ISaveItem
      const v2I = v2 as ISaveTagGroup[]
      if (typeof v2I !== 'undefined') {
        tempI.children = v2I
      }
      return temp
    }
    items.forEach(v3 => {
      const t1: ISaveTagGroup[] = []
      v3.children.forEach(v2 => {
        const t2: ISaveBase[] = []
        v2.children.forEach(v => {
          t2.push(template(v))
        })
        t1.push(template(v2, t2))
      })
      t.push(template(v3, t1))
    })
    return JSON.stringify(t)
  }
  watch(items, () => {
    window.localStorage.setItem('tags', Save())
  }, { deep: true })
  // 读取
  const tags: string | null = window.localStorage.getItem('tags')
  Load = (tags: string | null) => {
    const template = (v: ISaveBase | ISaveTagGroup | ISaveItem,
                      mode: 'tag' | 'group' | 'item') => {
      const temp: IBase | ITagGroup | IItem = {
        key: v.key,
        name: v.name,
        editing: false,
        active: v.active,
        weight: v.weight,
        weightNu: v.weightNu
      }
      const input = {
        inputVisible: false,
        inputValue: ''
      }
      const tG = temp as ITagGroup
      const vG = v as ITagGroup
      const tI = temp as IItem
      switch (mode) {
        case 'group':
          tG.children = new Map()
          tG.newTag = input
          tG.GroupEdit = input
          tG.wordMode = vG.wordMode
          break
        case 'item':
          tI.children = new Map()
      }
      return temp
    }
    try {
      const tagsJSON = JSON.parse((tags as string))
      tagsJSON.forEach((v2: ISaveItem) => {
        const item: IItem = template(v2, 'item')
        if (v2.children !== undefined) {
          v2.children.forEach((v1: ISaveTagGroup) => {
            const tagGroup: ITagGroup = template(v1, 'group')
            if (typeof v1.children !== 'undefined') {
              v1.children.forEach((v: ISaveBase) => {
                tagGroup.children.set(v.key, template(v, 'tag'))
              })
            }
            item.children.set(tagGroup.key, tagGroup)
          })
        }
        items.set(item.key, item)
      })
      // console.log(tagsJSON)
      ElMessage({
        message: '读取数据成功',
        type: 'success'
      })
    } catch (e) {
      console.log(tags, e)
      ElMessage({
        message: `读取数据失败：\n${e}`,
        type: 'error'
      })
    }
  }
  onMounted(() => Load(tags))
}
// 导入和导出
const FileSave = () => {
  const blob = new Blob([Save()], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, 'tags.txt')
}
const FileLoad = (res: unknown, file: { raw: Blob; }) => {
  const reader = new FileReader()
  reader.readAsText(file.raw, 'UTF-8')
  reader.onload = (e: ProgressEvent) => {
    const v = e.target!.result
    const res = v.split('\r\n')
    console.log(res)
    Load(res)
  }
}
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
