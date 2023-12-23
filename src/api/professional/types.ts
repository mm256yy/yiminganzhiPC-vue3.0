// 专业项目类型
export interface ProfessionalProjectDtoType {
  id?: number
  uid: string
  status: string
  name: string
  code: string
  type: string
  underlyingCompany: string
  address: string
  locationType: string
  responsibilityCompany: string
  designCompany: string
  supervisionCompany: string
  lumpSumPic?: string
  otherPic?: string
  projectId: number
  projectSchedule: string
  [key: string]: any
  parentCode?: string
}

// 专业项目进度类型
export interface ProfessionalScheduleDtoType {
  id?: number
  uid: string
  projectId: number
  status: string
  completeDate: string
  completePic: string
  name: string
  type: string
  isComplete: string
  professionalId: number
  [key: string]: any
}

// 专业项目协议类型
export interface ProfessionalContractDtoType {
  id: number
  uid: string
  projectId: number
  status: string
  contractName: string
  professionalId: number
  contractCode: string
  contractAmount: number
  startDate: string
  endDate: string
  nodeDtoList: NodeDto[]
  paymentNodeList: PaymentNode[]
  [key: string]: any
}

export interface NodeDto {
  id: number
  uid: string
  projectId: number
  status: string
  contractId?: number
  amount: number
  paymentDate: string
  [key: string]: any
}

export interface PaymentNode {
  createdDate: string
  receipt: string
  amount: Number
  [key: string]: any
}
