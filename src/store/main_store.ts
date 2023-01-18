import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import FileSaver from 'file-saver'
import { computed } from 'vue'
import useClipboard from 'vue-clipboard3'

export const mainStore = defineStore('main', {
  state: (): IDataMain => {
    return {
      children: new Map(),
      inputItemAdd: '',
      sw: {
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
        weightSym: {
          name: '权重 - { } ',
          active: false
        },
        weightNu: {
          name: '数字权重',
          active: false
        },
        drag: {
          name: '拖拽',
          active: false
        },
        mode: {
          name: '组输出模式',
          active: false
        }
      },
      lastSave: [],
      drag: {},
      dragIndex: new Map([
          ['tag', 31],
          ['tagGroup', 27],
          ['item', 18]
      ])
    }
  },
  actions: {
    // 启用 / 关闭
    StateToggle(v: TBaseMapKey) {
      const cu = this.children.get(v)
      cu!.active = !cu!.active
    },
    Add(v: string) {
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
        this.children.set(v2, t)
        this.inputItemAdd = ''
      }
    },
    Delete(v: TBaseMapKey) {
      this.children.delete(v)
    },
    Change(v: [TBaseMapKey, IItem]) {
      if (this.children.has(v[0])) {
        this.children.set(v[0], v[1])
      }
    },
    // 获取所有tag到粘贴板
    GetAllTags() {
      const add = ['(', ')']
      const sub = computed(() => {
        return this.sw.weightSym.active ? ['{', '}'] : ['[', ']']
      })
      // 输出tag集合
      const tags: string[] = []
      // 粘贴板
      const { toClipboard } = useClipboard()
      // 扫描后的处理函数
      const tagDispose = (v: IBase, t: string[]) => {
        let name
        if (typeof v.weight !== 'undefined' && v.weight !== 0) {
          const s = v.weight > 0 ? add : sub.value
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
          const s = v.weight > 0 ? add : sub.value
          name = name.padStart(name.length + Math.abs(v.weight), s[0])
          name = name.padEnd(name.length + Math.abs(v.weight), s[1])
        } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0) {
          name = `(${name}:${v.weightNu})`
        }
        t.push(name)
      }
      // 扫描所有启用的tag
      this.children.forEach(v2 => {
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
      toClipboard(tags.join()).then(() => {
        ElMessage({
          message: `复制成功：\n${tags.toString()}`,
          type: 'success'
        })
        tags.length = 0
      })
    },
    Save(): string {
      this.lastSave = []
      const template = (v: ISaveBase | ISaveTagGroup | ISaveItem,
                        v2?: ISaveBase[] | ISaveTagGroup[]) => {
        const temp: ISaveBase | ISaveTagGroup | IModelSaveItem = {
          key: v.key,
          name: v.name,
          active: v.active
          // weight: v.weight,
          // weightNu: v.weightNu
        }
        // 检查权重
        if (typeof v.weight !== 'undefined' && v.weight !== 0) {
          temp.weight = v.weight
        }
        if (typeof v.weightNu !== 'undefined' && v.weightNu.toString() !== '0') {
          temp.weightNu = v.weightNu
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
        const tempI = temp as IModelSaveItem
        const v2I = v2 as ISaveTagGroup[]
        if (typeof v2I !== 'undefined') {
          tempI.children = v2I
        }
        return temp
      }
      this.children.forEach(v3 => {
        const t1: ISaveTagGroup[] = []
        v3.children.forEach(v2 => {
          const t2: ISaveBase[] = []
          v2.children.forEach(v => {
            t2.push(template(v))
          })
          t1.push(template(v2, t2))
        })
        this.lastSave.push(template(v3, t1))
      })
      return JSON.stringify(this.lastSave)
    },
    Load(tags: string | null) {
      const items = mainStore()
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
        const input: IInput = {
          editing: false,
          inputValue: ''
        }
        const tG = temp as ITagGroup
        const vG = v as ITagGroup
        const tI = temp as IItem
        switch (mode) {
          case 'group':
            tG.children = new Map()
            tG.newTag = JSON.parse(JSON.stringify(input))
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
          const item: IItem | IBase = template(v2, 'item')
          if (v2.children !== undefined) {
            v2.children.forEach((v1: ISaveTagGroup) => {
              const tagGroup: ITagGroup | IBase = template(v1, 'group')
              if (typeof v1.children !== 'undefined') {
                v1.children.forEach((v: ISaveBase) => {
                  (tagGroup as ITagGroup).children.set(v.key, template(v, 'tag'))
                })
              }
              (item as IItem).children.set(tagGroup.key, (tagGroup as ITagGroup))
            })
          }
          items.children.set(item.key, item as IItem)
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
    },
    FileSave() {
      const blob = new Blob([JSON.stringify(this.lastSave)], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, 'tags.txt')
    },
    FileLoad(res: unknown, file: { raw: Blob; }) {
      const reader = new FileReader()
      reader.readAsText(file.raw, 'UTF-8')
      reader.onload = (e: ProgressEvent) => {
        console.log(e)
        const v = (e.target as FileReader).result
        const res = (v as string).split('\r\n')
        console.log(res)
        this.Load(res.toString())
      }
    },
    // 拖拽
    Drag(e: DragEvent, i: IBase, parents: TParent, type: TTagType) {
      console.log(e.type, e, i.key, type)

      const pathIndex = this.dragIndex.get(type)
      const p = e.composedPath()
      const path = p as HTMLSpanElement[]
      // tag 拖拽
      if (typeof pathIndex !== 'undefined') {
        switch (e.type) {
          case 'dragstart':
            this.drag.key = i.key
            this.drag.index = pathIndex
            this.drag.lastKey = ''
            break
          case 'dragenter':
            if (path.length >= pathIndex) {
              const newTagIndex = 31
              console.log(e.type, pathIndex, parents)
              if (i.key !== this.drag.key) {
                if (this.drag.index === pathIndex) {
                  this.drag.lastParent = parents
                  path[path.length - pathIndex].style.background = 'rgba(0,0,0,0.1)'
                } else if (p.length >= newTagIndex) {
                  path[path.length - newTagIndex].style.background = 'rgba(255,89,89,0.5)'
                }
              }
              if (path[path.length - pathIndex] !== this.drag.lastTag && typeof this.drag.lastTag !== 'undefined') {
                this.drag.lastTag.style.background = ''
              }
            }
            break
          case 'dragleave':
            this.drag.lastKey = i.key
            this.drag.lastTag = path[path.length - pathIndex]
            break
          case 'dragend':
            if (typeof this.drag.lastTag !== 'undefined') {
              this.drag.lastTag.style.background = ''
            }
            // console.log(key, lastKey, lastTag)
            this.TagDrag(parents)
            if (pathIndex === this.dragIndex.get('tag')) window.localStorage.setItem('tags', this.Save())
            break
        }
      }
    },
    TagDrag(parents: TParent) {
      // 转换组的key，用于定位和修改
      const sKey = <string> this.drag.key
      const sLastKey = <string> this.drag.lastKey
      const keys = Array.from(parents.children.keys())
      let index = keys.indexOf(sKey)
      // 转换组
      const tag = parents.children.get(sKey)
      // console.log(this.drag.lastParent, parents, this.drag.key, this.drag.lastKey)
      if (typeof tag !== 'undefined') {
        const lp = this.drag.lastParent
        const t = Array.from(parents.children)
        // 在本组内
        if (parents.children.has(sLastKey)) {
          let indexTarget = keys.indexOf(sLastKey)
          // console.log(index, indexTarget)
          index > indexTarget ? index++ : indexTarget++
          t.splice(indexTarget, 0, [tag.key, tag])
          t.splice(index, 1)
          // console.log(tag, t)
          parents.children = new Map(t)
        } else if (typeof lp !== 'undefined' && lp.children.has(sLastKey)) {
          const t2 = Array.from(lp.children)
          const lastKeys = Array.from(lp.children.keys())
          const indexTarget = lastKeys.indexOf(sLastKey)
          t2.splice(indexTarget, 0, [tag.key, tag])
          t.splice(index, 1)
          this.$patch(() => {
            parents.children = new Map(t)
            lp.children = new Map(t2)
          })
        }
      }
    }
  }
})
