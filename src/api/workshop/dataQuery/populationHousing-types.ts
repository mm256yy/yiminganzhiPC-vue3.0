export interface PopulationHousingDtoType {
  doorNo: string
  householdName: string
  inCount: number
  outCount: number
  sumCount: number
  houseNo: string
  storeyNumber: number
  constructionTypeText: string
  landArea: number
  locationTypeText: string
  remark: string
  [key: string]: any
}

export interface ExportType {
  villageCode?: string
  type: string
}
