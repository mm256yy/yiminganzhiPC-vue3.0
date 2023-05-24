// 打印所需的所有数据结构类型定义
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
// 项目类型定义
export type ProjectType = {
  id?: number
  name: string
  description?: string
  dingCorpId?: number
  showName?: string
  reservoirCode?: string
  projectType?: string
  townCode?: string
  reservoirName?: string
  districtTree?: string[]
  status: SurveyStatusEnum
}

// SURVEY("实物调查","survey"),
// REVIEW("实物复核","review"),

// 人口列表
export interface PopulationType {
  id?: number
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

// 房屋类型定义
export interface HouseType {
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
  landArea: number | string
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
  remark: string
  [key: string]: any
}

// 果木类型定义
export interface TreeType {
  id: number
  doorNo: string
  householdId: number
  surveyId: number
  name: string
  usageType: string
  size: string
  unit: string
  number: number
  remark: string
  [key: string]: any
}

// 坟墓类型定义
export interface GraveType {
  id?: number
  uid?: string
  doorNo: string
  householdId: number
  graveType: string
  number: number
  materials: string
  graveYear: string
  gravePosition: string
  remark: string
  registrantId: number
  registrantDoorNo: string
  relation: string
  [key: string]: any
}

// 附属物
export interface AppendantType {
  id: number
  doorNo: string
  householdId: number
  surveyId: string
  name: string
  size: string
  unit: string
  number: number
  remark: string
  [key: string]: any
}

export interface WillProductionType {
  id: number
  doorNo: string
  householdId: number
  productionType: string
  number: number
  uid?: string
}

// 安置意愿类型定义
export interface WillType {
  id: number
  doorNo: string
  householdId: number
  familyNum: number | string
  countryNum: number | string
  unCountryNum: number | string
  opinion: string
  productionType: string
  removalType: string
  immigrantWillProductionList: WillProductionType[]
  [key: string]: any
}

// 家庭收入
export interface FamilyIncomeType {
  id: number
  doorNo: string
  householdId: number
  sort: string
  type: string
  name: string
  amount: number
  remark: string
  [key: string]: any
}

// 附件类型定义
export interface ImmigrantFileType {
  doorNo: string
  householdId?: number
  otherPic: string
  id?: number
  uid?: string
  [key: string]: any
}

// 企业/个体户 字段
export interface CompanyType {
  id?: number | null
  doorNo: string
  householdId?: number
  uid?: string
  legalPersonName: string
  legalPersonCard: string
  legalPersonPhone: string
  companyType: string
  companyAddress: string
  licenceType: string
  periodValidity: string
  licenceNo: string
  taxPeriodValidity: string
  taxLicenceNo: string
  taxLicenceCompany: string
  ohterLicence: string
  registerType: string
  establishDate: string
  natureBusiness: string
  industryType: string
  economicNature: string
  registeredAmount: number
  fixedAssetsOriginalValue: number
  fixedAssetsNetValue: number
  regularWorkerNum: number
  temporaryWorkerNum: number
  annualPayroll: number
  averageAnnualOutputValue: number
  averageAnnualProfit: number
  averageAnnualTaxPaid: number
  managementType: string
  productCategory: string
  managementStatus: string
  informationInvolved: string
  treatmentScheme: string
  sellOwnershipArea: number
  sellOccupiedArea: number
  sellRemark: string
  transferOwnershipArea: number
  transferOccupiedArea: number
  transferRemark: string
  rentOwnershipArea: number
  rentOccupiedArea: number
  rentRemark: string
  otherOwnershipArea: number
  otherOccupiedArea: number
  otherRemark: string
  totalOwnershipArea: number
  totalOccupiedArea: number
  remark: string
  licensePic: string
  otherPic: string
  [key: string]: any
}

export interface ManagementType {
  id?: number
  doorNo: string
  householdId?: number
  lastYearAmount: number
  lastTwoYearAmount: number
  lastThreeYearAmount: number
  remark: string
  uid?: string
  name: string
  type: string
  [key: string]: any
}

export interface EquipmentType {
  id?: number
  doorNo: string
  householdId?: number
  surveyId: string
  name: string
  size: string
  unit: string
  number: number
  remark: string
  uid?: string
  purpose: string
  year: string
  amount: number
  moveType: string
  [key: string]: any
}

export interface FacilitiesType {
  id?: number
  doorNo: string
  householdId?: number
  facilitiesName: string
  facilitiesType: string
  competentUnit: string
  locationType: string
  specificLocation: string
  facilitiesCode: string
  number: number
  unit: string
  completedTime: string
  scopes: string
  benefit: number
  cost: number
  netBal: number
  originalInvest: number
  workersNum: number
  altitude: number
  inundationRang: string
  remark: string
  uid?: string
  [key: string]: any
}

export interface TemplateParamsType {
  templateKey: string
  projectId: number
  templateType: string
  templateModule: string
}

export enum MainType {
  PeasantHousehold = 'PeasantHousehold',
  Company = 'Company',
  IndividualHousehold = 'IndividualHousehold',
  Village = 'Village'
}

// 打印的类别
export enum PrintType {
  print = 'print',
  printCompany = 'printCompany',
  printIndividualHousehold = 'printIndividualHousehold'
}

// 调查对象列表
export interface LandlordType {
  // 以下两个字段 为了更好的组成树加上的
  // parentCode = 居民户virutalVillageCode || 其他villageCode
  // code = id
  id: number
  code?: string | number
  landlord?: boolean
  uid: string
  name: string
  sex: string
  card: string
  doorNo: string
  areaCode: string
  areaCodeText?: string
  townCode: string
  townCodeText?: string
  villageCode: string
  villageCodeText?: string
  virutalVillageCode: string
  virutalVillageCodeText?: string
  parentCode?: string
  address: string
  projectId: number
  longitude: string
  latitude: string
  phone: string
  locationType: string
  locationTypeText?: string
  cityCode: string
  reportStatus: string
  hasPropertyAccount?: boolean
  householdNumber: string
  reportDate: any
  reportUser: number
  fillingUpdateDate: string
  inundationRange: string
  altitude: number
  type: MainType
  totalNum?: number
  reportNum?: number
  [key: string]: any

  // 人口
  demographicList: PopulationType[]
  // 附属物
  immigrantAppendantList: AppendantType[]
  // 果木
  immigrantTreeList: TreeType[]
  // 坟墓
  immigrantGraveList: GraveType[]
  // 房屋
  immigrantHouseList: HouseType[]
  // 安置意愿
  immigrantWill: WillType
  // 家庭收入
  immigrantIncomeList: FamilyIncomeType[]
  // 附件
  immigrantFile: ImmigrantFileType

  // 企业营收
  immigrantManagementList: ManagementType[]
  // 企业设备
  immigrantEquipmentList: EquipmentType[]
  // 农村小型专项及农副业设施信息
  immigrantFacilitiesList: FacilitiesType[]
  // 个体户 / 公司 扩展字段
  company: CompanyType
}
