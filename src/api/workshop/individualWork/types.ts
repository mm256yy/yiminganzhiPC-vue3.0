export interface IndividualWorkType {
  id: number //序号
  gridmanName: string //工作组
  totalHouse: number //总任务数（户）
  populationStatusCount: number //房屋附属物
  landStatusCount: number //土地附着物
  deviceStatusCount: number //设施设备
  cardStatusCount: number //个体户建卡
  houseSoarStatusCount: number //房屋腾空
  landSoarStatusCount: number //土地腾空
  agreementStatusCount: number //动迁协议
  [key: string]: any
}
