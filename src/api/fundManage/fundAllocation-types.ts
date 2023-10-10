export interface FunPaymentType {
  id: number
  source: number // 资金来源
  name: string // 资金名称
  payee: number // 收款方
  amount: number // 资金金额
  receipt: string // 凭证
  createUserId: number // 创建人
  createUserName: string // 创建人
  dataState: number // 状态
  createTime: string // 创建时间
  updateTime: string // 更新时间
  remark: string // 备注
}
