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
const tips: ITips = {
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
  weight: {
    name: '权重',
    active: false
  },
  weightNu: {
    name: '数字权重',
    active: false
  }
})

const items: TItem = reactive(new Map([
  // ['测试', {
  //   key: '测试',
  //   name: '测试',
  //   editing: false,
  //   active: true,
  //   tagGroups: new Map([
  //     ['图片质量相关',
  //       {
  //         key: '图片质量相关',
  //         name: '图片质量相关',
  //         editing: false,
  //         active: true,
  //         tags: new Map([
  //           ['masterpiece',
  //             {
  //               key: 'masterpiece',
  //               name: 'masterpiece',
  //               editing: false,
  //               active: true
  //             }
  //           ],
  //           ['best quality',
  //             {
  //               key: 'best quality',
  //               name: 'best quality',
  //               editing: false,
  //               active: true
  //             }
  //           ]
  //         ]),
  //         newTag: {
  //           inputVisible: false,
  //           inputValue: ''
  //         }
  //       }
  //     ]
  //   ])
  // }]
]))
const input = ref('')
const itemAdd = (v: string) => {
  if (v.trim().length !== 0) {
    const t: IItem = {
      key: v,
      name: v,
      editing: false,
      active: true,
      tagGroups: new Map()
    }
    items.set(v, t)
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
  console.log(v)
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
    Array.from(items.values()).forEach(v2 => {
      if (v2.active) {
        // console.log(Array.from(v2.tableData.values()))
        // tag 组
        const t2: string[] = []
        Array.from(v2.tagGroups.values()).forEach(v1 => {
          if (v1.active) {
            // console.log(v.tags)
            // tag
            const t1: string[] = []
            Array.from(v1.tags.values()).forEach(v => {
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
      console.log('::1')
      const s = v.weight > 0 ? add : sub
      name = v.name.padStart(v.name.length + Math.abs(v.weight), s[0])
      name = name.padEnd(v.name.length + Math.abs(v.weight) * 2, s[1])
    } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0) {
      console.log('::2')
      name = `(${v.name}:${v.weightNu})`
    } else {
      console.log('::3')
      name = v.name
    }
    t.push(name)
  }
  const tagAll = (v: IBase, t: string[], name: string) => {
    if (typeof v.weight !== 'undefined' && v.weight !== 0) {
      const s = v.weight > 0 ? add : sub
      name = name.padStart(name.length + Math.abs(v.weight), s[0])
      name = name.padEnd(name.length + Math.abs(v.weight) * 2 - 1, s[1])
    } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0) {
      name = `(${name}:${v.weightNu})`
    }
    t.push(name)
  }
}
// 存储
{
  // 保存
  const Save = () => {
    const t: ISaveItem[] = []
    Array.from(items.values()).forEach(v3 => {
      const t1: ISaveTagGroup[] = []
      Array.from(v3.tagGroups.values()).forEach(v2 => {
        const t2: ISaveBase[] = []
        Array.from(v2.tags).forEach(v => {
          const v1 = v[1]
          t2.push({
            key: v1.key,
            name: v1.name,
            active: v1.active,
            weight: v1.weight,
            weightNu: v1.weightNu
          })
        })
          t1.push({
            key: v2.key,
            name: v2.name,
            active: v2.active,
            weight: v2.weight,
            weightNu: v2.weightNu,
            tags: t2
        })
      })
      t.push({
        key: v3.key,
        name: v3.name,
        active: v3.active,
        weight: v3.weight,
        weightNu: v3.weightNu,
        tagGroups: t1
      })
    })
    window.localStorage.setItem('tags', JSON.stringify(t))
  }
  watch(items, value => Save(), { deep: true })
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
          tagGroups: new Map()
        }
        v2.tagGroups.forEach((v1: ISaveTagGroup) => {
          const tagGroup: ITagGroup = {
            key: v1.key,
            name: v1.name,
            editing: false,
            active: v1.active,
            weight: v1.weight,
            weightNu: v1.weightNu,
            tags: new Map(),
            newTag: {
              inputVisible: false,
              inputValue: ''
            },
            GroupEdit: {
              inputVisible: false,
              inputValue: ''
            }
          }
          v1.tags.forEach((v: ISaveBase) => {
            const tag: IBase = {
              key: v.key,
              name: v.name,
              editing: false,
              active: v.active,
              weight: v.weight,
              weightNu: v.weightNu
            }
            tagGroup.tags.set(v.key, tag)
          })
          item.tagGroups.set(tagGroup.key, tagGroup)
        })
        items.set(item.key, item)
      })
      console.log(tagsJSON)
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
