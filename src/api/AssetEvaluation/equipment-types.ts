export interface EquipmentDtoType {
  id?: number
  uid: string
  doorNo: string
  householdId: number
  projectId: number
  status: string
  name: string
  size: string
  unit: string
  number: number
  purpose: string
  year: string
  amount: number
  moveType: string
  valuationPrice: number
  discountRate: number
  newnessRate: number
  valuationAmount: number
  compensationAmount: number
  remark: string
  [key: string]: any
}
