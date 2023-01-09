<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-space wrap>
          <el-switch v-model="sw.del.active" inline-prompt :active-text="sw.del.name" :inactive-text="sw.del.name"/>
          <el-switch v-model="sw.edit.active" inline-prompt :active-text="sw.edit.name" :inactive-text="sw.edit.name"/>
          <el-switch v-model="sw.weight.active" inline-prompt :active-text="sw.weight.name" :inactive-text="sw.weight.name"/>
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
    Array.from(items.values()).forEach(value => {
      if (value.active) {
        // console.log(Array.from(value.tableData.values()))
        // tag 组
        Array.from(value.tagGroups.values()).forEach(value1 => {
          if (value1.active) {
            // console.log(v.tags)
            // tag
            Array.from(value1.tags.values()).forEach(v => {
              if (v.active) {
                // console.log(v)
                tagDispose(v)
              }
            })
          }
        })
      }
    })
    // console.log(tags.toString())
    toClipboard(tags.toString())
    ElMessage({
      message: `复制成功：\n[${tags.toString()}]`,
      type: 'success'
    })
    tags.length = 0
  }
  // 扫描后的处理函数
  const tagDispose = (v: IBase) => {
    tags.push(v.name)
  }
}

{
  // 保存
  const Save = () => {
    const t: ISaveItem[] = []
    Array.from(items.values()).forEach(value => {
      const t1: ISaveTagGroup[] = []
      Array.from(value.tagGroups.values()).forEach(value1 => {
        const t2: ISaveBase[] = []
        Array.from(value1.tags).forEach(v => {
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
            key: value.key,
            name: value.name,
            active: value.active,
            weight: value.weight,
            weightNu: value.weightNu,
            tags: t2
        })
      })
      t.push({
        key: value.key,
        name: value.name,
        active: value.active,
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
      tagsJSON.forEach((value: ISaveItem) => {
        const item: IItem = {
          key: value.key,
          name: value.name,
          editing: false,
          active: value.active,
          tagGroups: new Map()
        }
        value.tagGroups.forEach((value1: ISaveTagGroup) => {
          const tagGroup: ITagGroup = {
            key: value1.key,
            name: value1.name,
            editing: false,
            active: value1.active,
            tags: new Map(),
            newTag: {
              inputVisible: false,
              inputValue: ''
            }
          }
          value1.tags.forEach((v: ISaveBase) => {
            const tag: IBase = {
              key: v.key,
              name: v.name,
              editing: false,
              active: v.active
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
