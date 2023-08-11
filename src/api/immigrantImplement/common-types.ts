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
