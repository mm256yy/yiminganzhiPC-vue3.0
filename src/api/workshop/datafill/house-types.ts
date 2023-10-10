export interface HouseDtoType {
  id: number
  doorNo: string
  householdId: number
  houseNo: string
  propertyType: string
  usageType: string
  houseType: string
  constructionType: string
  storeyNumber: number
  completedTime: string
  propertyNo: string
  landNo: string
  landType: string
  landArea: number
  storeyHeight: number
  houseHeight: number
  outerWallType: string
  interiorWallType: string
  groundType: string
  roofType: string
  roofMaterialsType: string
  doorsWindowsType: string
  waterElectricityType: string
  formula: string
  longitude: string
  latitude: string
  housePic: string
  ownersSituation?: Array<[]>
  addReason?: string
  deleteReason?: string
  isComplianceA?: string
  otherProofPic?: string
  remark: string
  [key: string]: any
}
