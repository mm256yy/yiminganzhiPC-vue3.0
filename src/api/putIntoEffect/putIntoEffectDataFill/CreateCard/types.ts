export interface PeasantHouseholdType {
  accountName: string
  bankName: string
  bankAccount: string
  [key: string]: any
}

export interface CreateCardType {
  doorNo: string // 户号
  name: string // 指标名称
  unit: string // 单位
  number: number // 数量
  remark: string // 备注
  price: number // 价格
  totalPrice: number // 总价
  isVerify: string // 是否确认
  type: string // 金额类型: 1 补偿, 2 补助, 3 奖励, 4 其他
  isUpdate: string // 是否可修改
  [key: string]: any
}
