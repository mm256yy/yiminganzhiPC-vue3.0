export interface LandlordDtoType {
  id: number
  name: string
  sex: string
  card: string
  doorNo: string
  showDoorNo: string
  townCode: string
  neighborhoodCommittee: string
  villageCode: number
  address: string
  projectId: number
  longitude: string
  latitude: string
  phone: string
  locationType: string
  cityCode: string
  areaCode: string
  hasPropertyAccount: boolean
  householdNumber: string // 户籍册编号
  status: string // 移民阶段，如数据采集 survey，实物复核 implementation
  warnStatus?: string
  householderName?: string
  householderDoorNo?: string
  [key: string]: any
}

export interface LandlordHeadInfoType {
  demographicNum: number
  peasantHouseholdNum: number
  reportSucceedNum: number
  unReportNum: number
  peasantHouseholdLandNum?: any
  demographicLandNum?: any
  peasantHouseholdTotalNum?: any
  demographicTotalNum?: any
}

export interface TemplateParamsType {
  templateKey: string
  projectId: number
  templateType: string
  templateModule: string
}

export interface SurveyInfoType {
  immigrantGraveList: any[]
  immigrantHouseList: any[]
  immigrantTreeList: any[]
  demographicList: any[]
  immigrantAppendantList: any[]
}
