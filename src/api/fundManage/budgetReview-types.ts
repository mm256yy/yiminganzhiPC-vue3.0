import dayjs from 'dayjs'

export interface BudgetReviewType {
  applyType: string
  name: string
  type: string
  funSubjectId: number
  remark: string
  paymentType: string
  dataState: number
  status: number
  gsStatus: number
  applyUserName: string
  gsRemark: string
  gsNode: number
  businessId: number
  createdDate: string | dayjs.Dayjs
  amount: number[]
  node: number
  auditType: number
  [key: string]: any
}
