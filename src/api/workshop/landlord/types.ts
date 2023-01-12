export interface LandlordDtoType {
  id: number
  name: string
  sex: string
  card: string
  doorNo: string
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
  [key: string]: any
}

export interface LandlordHeadInfoType {
  demographicNum: number
  peasantHouseholdNum: number
  reportSucceedNum: number
  unReportNum: number
}
