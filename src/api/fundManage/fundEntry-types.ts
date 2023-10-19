export interface FundEntryType {
  id: number
  name: string
  amount: number
  source: string
  recordTime: string
  remark: string
  receipt: string
  status: number
  dataState: number
  createTime: string
  updateTime: string
  projectId: number
  payee: string // 收款方
  type: string // 1入账 2出账
  entryType: string // 入账类型 1 普通入账 2法人入账
  sourceText: string
}
