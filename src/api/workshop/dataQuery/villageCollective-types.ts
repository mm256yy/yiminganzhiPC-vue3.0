export interface VillageCollectiveDtoType {
  appendantList: AppendantDtoType
  houseList: HouseDtoType
  treeList: TreeDtoType
  [key: string]: any
}

// 房屋
export interface HouseDtoType {
  villageCode: string
  doorNo: string
  householdName: string
  inCount: number
  outCount: number
  sumCount: number
  houseNo: string
  storeyNumber: number
  constructionTypeText: string
  landArea: number
  locationTypeText: string
  remark: string
  [key: string]: any
}

// 零星(林)果木
export interface TreeDtoType {
  villageCode: string
  doorNo: string
  householdName: string
  name: string
  unit: string
  unitText: string
  size: string
  sizeText: string
  number: number
  remark: string
}

// 附属物
export interface AppendantDtoType {
  villageCode: string
  doorNo: string
  householdName: string
  name: string
  unit: string
  size: string
  number: number
  remark: string
}

export interface ParamsType {
  villageCode?: string
  householdName?: string
}
