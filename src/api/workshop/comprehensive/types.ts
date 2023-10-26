export interface ComprehensiveReportType {
  doorNo: any
  householdName: any
  id: number //序号
  name: string // 项目名称
  type: string // 专项类别
  code: string //专项编码
  responsibilityCompany: string // 责任单位
  designCompany: string // 设计单位
  supervisionCompany: string // 监理单位
  agreementStatus: string // 协议签订
  startStatus: string // 开工
  completeStatus: string // 完工
  checkStatus: string // 验收
  [key: string]: any
}
