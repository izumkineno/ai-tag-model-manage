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
  inputVisible: boolean
  inputValue: string
}

type TBaseMapKey = string

//  tag和组以及表的基础保存属性
interface ISaveBase {
  readonly key: TBaseMapKey
  name: string
  active: boolean
  weight?: number
  weightNu?: number
  weightColor?: string
}
//  tag组的保存属性
interface ISaveTagGroup extends ISaveBase{
  children?: ISaveBase[]
  wordMode?: boolean
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
