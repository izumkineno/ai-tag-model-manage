<template>
  <el-collapse-item :name="props.colName"
                    :draggable="main.sw.drag.active"
                    @dragenter="main.Drag($event,  item, main, 'item')"
                    @dragleave="main.Drag($event,  item, main, 'item')"
                    @dragstart="main.Drag($event,  item, main, 'item')"
                    @dragend="main.Drag($event,  item, main, 'item')">
    <!--  头  -->
    <template #title>
      <el-space wrap>
<!--     删除确认     -->
        <el-popconfirm
          :title="`确定删除 ${props.item.name} ？`"
          @confirm="main.Delete(item.key)"
          confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button
              @click.stop
              v-show="props.sw.del.active"
              type="danger"
              size="small"
              class="item-icon"
              :icon="Close"
              style="margin-left: 10px" />
          </template>
        </el-popconfirm>
<!--    表头    -->
        <el-check-tag
          :style="WeightColor(item)"
          :checked="props.item.active "
          type="primary"
          @click.stop="main.StateToggle(item.key)" >
          <el-icon
            @click.stop="InputFocus(item)"
            v-show="props.sw.edit.active && !props.item.editing"
            size="small">
            <Edit />
          </el-icon>
          <el-input
            v-show="props.item.editing"
            ref="InputRefItem"
            v-model="item.name"
            @keyup.enter="InputEditing(item)"
            @blur="InputEditing(item)"
            @click.stop
          />
          <span v-show="!props.item.editing" >{{ props.item.name }}</span>
          <el-input-number
            v-show="props.sw.weight.active && !props.sw.weightNu.active && item.active"
            v-model="item.weight"
            @change="item.weightNu=0"
            :step="1"
            :precision="0"
            :style="StyleInput"
            size="small"
            @click.stop/>
          <el-input-number
            v-show="props.sw.weight.active && props.sw.weightNu.active && item.active"
            v-model="item.weightNu"
            @change="item.weight=0"
            :min="0"
            :step="0.1"
            :precision="2"
            :style="StyleInput"
            size="small"
            @click.stop/>
        </el-check-tag>
      </el-space>
    </template>
    <!--  主体  -->
    <el-table @dragenter.stop :data="Array.from(item.children.values())" style="width: 100%">
      <el-table-column type="index" />
      <el-table-column label="组名" min-width="1">
        <template #default="scope">
          <!--    tag 组      -->
          <el-button
            @click.stop="modeChange(scope.row)"
            :type="scope.row.wordMode ? 'warning' : 'info'"
            v-show="props.sw.mode.active"
            size="small"
            class="item-icon"
            :icon="Switch"
            style="margin: 0 5px" />
          <el-check-tag class="tag-group"
                        :style="WeightColor(scope.row, item.active)"
                        :checked="scope.row.active && props.item.active "
                        :draggable="sw.drag.active"
                        @contextmenu.prevent.stop="contextMenuCopy(scope.row)"
                        @dragenter.stop="main.Drag($event, scope.row, item, 'tagGroup')"
                        @dragleave.stop="main.Drag($event, scope.row, item, 'tagGroup')"
                        @dragstart.stop="main.Drag($event, scope.row, item, 'tagGroup')"
                        @dragend.stop="main.Drag($event, scope.row, item,'tagGroup')"
                        @change="tagToggle(scope.row)">
            <el-icon
              @click.stop="InputFocus(scope.row)"
              v-show="!scope.row.editing && props.sw.edit.active"
              size="small"
              style="margin-right: 5px" >
              <Edit />
            </el-icon>
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.name"
              ref="InputRefGroup"
              @keyup.enter="InputEditing(scope.row)"
              @blur="InputEditing(scope.row)"
              @click.stop/>
            <span v-else >{{ scope.row.name }}</span>
            <el-input-number
              v-show="props.sw.weight.active && !props.sw.weightNu.active && scope.row.active && item.active"
              v-model="scope.row.weight"
              @change="scope.row.weightNu=0"
              :step="1"
              :precision="0"
              :style="StyleInput"
              size="small"
              @click.stop/>
            <el-input-number
              v-show="props.sw.weight.active && props.sw.weightNu.active && scope.row.active && item.active"
              v-model="scope.row.weightNu"
              @change="scope.row.weight=0"
              :min="0"
              :step="0.1"
              :precision="2"
              :style="StyleInput"
              size="small"
              @click.stop/>
            <el-popconfirm
              :title="`确定删除 ${scope.row.name} ？`"
              @confirm="tagGroupDelete(scope.row)"
              confirm-button-text="确定"
              cancel-button-text="取消">
              <template #reference>
                <el-icon @click.stop v-show="props.sw.del.active" size="small" style="margin-left: 5px" >
                  <Close />
                </el-icon>
              </template>
            </el-popconfirm>
          </el-check-tag>
        </template>
      </el-table-column>
      <el-table-column label="tags" min-width="5">
        <template #default="scope">
          <!--    标签      -->
          <el-scrollbar wrap-style="height: 99%">
            <el-col class="tags" wrap>
              <!--     已展示标签       -->
              <el-check-tag
                v-for="i in scope.row.children.values()" :key="i.key"
                :style="WeightColor(i, scope.row.active, item.active)"
                :checked="i.active && scope.row.active && props.item.active "
                v-show="!scope.row.GroupEdit.editing"
                :draggable="sw.drag.active"
                @dragenter.stop="main.Drag($event,  i, scope.row, 'tag')"
                @dragleave.stop="main.Drag($event,  i, scope.row, 'tag')"
                @dragstart.stop="main.Drag($event,  i, scope.row, 'tag')"
                @dragend.stop="main.Drag($event,  i, scope.row, 'tag')"
                @change="tagToggle(i)">
                <el-tag @close="tagClose(scope.row.children, i)"  closable>
                  <el-icon v-show="!i.editing" size="small"  @click.stop="InputFocus(i)">
                    <Edit />
                  </el-icon>
                  <el-input
                    v-if="i.editing"
                    v-model="i.name"
                    ref="InputRefTag"
                    style="width: 100%"
                    @keyup.enter="InputEditing(i, scope.row.children)"
                    @blur="InputEditing(i, scope.row.children)"
                    @click.stop/>
                  <div v-if="i.editing" style="display: inline-block; visibility: hidden; position: relative;left: 0">{{ i.name }}</div>
                  <span v-else>
                  {{ i.name }}
                </span>
                </el-tag>
                <el-input-number
                  v-show="props.sw.weight.active && !props.sw.weightNu.active && i.active && scope.row.active && item.active"
                  v-model="i.weight"
                  @change="i.weightNu=0"
                  :step="1"
                  :precision="0"
                  :style="{width: StyleInput.width}"
                  size="small"
                  @click.stop/>
                <el-input-number
                  v-show="props.sw.weight.active && props.sw.weightNu.active && i.active && scope.row.active && item.active"
                  v-model="i.weightNu"
                  @change="i.weight=0"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  :style="{width: StyleInput.width}"
                  size="small"
                  @click.stop/>
              </el-check-tag>
              <!--     新标签       -->
              <el-input
                v-if="scope.row.newTag.editing"
                ref="InputRefNew"
                v-model="scope.row.newTag.inputValue"
                @keyup.enter="InputConfirm(scope.row)"
                @blur="InputConfirm(scope.row)"/>
              <el-button v-else v-show="!scope.row.GroupEdit.editing" size="small"
                         @click="InputFocus(scope.row.newTag)">
                + New Tag
              </el-button>
            </el-col>
<!--             整组修改     -->
            <el-input
              v-if="scope.row.GroupEdit.editing"
              v-model="scope.row.GroupEdit.inputValue"
              ref="InputRefGroupEdit"
              :autosize="{ minRows: 6 }"
              type="textarea"
              style="padding: 5px"
              @keyup.enter="saveEditGroup(scope.row)"
              @blur="saveEditGroup(scope.row)"
              @click.stop/>
            <el-button v-else size="small" style="float: right;margin: 5px 10px" :icon="Edit"
                       @click.stop="showInputGroup(scope.row)" circle />
          </el-scrollbar>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="add">
      <el-input
        v-if="inputGroup.editing"
        ref="InputRefNew"
        v-model="inputGroup.inputValue"
        @keyup.enter="InputConfirmGroup(inputGroup)"
        @blur="InputConfirmGroup(inputGroup)"
      />
      <span v-else @click="InputFocus(inputGroup)">
        + 新的分组
      </span>
    </el-row>
  </el-collapse-item>
</template>

<script setup lang='ts'>
import { Close, Edit, Switch } from '@element-plus/icons-vue'
import { reactive, ref, nextTick, defineProps, toRaw, computed } from 'vue'
import { ElInput, ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import { mainStore } from '@/store/main_store'

// todo: 建立可编辑和删除tag组件
// todo: 合并冗余，优化代码（所有功能实现后）

// 表格标识符和各种状态
const props = defineProps<{
  colName: string
  item: IItem
  sw: ISwitch
}>()
// item 双向绑定
const item = computed({
  get: () => reactive(props.item),
  set: v => {
    main.Change([props.item.key, v])
  }
})

const main = mainStore()
// 权重数字输入css
const StyleInput = {
  width: '80px',
  marginLeft: '5px'
}
// 分隔
const sym = [' ', ',']
// 权重变色
const WeightColor = (v: ITagGroup, vup?: boolean | undefined, vupp?: boolean | undefined) => {
  if (typeof vup === 'undefined') vup = true
  if (typeof vupp === 'undefined') vupp = true
  let style: IS2S
  const color = (nu: number, type: 'add' | 'sub') => {
    const s = {
      backgroundColor: ''
    }
    s.backgroundColor = type === 'add' ? `rgba(0, 255, 0, ${nu})` : `rgba(255, 0, 0, ${nu})`
    return s
  }
  if (typeof v.weight !== 'undefined' && v.weight !== 0 && v.active && vup && vupp) {
    const max = 7
    if (v.weight > 0) {
      style = v.weight <= max
        ? color(v.weight / max, 'add')
        : color(1, 'add')
    } else {
      style = v.weight >= -max
        ? color(Math.abs(v.weight) / max, 'sub')
        : color(1, 'sub')
    }
  } else if (typeof v.weightNu !== 'undefined' && v.weightNu !== 0 && v.active && vup && vupp) {
    if (v.weightNu > 1) {
      style = v.weightNu <= 2
        ? color(v.weightNu - 1, 'add')
        : color(1, 'add')
    } else {
      style = color(1 - v.weightNu, 'sub')
    }
  } else {
    style = {}
  }
  if (v.wordMode) style.color = '#ab00ff'
  return style
}

const InputRefTag = ref<InstanceType<typeof ElInput>>()
const InputRefGroup = ref<InstanceType<typeof ElInput>>()
const InputRefItem = ref<InstanceType<typeof ElInput>>()
const InputRefNew = ref<InstanceType<typeof ElInput>>()
const InputRefGroupEdit = ref<InstanceType<typeof ElInput>>()

// tag 反转
const tagToggle = (tag: IBase) => {
  tag.active = !tag.active
}
// tag 删除
const tagClose = (tagGroup: TTagGroups, tag: IBase) => {
  tagGroup.delete(tag.key)
}

// tagGroup 输入
const inputGroup: IInput = reactive({
  editing: false,
  inputValue: ''
})
// tagGroup 删除
const tagGroupDelete = (i: ITagGroup) => {
  item.value.children.delete(i.key)
}

// 三种tag 通用 编辑保存
const InputEditing = (v: IBase, parent?: TTagGroups) => {
  v.name = v.name.trim()
  if (v.name === '' && typeof parent !== 'undefined') {
    tagClose(parent, v)
  }
  v.editing = false
}

// 输入栏自动聚焦
const InputFocus = (v: IBase | IInput) => {
  v.editing = true
  console.log(v)
  nextTick(() => {
    try {
      InputRefNew.value?.input?.focus()
      InputRefItem.value?.input?.focus()
      InputRefGroup.value?.input?.focus()
      InputRefTag.value?.input?.focus()
      InputRefGroupEdit.value?.textarea?.focus()
      toRaw(InputRefItem.value)?.input?.focus()
      toRaw(InputRefTag.value)[0]?.input?.focus()
    } catch (e) {
      console.log(e)
    }
  })
}
// todo: 待合并
// 保存输入
const InputConfirm = (v: ITagGroup) => {
  if (v.newTag.inputValue) {
    const value = v.newTag.inputValue.trim()
    const s = v.wordMode ? sym[0] : sym[1]
    value.split(s).forEach(value1 => {
      const v1 = value1.trim()
      const v2 = v.wordMode ? v1 + (Math.random() * (10 ^ 5)).toString() : v1
      const n = {
        key: v2,
        name: v1,
        editing: false,
        active: true
      }
      if (v1.length > 0) {
        v.children.set(v2, n)
      }
    })
  }
  v.newTag.editing = false
  v.newTag.inputValue = ''
}
// 保存新组
const InputConfirmGroup = (v: IInput) => {
  if (v.inputValue) {
    const v1 = v.inputValue.trim()
    const v2 = v1 + (Math.random() * (10 ^ 5)).toFixed(0).toString()
    const n: ITagGroup = {
      key: v2,
      name: v1,
      editing: false,
      active: true,
      children: new Map(),
      newTag: {
        editing: false,
        inputValue: ''
      },
      GroupEdit: {
        editing: false,
        inputValue: ''
      }
    }
    item.value.children.set(v2, n)
  }
  v.editing = false
  v.inputValue = ''
}

// 提取小组的所有tag
const getGroupTags = (i: ITagGroup, noFilter?: boolean): string[] => {
  if (noFilter) {
    return Array.from(i.children).map(value => value[1].name)
  } else {
    return Array.from(i.children).filter(v => {
      return v[1].active
    }).map(value => {
      return value[1].name
    })
  }
}
// 打开整组编辑
const showInputGroup = (v: ITagGroup) => {
  const s = []
  s[1] = v.wordMode ? sym[0] : sym[1]
  s[0] = getGroupTags(v, true)
  v.GroupEdit.inputValue = s[0].join(s[1])
  InputFocus(v.GroupEdit)
}
// 保存整组编辑
const saveEditGroup = (v: ITagGroup) => {
  v.GroupEdit.editing = false
  v.children.clear()
  v.newTag.inputValue = v.GroupEdit.inputValue
  InputConfirm(v)
}
// 右键复制小组
const contextMenuCopy = (i: ITagGroup) => {
  const tags = getGroupTags(i)
  const s = i.wordMode ? sym[0] : sym[1]
  const { toClipboard } = useClipboard()
  toClipboard(tags.join(s))
  ElMessage({
    message: `${i.name} 复制成功：\n${tags.join(s)}`,
    type: 'success'
  })
}

// tag组模式改变，标签模式和组词模式
const modeChange = (i: ITagGroup) => {
  let msg = `${i.name}组描述语句模式 `
  if (typeof i.wordMode !== 'undefined') {
    i.wordMode = !i.wordMode
    msg += i.wordMode ? '开启' : '关闭'
  } else {
    i.wordMode = true
    msg += '开启'
  }
  ElMessage({
    message: msg,
    type: 'info'
  })
}

</script>

<style lang='less'>
@on: var(--el-color-primary);
@off: var(--el-color-info);

.el-collapse {
  height: calc(100vh
  - var(--header-heigh)
  - (var(--body-margin-tb)
  - var(--body-item-pd))*2
  - var(--el-card-padding)*8
  );
  .el-icon{
    border-radius: 50%;
    vertical-align: -0.15em;
    padding: 3px;
  }
  .el-collapse-item__header {
    height: var(--card-body-item-heigh);
  }
  .el-collapse-item__content {
    padding: 0;
    .add {
      box-sizing: border-box;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      font-size: var(--el-font-size-medium);
      color: var(--el-color-info);
    }
    .add:hover {
      background: var(--el-fill-color-light);
      cursor: pointer;
    }
  }
}

.el-col.tags{
  .el-check-tag {
    box-sizing: border-box;
    margin: 5px;
    padding: 0;
    .el-tag {
      background: transparent;
      border: none;
      color: @off;
      .el-icon.el-tag__close {
        color: @off;
      }
      .el-icon:hover {
        background: rgba(255, 255, 255, 0.42);
      }
    }
  }
  .el-check-tag.is-checked {
    display: inline-block;
    .el-tag {
      color: @on;
      .el-icon.el-tag__close {
        color: @on;
      }
    }
  }

}

.el-check-tag {
  .el-icon {
    margin-right: 5px;
  }
}
.dragging {
  background: aqua !important;
}
</style>
