export interface IndividualRegionType {
  householdName: any
  id: number //序号
  doorNo: number //个体户编号
  name: number //个体户名称
  appendageStatus: string //房屋附属物
  landStatus: string //土地附着物
  deviceStatus: string //设施设备
  cardStatus: string // 个体户建卡
  houseSoarStatus: string // 房屋腾空
  landSoarStatus: string // 土地腾空
  agreementStatus: string // 动迁协议
  [key: string]: any
}
