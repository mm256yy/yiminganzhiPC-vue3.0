export interface DemographicDtoType {
  id: number
  name: string
  sex: string
  card: string
  relation: string
  doorNo: string
  townCode: string
  villageCode: string
  virutalVillageCode: string
  address: string
  birthday: string
  nation: string
  censusRegister: string
  education: string
  marital: string
  censusType: string
  populationType: string
  occupation: string
  company: string
  comeTime: string
  comeCause: string
  comeAddressTime: string
  comeAddressCause: string
  fromTown: string
  fromAddress: string
  projectId: number
  cityCode: string
  areaCode: string
  cityCodeText: string
  areaCodeText: string
  townCodeText: string
  villageText: string
  virutalVillageText: string
  insured: boolean
  [key: string]: any
}

export interface DemographicHeadType {
  demographicNum: number
  peasantHouseholdNum: number
}

export interface ExcelListType {
  id: number
  importFile: string
  status: string
  remark: string
  demographicNum: number
  peasantHouseholdNum: number
  [key: string]: any
}
