export interface RelocationResettleDtoType {
  id?: number
  doorNo: string
  householdId: number
  town: string // 政府名称（乡镇名称）
  village: string // 自然村名称
  householder: string // 户主名称
  houseNames: string // 房屋名称（腾空的房屋）
  landArea: number // 土地总面积
  arableLandArea: number // 耕地面积
  woodLandArea: number // 园地面积
  uselessArea: number // 未利用土地面积
  familyMember: string // 家庭成员姓名

  houseSoarTransfer: string // 屋腾空确认单-腾空移交项目
  houseOutAddress: string // 房屋腾空确认单-迁出地址

  greenLandName: string // 青苗腾空确认单-承包地块名称
  greenTransferType: string // 青苗腾空确认单-移交类型
  greenOutAddress: string // 青苗腾空确认单-迁出地址

  chooseHouseNum: string // 择房确认单-择房号
  chooseHouseOutAddress: string // 择房确认单-迁出地址
  chooseHouseStatus: string // 择房确认单-状态
  rrChooseHouseInfoList: ChooseHouseDtoType // 择房确认单/择房交付告知单 -- 择房信息登记

  chooseAddressNum: string // 择址确认单-择址号
  chooseAddressOutAddress: string // 择址确认单-迁出地址
  rrHomesteadInfoList: SiteSelectionDtoType // 择址确认单 -- 择址信息登记

  buildHouseAddress: string // 建房告知单-位于地址
  buildHouseOutAddress: string // 建房告知单-迁出地址
  rrHouseBuildInfoList: BuildHouseDtoType // 建房告知单-建房信息登记

  deliverHouseName: string // 择房交付告知单-安置项目名称
  deliverHouseDepart: string // 择房交付告知单-部门
  deliverHouseNum: string // 择房交付告知单-交房号
  deliverHouseOutAddress: string // 择房交付告知单-迁出地址

  chooseGraveNum: string // 坟墓择址确认单-坟墓择址号
  chooseGraveOutAddress: string // 坟墓择址确认单-迁出地址
  rrChooseGraveInfoList: TombAddressDtoType // 坟墓择址确认单/坟墓迁移告知单-坟墓择址信息登记

  graveMigrateName: string // 坟墓迁移告知单-坟墓名称
  graveMigrateNum: string // 坟墓迁移告知单-择址号
  graveMigrateOutAddress: string // 墓迁移告知单-迁出地址

  landDepart: string // 生产用地交付告知单-部门名称
  landOutAddress: string // 生产用地交付告知单-迁出地址
  rrLandInfoList: ProductLandDtoType // 生产用地交付告知单-生产用地地块信息登记

  rrInsuredInfoList: SocialSecurityDtoType // 社保缴费确认单-参保人信息登记

  buildCheckOutAddress: string // 自建房验收告知单-迁出地址
  rrHouseBuildCheckList: BuildRoomDtoType // 自建房验收告知单-验收信息列表
}

// 择房确认单/择房交付告知单 -- 择房信息登记
export interface ChooseHouseDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  area: string // 区块
  houseType: string // 房型
  buildingNum: string // 幢号
  roomNum: string // 室号
  storeroomNum: string // 储藏室编号
  garageNum: string // 车库编号
  remark: string // 备注
  [key: string]: any
}

// 择址确认单 -- 择址信息登记
export interface SiteSelectionDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  area: string // 区块
  homesteadNum: string // 宅基地编号
  homesteadAddress: string // 宅基地位置
  homesteadArea: number // 面积
  remark: string // 备注
  [key: string]: any
}

// 建房告知单 -- 建房信息登记
export interface BuildHouseDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  area: string // 区块
  homesteadNum: string // 宅基地编号
  homesteadArea: number // 面积
  remark: string // 备注
  [key: string]: any
}

// 坟墓择址确认单/坟墓迁移告知单 -- 坟墓择址信息登记
export interface TombAddressDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  relation: string // 与登记权属人关系
  handleWay: string // 处理方式
  graveName: string // 安置墓地名称
  graveAddress: string // 详细地址
  graveNum: string // 墓地编号
  remark: string // 备注
  [key: string]: any
}

// 生产用地交付告知单 -- 生产用地地块信息登记
export interface ProductLandDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  landName: string // 地名
  landArea: number // 面积
  landType: string // 地类
  remark: string // 备注
  [key: string]: any
}

// 社保缴费确认单 -- 参保人信息登记
export interface SocialSecurityDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  insuredName: string // 参保人
  insuredSex: string // 性别
  insuredCardL: string // 身份证号码
  payLevel: string // 缴费档次
  payAmount: string // 缴费金额
  payTime: string // 缴费时间
  remark: string // 备注
  [key: string]: any
}

// 自建房验收告知单 -- 验收信息列表
export interface BuildRoomDtoType {
  id?: number
  uid?: string
  projectId?: number
  doorNo: string
  householdId?: number
  resettleId?: number // 动迁安置 ID
  homesteadNum: string // 宅基地编号
  wall: string // 墙壁
  hydropower: string // 水电
  waterproof: string // 防水
  piping: string // 管道
  ground: string // 地面
  isCheck: string // 是否通过验收（是/否）
  remark: string // 备注
  [key: string]: any
}
