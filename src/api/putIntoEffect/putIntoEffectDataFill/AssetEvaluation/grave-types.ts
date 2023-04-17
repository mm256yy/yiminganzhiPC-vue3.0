export interface GraveDtoType {
  id?: number
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  name: string
  hasEstimate: string
  relation: string
  graveYear: string
  number: number
  localClassify: string
  valuationAmount: number
  compensationAmount: number
  migrationFee: number
  otherIncentiveFees: number
  remark: string
  [key: string]: any
}
