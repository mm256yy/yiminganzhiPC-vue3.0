export interface SiteType {
  id: number
  doorNo: string // 户号
  uid: string
  projectId: number
  status: string
  settleAddress: string // 安置点
  lotteryOrder: number // 摇号顺序号
  placeOrder: number // 择地顺序号
  eachPieceLand: number // 亩/块
  landNo: string // 土地编号
  landArea: number // 土地面积
  houseAreaType: string // 户型类型(宅基地 flat公寓)
  area: number // 户型面积
  houseNo: number // 幢号
  roomNo: number // 室号
  storeroomNo: number // 储藏室号
  carNo: string // 车号
  lotteryOrderPic: string // 摇号顺序号
  placeOrderPic: string // 择地顺序号
  chooseHousePic: string // 择房确认单
  otherPic: string // 其他附件
  lotteryOrderVerifyPic: string // 摇号顺序号确认单
  placeOrderVerifyPic: string // 择房顺序号确认单
  [key: string]: any
}
