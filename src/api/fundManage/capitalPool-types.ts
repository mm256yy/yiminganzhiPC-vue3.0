export interface CapitalPoolDtoType {
  name?: string
  type?: string
  source?: string
  status?: number
  projectId?: number
  amount?: any
  recordTime?: any
  dataState?: number
}

export interface CapitalPoolAccount {
  entryAmount: number
  outgoingAmount: number
  residueAmount: number
}
