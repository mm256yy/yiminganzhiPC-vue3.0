// 资金使用情况报表
export interface FundDetailReportType {
  amount: number
  apr: number
  code: string
  gaiInvest: number
  gsInvest: number
  guInvest: number
  id: number
  level: number
  name: string
  serNo: number
  serNoStr: string
  type: string
  [key: string]: any
}

// 居民户报表
export interface HouseholdReportType {
  [key: string]: any
}

// 企业报表
export interface EnterpriseReportType {
  [key: string]: any
}

// 个体户报表
export interface IndividualBReportType {
  [key: string]: any
}

// 村集体报表
export interface VillageReportType {
  [key: string]: any
}
