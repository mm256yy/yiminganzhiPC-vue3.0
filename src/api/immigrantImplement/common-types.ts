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
  status: string // 移民阶段，如数据采集 survey，实物复核 implementation
  [key: string]: any
}

export interface DocumentationType {
  id: number
  doorNo: string
  uid: string
  projectId: number
  status: string
  produceVerifyPic: string
  produceOtherPic: string
  relocateVerifyPic: string
  relocateOtherPic: string
  graveVerifyPic: string
  graveOtherPic: string
  graveChoosePic: string
  graveChooseOtherPic: string
  houseEmptyPic: string
  houseEmptyOtherPic: string
  landEmptyPic: string
  landEmptyOtherPic: string
  excessVerifyPic: string
  excessAgreementPic: string
  excessVerifyOtherPic: string
  buildOneselfPic: string
  buildOneselfCheckPic: string
  buildOneselfOtherPic: string
  flatAgreementPic: string
  flatMeasurementPic: string
  flatOtherPic: string
  agriculturePic: string
  agricultureOtherPic: string
  [key: string]: any
}

// 填报类型
export interface FillingType {
  id: number
  doorNo: string
  uid: string
  projectId: number
  status: string
  householdPicStatus: string
  houseMainStatus: string
  houseRenovationStatus: string
  appendageStatus: string
  treeStatus: string
  landStatus: string
  graveStatus: string
  estimateeStatus: string
  populationStatus: string
  propertyStatus: string
  qualificationStatus: string
  productionArrangementStatus: string
  relocateArrangementStatus: string
  graveArrangementStatus: string
  arrangementStatus: string
  landUseStatus: string
  chooseHouseStatus: string
  chooseGraveStatus: string
  chooseStatus: string
  cardStatus: string
  houseSoarStatus: string
  landSoarStatus: string
  excessStatus: string
  excessSoarStatus: string
  buildOneselfStatus: string
  flatsStatus: string
  centralizedSupportStatus: string
  relocateArrangementAllStatus: string
  agricultureArrangementStatus: string
  retirementStatus: string
  selfEmploymentStatus: string
  productionArrangementAllStatus: string
  proceduresStatus: string
  agreementStatus: string
  deviceStatus: string
  specialStatus: string
  disposalMeasuresStatus: string
  isUpdate: string
  [key: string]: any
}
