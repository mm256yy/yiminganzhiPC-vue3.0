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
  [key: string]: any
}

export interface DemographicHeadType {
  demographicNum: number
  peasantHouseholdNum: number
}
