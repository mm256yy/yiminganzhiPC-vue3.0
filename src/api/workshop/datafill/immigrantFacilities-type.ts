export interface FacilitiesDtoType {
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
  [key: string]: any
}

export interface FacilitiesParamsType {
  doorNo: string
  householdId: number
  size: number
}
