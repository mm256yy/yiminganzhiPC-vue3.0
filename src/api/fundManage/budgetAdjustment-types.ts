import dayjs from 'dayjs'

export interface BudgetAdjustmentType {
  applyType: string
  name: string
  type: string
  funSubjectId: number
  remark: string
  paymentType: string
  dataState: number
  createdDate: string | dayjs.Dayjs
  amount: number[]
  node: number
  auditType: number
  status: string
  gsStatus: string
  [key: string]: any
}

export interface AdjustmentType {
  ids: string
  type: string
  gsRemark: string
  [key: string]: any
}
