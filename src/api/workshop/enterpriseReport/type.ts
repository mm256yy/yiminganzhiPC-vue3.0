export interface EnterpriseReportType {
  householdName: any
  id: number //序号
  doorNo: string //企业编号
  name: string //企业
  appendageStatus: string //房屋附属物
  graveStatus: string //土地附着物
  deviceStatus: string //设施设备
  cardStatus: string //企业建卡
  houseSoarStatus: string //房屋腾空
  landSoarStatus: string //土地腾空
  agreementStatus: string //动迁协议
  proceduresStatus: string //相关手续
  [key: string]: any
}
