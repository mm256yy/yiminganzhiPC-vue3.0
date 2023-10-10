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

export interface ConfigDtoType {
  projectId: number
  type: number
  settleAddress?: string
}
