export interface HouseAccessoryDtoType {
  id?: number
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  status: string
  name: string
  size: string
  unit: string
  number: number
  price: number
  discountRate: number
  valuationAmount: number
  compensationAmount: number
  remark: string
  [key: string]: any
}
