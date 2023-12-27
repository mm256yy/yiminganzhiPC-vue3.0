export interface LandlordDtoType {
  id: number
  nickName: string
  phone: string
  peasantHouseholdNumber: number
  companyNumber: number
  individualHouseholdNumber: number
  villageNumber: number
  warnStatus?: string
  [key: string]: any
}
