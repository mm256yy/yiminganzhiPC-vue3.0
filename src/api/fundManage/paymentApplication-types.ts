import dayjs from 'dayjs'

export interface PaymentApplicationDtoType {
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
