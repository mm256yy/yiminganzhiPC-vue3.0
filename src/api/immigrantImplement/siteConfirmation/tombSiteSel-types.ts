export interface GraveType {
  id?: number
  registrantId: number
  doorNo: string
  householdId: number
  projectId: number
  uid: string
  registrantDoorNo: string
  status: string
  graveName: string
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
