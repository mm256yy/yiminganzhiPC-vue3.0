export interface FillTypes {
  id: number
  doorNo: string
  householdPicStatus: string // 居民户信息完成状态
  houseMainStatus: string // 房屋主体评估填报状态
  houseRenovationStatus: string // 房屋装修评估填报状态
  appendageStatus: string // 附属物评估填报状态
  treeStatus: string // 果木评估填报状态
  landStatus: string // 土地评估填报状态
  graveStatus: string // 坟墓评估填报状态
  estimateeStatus: string // 评估总状态
  [key: string]: any
}
