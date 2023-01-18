//  开关接口
interface ISwitch {
  [propName: string]: {
    name: string,
    active: boolean
  }
}
//  通用string：string
interface IS2S {
  [propName: string]: string
}
// new tag
interface IInput {
  editing: boolean
  inputValue: string
}

type TBaseMapKey = string

// tag模板格式
interface IModelSaveBase {
  readonly key: TBaseMapKey
  active: boolean
  weight?: number
  weightNu?: number
}
// group模板格式
interface IModelSaveTagGroup extends IModelSaveBase{
  children?: IModelSaveBase[]
  wordMode?: boolean
}
// item模板格式
interface IModelSaveItem extends IModelSaveBase {
  children?: IModelSaveTagGroup[]
}

//  tag和组以及表的基础保存属性
interface ISaveBase extends IModelSaveBase{
  name: string
}
//  tag组的保存属性
interface ISaveTagGroup extends ISaveBase, IModelSaveTagGroup{
  children?: ISaveBase[]
}
//  tag表保存属性
interface ISaveItem extends ISaveBase {
  children?: ISaveTagGroup[]
}

//  tag和组以及表的基础属性
interface IBase extends ISaveBase{
  editing: boolean
}
//  tag的map集合
type TTags = Map<TBaseMapKey, IBase>
//  tag组
interface ITagGroup extends IBase, ISaveTagGroup{
  children: TTags
  newTag: IInput
  GroupEdit: IInput
}
//  tag组的集合
type TTagGroups = Map<TBaseMapKey, ITagGroup>
//  tag表
interface IItem extends IBase, ISaveItem {
  children: TTagGroups
}
//  tag表集合
type TItem = Map<TBaseMapKey, IItem>

type TTagType = 'tag'| 'tagGroup' | 'item'

interface IDataMain {
  children: TItem
  inputItemAdd: ''
  sw: ISwitch
  lastSave: ISaveItem[]
  drag: {
    key?: string,
    index?: number,
    lastKey?: string,
    lastTag?: HTMLSpanElement
    lastParent?: IItem | ITagGroup | IDataMain
  }
  dragIndex: Map<TTagType, number>
}
type TParent = IItem | ITagGroup | IDataMain
