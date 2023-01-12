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
import { CopyDocument, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

//  Tips集合
const tips: IS2S = {
  add: '添加表',
  input: '输入表名',
  output: '复制 tag'
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
  }
})

const items: TItem = reactive(new Map())
const input = ref('')
const itemAdd = (v: string) => {
  const v1 = v.trim()
  if (v1.length !== 0) {
    const v2 = v1 + (Math.random() * 100).toString()
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
      if (v2.active) {
        // tag 组
        const t2: string[] = []
        v2.children.forEach(v1 => {
          if (v1.active) {
            // console.log(v.tags)
            // tag
            const t1: string[] = []
            v1.children.forEach(v => {
              if (v.active) {
                // console.log(v)
                tagDispose(v, t1)
              }
            })
            tagAll(v1, t2, t1.toString())
          }
        })
        tagAll(v2, tags, t2.toString())
      }
    })
    // console.log(tags.toString())
    toClipboard(tags.toString())
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
{
  // 保存
  const Save = () => {
    const t: ISaveItem[] = []
    const template = (v: IBase) => {
      return {
        key: v.key,
        name: v.name,
        active: v.active,
        weight: v.weight,
        weightNu: v.weightNu
      }
    }
    items.forEach(v3 => {
      const t1: ISaveTagGroup[] = []
      v3.children.forEach(v2 => {
        const t2: ISaveBase[] = []
        v2.children.forEach(v => {
          t2.push(template(v))
        })
          t1.push({
            key: v2.key,
            name: v2.name,
            active: v2.active,
            weight: v2.weight,
            weightNu: v2.weightNu,
            children: t2
        })
      })
      t.push({
        key: v3.key,
        name: v3.name,
        active: v3.active,
        weight: v3.weight,
        weightNu: v3.weightNu,
        children: t1
      })
    })
    window.localStorage.setItem('tags', JSON.stringify(t))
  }
  watch(items, () => Save(), { deep: true })
  // 读取
  const Load = () => {
    const tags: string | null = window.localStorage.getItem('tags')
    try {
      const tagsJSON = JSON.parse((tags as string))
      tagsJSON.forEach((v2: ISaveItem) => {
        const item: IItem = {
          key: v2.key,
          name: v2.name,
          editing: false,
          active: v2.active,
          weight: v2.weight,
          weightNu: v2.weightNu,
          children: new Map()
        }
        v2.children.forEach((v1: ISaveTagGroup) => {
          const tagGroup: ITagGroup = {
            key: v1.key,
            name: v1.name,
            editing: false,
            active: v1.active,
            weight: v1.weight,
            weightNu: v1.weightNu,
            children: new Map(),
            newTag: {
              inputVisible: false,
              inputValue: ''
            },
            GroupEdit: {
              inputVisible: false,
              inputValue: ''
            }
          }
          v1.children.forEach((v: ISaveBase) => {
            const tag: IBase = {
              key: v.key,
              name: v.name,
              editing: false,
              active: v.active,
              weight: v.weight,
              weightNu: v.weightNu
            }
            tagGroup.children.set(v.key, tag)
          })
          item.children.set(tagGroup.key, tagGroup)
        })
        items.set(item.key, item)
      })
      // console.log(tagsJSON)
    } catch (e) {
      console.log(tags, e)
    }
  }
  onMounted(() => Load())
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
</style>
