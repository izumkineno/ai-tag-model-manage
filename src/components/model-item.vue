<template>
  <el-collapse-item :name="props.colName">
    <!--  头  -->
    <template #title>
      <el-space wrap>
<!--     删除确认     -->
        <el-popconfirm
          :title="`确定删除 ${props.item.name} ？`"
          @confirm="itemDelete"
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
        <el-check-tag :checked="props.item.active" type="primary" @click.stop="itemStateChange">
          <el-icon
            @click.stop="showInputTag(item)"
            v-show="props.sw.edit.active && !props.item.editing"
            size="small"
            style="color: white">
            <Edit />
          </el-icon>
          <el-input
            v-if="props.item.editing"
            ref="InputRefItem"
            v-model="item.name"
            @keyup.enter="InputEditing(item)"
            @blur="InputEditing(item)"
            @click.stop
          />
          <span v-else >{{ props.item.name }}</span>
        </el-check-tag>
      </el-space>
    </template>
    <!--  主体  -->
    <el-table :data="Array.from(item.tagGroups.values())" style="width: 100%">
      <el-table-column type="index" />
      <el-table-column label="组名" width="200">
        <template #default="scope">
          <!--    tag 组      -->
          <el-check-tag
            class="tag-group"
            :checked="scope.row.active && props.item.active"
            @change="tagToggle(scope.row)">
            <el-icon
              @click.stop="showInputTag(scope.row)"
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
      <el-table-column label="tags">
        <template #default="scope">
          <!--    标签      -->
          <el-space class="tags" wrap>
            <!--     已展示标签       -->
            <el-check-tag
              v-for="i in scope.row.tags.values()" :key="i"
              :checked="i.active && scope.row.active && props.item.active"
              @change="tagToggle(i)">
                  <el-tag @close="tagClose(scope.row.tags, i)"  closable>
                    <el-icon v-show="!i.editing" size="small"  @click.stop="showInputTag(i)">
                      <Edit />
                    </el-icon>
                    <el-input
                      v-if="i.editing"
                      v-model="i.name"
                      ref="InputRefTag"
                      @keyup.enter="InputEditing(i)"
                      @blur="InputEditing(i)"
                      @click.stop/>
                    <span v-show="!i.editing">
                  {{ i.name }}
                </span>
                  </el-tag>
                </el-check-tag>
            <!--     新标签       -->
            <el-input
              v-if="scope.row.newTag.inputVisible"
              ref="InputRefNew"
              v-model="scope.row.newTag.inputValue"
              @keyup.enter="InputConfirm(scope.row)"
              @blur="InputConfirm(scope.row)"
            />
            <el-button v-else size="small" @click="showInputNew(scope.row.newTag)">
              + New Tag
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="add">
      <el-input
        v-if="inputGroup.inputVisible"
        ref="InputRefNew"
        v-model="inputGroup.inputValue"
        @keyup.enter="InputConfirmGroup(inputGroup)"
        @blur="InputConfirmGroup(inputGroup)"
      />
      <span v-else @click="showInputNew(inputGroup)">
        + 新的分组
      </span>
    </el-row>
  </el-collapse-item>
</template>

<script setup lang='ts'>
import { Close, Edit } from '@element-plus/icons-vue'
import { reactive, ref, nextTick, defineProps, defineEmits, toRaw, computed } from 'vue'
import { ElInput } from 'element-plus'
// todo: 建立可编辑和删除tag组件

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
    emit('itemChange', [props.item.key, v])
  }
})
// 传给父组件的 事件
const emit = defineEmits(['itemState', 'itemDelete', 'itemChange'])
// 状态改变 开/关
const itemStateChange = () => {
  emit('itemState', props.item.key)
}
// 删除item
const itemDelete = () => {
  emit('itemDelete', props.item.key)
}

// ************************* tag 相关
const InputRefTag = ref<InstanceType<typeof ElInput>>()
// tag 删除
const tagClose = (tagGroup: TTagGroups, tag: IBase) => {
  tagGroup.delete(tag.key)
}
// ************************* tagGroup 相关
const InputRefGroup = ref<InstanceType<typeof ElInput>>()
// tagGroup 输入
const inputGroup: IInput = reactive({
  inputVisible: false,
  inputValue: ''
})
// tagGroup 删除
const tagGroupDelete = (i: ITagGroup) => {
  item.value.tagGroups.delete(i.key)
}
// ************************* item 相关
const InputRefItem = ref<InstanceType<typeof ElInput>>()
// ************************* 其他或通用
const InputRefNew = ref<InstanceType<typeof ElInput>>()
// 反转
const tagToggle = (tag: IBase) => {
  tag.active = !tag.active
}
// 编辑
const InputEditing = (v: IBase) => {
  v.name = v.name.trim()
  v.editing = false
}

// todo 计划合并
// todo: 修改判断方案
// todo: 当输入为空时删除标签或取消编辑
// 新建tag
const showInputNew = (v: IInput) => {
  v.inputVisible = true
  nextTick(() => {
    InputRefNew.value?.input?.focus()
  })
}
const showInputTag = (v: IBase) => {
  v.editing = true
  nextTick(() => {
    try {
      // toRaw(InputRefItem.value)?.input.focus()
      InputRefItem.value?.input?.focus()
      InputRefGroup.value?.input?.focus()
      InputRefTag.value?.input?.focus()
      toRaw(InputRefTag.value)[0].input.focus()
    } catch (e) {
      console.log(e)
    }
  })
}
// 保存输入
const InputConfirm = (v: ITagGroup) => {
  if (v.newTag.inputValue) {
    const value = v.newTag.inputValue.trim()
    const n = {
      key: value,
      name: value,
      editing: false,
      active: true
    }
    v.tags.set(value, n)
  }
  v.newTag.inputVisible = false
  v.newTag.inputValue = ''
}
const InputConfirmGroup = (v: IInput) => {
  if (v.inputValue) {
    const value = v.inputValue.trim()
    const n: ITagGroup = {
      key: value,
      name: value,
      editing: false,
      active: true,
      tags: new Map(),
      newTag: {
        inputVisible: false,
        inputValue: ''
      }
    }
    item.value.tagGroups.set(value, n)
  }
  v.inputVisible = false
  v.inputValue = ''
}

</script>

<style lang='less'>
//.one-animal {
//  transition: all .1s !important;
//}
//.el-check-tag {
//  .one-animal();
//  background: var(--el-color-danger-light-8);
//  color: var(--el-color-danger);
//  .el-tag,.el-icon.el-tag__close {
//    color: var(--el-color-danger);
//  }
//  .el-icon:hover {
//    background: rgba(255, 255, 255, 0.42);
//  }
//  .el-tag {
//    .one-animal();
//    .el-tag__content {
//      .one-animal();
//    }
//  }
//}
//.el-check-tag.is-checked {
//  background: var(--el-color-primary-light-8);
//  color: var(--el-color-primary);
//  .el-tag,.el-icon {
//    color: var(--el-color-primary);
//  }
//}
//
//.el-check-tag:hover {
//  background: var(--el-color-danger);
//}
//.el-check-tag.is-checked:hover {
//  background: var(--el-color-primary);
//}
//.el-check-tag:active {
//  background: var(--el-color-danger-dark-2);
//}
//.el-check-tag.is-checked:active {
//  background: var(--el-color-primary-dark-2);
//}
//.el-check-tag:hover,.el-check-tag.is-checked:hover {
//  color: white;
//  .el-tag,.el-icon {
//    color: white;
//  }
//}
//
//.el-check-tag.tag-group{
//  border: 1px solid var(--el-color-danger-light-5);
//}
//.el-check-tag.is-checked.tag-group  {
//  border: 1px solid var(--el-color-primary-light-5);
//}

.el-collapse {
  height: calc(100vh - var(--header-heigh) - (var(--body-margin-tb) + var(--title-pd) + var(--body-item-pd))*2);
  .el-icon{
    border-radius: 50%;
    vertical-align: -0.15em;
    padding: 3px;
  }
  .el-collapse-item__header {
    height: var(--card-body-item-heigh);
    //.el-check-tag{
    //  background: var(--el-color-danger);
    //  color: white;
    //}
    //.el-check-tag.is-checked  {
    //  background: var(--el-color-primary);
    //}
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

.el-space.tags{
  .el-check-tag {
    box-sizing: border-box;
    margin: 5px 0;
    padding: 0;
    .el-tag {
      background: transparent;
      border: none;
      .el-icon:hover {
        background: rgba(255, 255, 255, 0.42);
      }
    }
  }
}

.el-check-tag {
  .el-icon {
    margin-right: 5px;
  }
}
</style>
