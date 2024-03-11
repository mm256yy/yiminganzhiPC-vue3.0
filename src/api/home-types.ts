export interface StatisticsDtoType {
  peasantCount: number
  peasantLagCount: number
  peasantWarnCount: number
  peasantNormalCount: number
  companyCount: number
  companyLagCount: number
  companyWarnCount: number
  companyNormalCount: number
  individualCount: number
  individualLagCount: number
  individualWarnCount: number
  individualNormalCount: number
  villageCount: number
  villageLagCount: number
  villageWarnCount: number
  villageNormalCount: number
  landNoMoveCount: number
  landNoMoveLagCount: number
  landNoMoveNormalCount: number
  landNoMoveWarnCount: number
  landNoMoveCompleteCount: number
  landNoMoveIncompletCount: number
}

export interface MessageListDtoType {
  id?: number
  feedbackId: number
  remark: string
  status: string
  createdDate: any
  creater: string
}

export interface MessageDtoType {
  id?: number
  projectId: number
  doorNo: string
  householder: string
  type: string
  typeText: string
  remark: string
  status: string
  reader: string
  feedbackPic: string
  readerId: string
  createdDate: any
  creater: string
  createdBy: string
  isSelf: string
  feedbackMessageList: MessageListDtoType[]
}

export interface EvaluatorStatisticsDtoType {
  peasantCount: number
  peasantCompleteCount: number
  peasantMyCompleteCount: number
  peasantUncompletedCount: number
  companyCount: number
  companyCompleteCount: number
  companyMyCompleteCount: number
  companyUncompletedCount: number
  individualCount: number
  individualCompleteCount: number
  individualMyCompleteCount: number
  individualUncompletedCount: number
  villageCount: number
  villageCompleteCount: number
  villageMyCompleteCount: number
  villageUncompletedCount: number
}
