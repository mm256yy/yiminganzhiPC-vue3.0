export interface FruitwoodDtoType {
  id: number
  doorNo: string
  householdId: number
  surveyId: number
  name: string
  usageType: string
  size: string
  unit: string
  number: number
  remark: string
  status
  [key: string]: any
}

export interface FruitwoodParamsType {
  doorNo: string
  householdId: number
  size: number
  status
}
