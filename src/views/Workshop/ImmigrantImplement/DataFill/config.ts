import { getPlacementPointListApi } from '@/api/systemConfig/placementPoint-service'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const getSettleAddressList = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '1',
    size: 9999,
    page: 0
  }
  try {
    const result: any = await getPlacementPointListApi(params)
    console.log(result, 'bbqs')
    return result.content
  } catch {}
}
const getSettleAddressListFlat = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '2',
    size: 9999,
    page: 0
  }
  try {
    const result: any = await getPlacementPointListApi(params)
    console.log(result, '测试数据')
    return result.content
  } catch {}
}
// tab 唯一标识
export const TabIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// 居民户 第一层 tab
export const HouseholdTabs = [
  {
    id: 0,
    name: '居民户信息'
  },
  {
    id: 1,
    name: '资格认定'
  },
  {
    id: 2,
    name: '资产评估'
  },
  {
    id: 3,
    name: '模拟安置'
  },
  {
    id: 4,
    name: '安置确认'
  },
  {
    id: 5,
    name: '择址确认'
  },
  {
    id: 7,
    name: '移民建卡'
  },
  {
    id: 6,
    name: '协议签订'
  },

  {
    id: 8,
    name: '腾空过渡'
  },
  {
    id: 9,
    name: '搬迁安置'
  },
  {
    id: 10,
    name: '生产安置'
  },
  {
    id: 11,
    name: '相关手续'
  }
]

// 居民户 tab 第二层
export const HouseholdSubTabs = [
  // 资格认定
  {
    type: 1,
    name: '人口核定',
    id: TabIds[0],
    icon: 'mdi:user-details',
    active: false,
    key: 'populationStatus'
  },
  {
    type: 1,
    name: '房屋产权',
    id: TabIds[1],
    icon: 'clarity:house-solid',
    active: false,
    key: 'propertyStatus'
  },

  // 资产评估
  {
    type: 2,
    name: '房屋附属物评估报告',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false,
    key: 'houseAllStatus'
  },
  {
    type: 2,
    name: '土地附着物评估报告',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false,
    key: 'landAllStatus'
  },

  // 安置确认
  {
    type: 4,
    name: '搬迁安置',
    id: TabIds[0],
    icon: 'mdi:lorry',
    active: false,
    key: 'relocateArrangementStatus'
  },
  {
    type: 4,
    name: '生产安置',
    id: TabIds[1],
    icon: 'pixelarticons:buildings',
    active: false,
    key: 'productionArrangementStatus'
  },
  {
    type: 4,
    name: '坟墓确认',
    id: TabIds[2],
    icon: 'tabler:grave-2',
    active: false,
    key: 'graveArrangementStatus'
  },

  // 择址确认
  {
    type: 5,
    name: '生产用地',
    id: TabIds[0],
    icon: 'mdi:land-fields',
    active: false,
    key: 'landUseStatus'
  },
  {
    type: 5,
    name: '选房择址',
    id: TabIds[1],
    icon: 'mdi:house-clock-outline',
    active: false,
    key: 'chooseHouseStatus'
  },
  {
    type: 5,
    name: '坟墓择址',
    id: TabIds[2],
    icon: 'tabler:grave-2',
    active: false,
    key: 'chooseGraveStatus'
  },

  // 腾空过渡
  {
    type: 8,
    name: '房屋腾空',
    id: TabIds[0],
    icon: 'material-symbols:emoji-transportation',
    active: false,
    key: 'houseSoarStatus'
  },
  {
    type: 8,
    name: '土地腾让',
    id: TabIds[1],
    icon: 'mdi:land-fields',
    active: false,
    key: 'landSoarStatus'
  },
  {
    type: 8,
    name: '过渡安置',
    id: TabIds[2],
    icon: 'ic:baseline-cabin',
    active: false,
    key: 'excessStatus'
  },

  // 生产安置
  {
    type: 10,
    name: '农业安置',
    id: TabIds[0],
    icon: 'maki:wetland',
    active: false,
    key: 'agricultureArrangementStatus'
  },
  {
    type: 10,
    name: '养老保险',
    id: TabIds[1],
    icon: 'fa6-solid:hospital-user',
    active: false,
    key: 'retirementStatus'
  },
  {
    type: 10,
    name: '自谋职业',
    id: TabIds[2],
    icon: 'pepicons-print:people-off',
    active: false,
    key: 'selfEmploymentStatus'
  }
]

// 企业 第一层 tab
export const EnterpriseTabs = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 1,
    name: '企业建卡'
  },
  {
    id: 2,
    name: '腾空'
  },
  {
    id: 3,
    name: '动迁协议'
  },
  {
    id: 4,
    name: '相关手续'
  }
]

// 企业 tab 第二层
export const EnterpriseSubTabs = [
  // 资产评估
  {
    type: 0,
    name: '房屋附属物评估报告',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false,
    key: 'appendageStatus'
  },
  {
    type: 0,
    name: '土地附着物评估报告',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false,
    key: 'landStatus'
  },
  {
    type: 0,
    name: '设施设备评估报告',
    id: TabIds[2],
    icon: 'fluent-mdl2:product-variant',
    active: false,
    key: 'deviceStatus'
  },

  // 腾空
  {
    type: 2,
    name: '房屋腾空',
    id: TabIds[0],
    icon: 'material-symbols:emoji-transportation',
    active: false,
    key: 'houseSoarStatus'
  },
  {
    type: 2,
    name: '土地腾让',
    id: TabIds[1],
    icon: 'mdi:land-fields',
    active: false,
    key: 'landSoarStatus'
  }
]

// 个体户 第一层 tab
export const IndividualTabs = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 1,
    name: '个体户建卡'
  },
  {
    id: 2,
    name: '腾空'
  },
  {
    id: 3,
    name: '动迁协议'
  },
  {
    id: 4,
    name: '相关手续'
  }
]

// 个体户 tab 第二层
export const IndividualSubTabs = [
  // 资产评估
  {
    type: 0,
    name: '房屋附属物评估报告',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false,
    key: 'appendageStatus'
  },
  {
    type: 0,
    name: '土地附着物评估报告',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false,
    key: 'landStatus'
  },
  {
    type: 0,
    name: '设施设备评估报告',
    id: TabIds[2],
    icon: 'fluent-mdl2:product-variant',
    active: false,
    key: 'deviceStatus'
  },

  // 腾空
  {
    type: 2,
    name: '房屋腾空',
    id: TabIds[0],
    icon: 'material-symbols:emoji-transportation',
    active: false,
    key: 'houseSoarStatus'
  },
  {
    type: 2,
    name: '土地腾让',
    id: TabIds[1],
    icon: 'mdi:land-fields',
    active: false,
    key: 'landSoarStatus'
  }
]

export const VillageTabsgrave = [
  {
    id: 5,
    name: '村集体坟墓择址'
  }
]
// 村集体 第一层 tab
export const VillageTabs = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 1,
    name: '村集体建卡'
  },
  {
    id: 2,
    name: '腾空'
  },
  {
    id: 3,
    name: '动迁协议'
  },
  {
    id: 4,
    name: '集体资产处置方法'
  }
]

// 村集体 tab 第二层
export const VillageSubTabs = [
  // 资产评估
  {
    type: 0,
    name: '房屋附属物评估报告',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false,
    key: 'appendageStatus'
  },
  {
    type: 0,
    name: '土地附着物评估报告',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false,
    key: 'landStatus'
  },
  {
    type: 0,
    name: '小型专项及农副业设施评估报告',
    id: TabIds[2],
    icon: 'fluent-mdl2:product-variant',
    active: false,
    key: 'specialStatus'
  }
]
// 只征地不搬迁
export const LandNoMoveTabs = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 1,
    name: '生产安置确认'
  },
  {
    id: 2,
    name: '土地腾让'
  },
  {
    id: 3,
    name: '补偿卡'
  },
  {
    id: 4,
    name: '征地协议'
  },
  {
    id: 5,
    name: '生产安置办理'
  }
]
export const LandNoMoveTabss = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 2,
    name: '土地腾让'
  },
  {
    id: 3,
    name: '补偿卡'
  },
  {
    id: 4,
    name: '征地协议'
  }
]
export const LandNoMoveSubTabs = [
  {
    type: 5,
    name: '养老保险',
    id: TabIds[1],
    icon: 'fa6-solid:hospital-user',
    active: false,
    key: 'retirementStatus'
  },
  {
    type: 5,
    name: '自谋职业',
    id: TabIds[2],
    icon: 'pepicons-print:people-off',
    active: false,
    key: 'selfEmploymentStatus'
  }
]
// 淹没区，建设区，影响区，重叠区
export const locationTypes = [
  {
    label: '淹没区',
    value: 'SubmergedArea'
  },
  {
    label: '建设区',
    value: 'ConstructionArea'
  },
  {
    label: '影响区',
    value: 'InfluenceArea'
  },
  {
    label: '重叠区',
    value: 'OverlappingArea'
  }
]

// 填报状态
export const FillStatus = {
  Fill: 'Fill',
  UnFill: 'UnFill'
}

// 填报状态枚举
export const FillStatusEnums = [
  {
    label: '已填报',
    value: 'Fill'
  },
  {
    label: '未填报',
    value: 'UnFill'
  }
]

// 生产安置方式
// 农业安置、社保安置、一次性补偿、有土安置、基本生活保障安置、其他安置方式
export const ProductionPlaceWay = [
  {
    label: '农业安置',
    value: '农业安置'
  },
  {
    label: '社保安置',
    value: '社保安置'
  },
  {
    label: '一次性补偿',
    value: '一次性补偿'
  },
  {
    label: '有土安置',
    value: '有土安置'
  },
  {
    label: '基本生活保障安置',
    value: '基本生活保障安置'
  },
  {
    label: '其他安置方式',
    value: '其他安置方式'
  }
]

// 宅基地安置区块
export const resettleArea = getSettleAddressList
export const resettleAreaFlat = getSettleAddressListFlat

// 公寓安置地块
export const apartmentArea = [
  {
    id: '6',
    name: '曙光安置区'
  },
  {
    id: '2',
    name: '曙光安置区'
  },
  {
    id: '26',
    name: '镜岭集镇安置区'
  },
  {
    id: '7',
    name: '镜岭集镇安置区'
  }
]

export enum HouseType {
  homestead = 'homestead',
  flat = 'flat',
  oneself = 'oneself',
  concentrate = 'concentrate'
}

export const resettleHouseType = [
  {
    id: 'homestead',
    name: '宅基地',
    disabled: false
  },
  {
    id: 'flat',
    name: '公寓房',
    disabled: false
  },
  {
    id: 'oneself',
    name: '自谋出路',
    disabled: false
  },
  {
    id: 'concentrate',
    name: '集中供养',
    disabled: false
  }
]

// 宅基地面积
export const homesteadAreaSize = [
  {
    id: '1',
    name: 48,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 1,
    isSelected: false
  },
  {
    id: '2',
    name: 72,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 3,
    isSelected: false
  },
  {
    id: '3',
    name: 96,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 5,
    isSelected: false
  },
  {
    id: '4',
    name: 120,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 7,
    isSelected: false
  },
  {
    id: '5',
    name: 144,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 9,
    isSelected: false
  },
  {
    id: '6',
    name: 168,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 11,
    isSelected: false
  }
]

// 公寓
export const apartmentAreaSize = [
  {
    id: '1',
    name: 70,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '2',
    name: 90,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '3',
    name: 110,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '4',
    name: 130,
    unit: 'm²',
    isSelected: false,
    num: 0
  }
]

// 自谋出路
export const selfResettleData = [
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '房屋补偿补助款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '地面青苗附着物补偿款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '宅基地补偿款 (超面积)',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'subsidy',
    title: '补助费',
    subProject: '建房补助费',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'subsidy',
    title: '补助费',
    subProject: '搬迁补助费',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'subsidy',
    title: '补助费',
    subProject: '过渡期生产生活补助款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '签订动迁安置协议奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '房屋腾空奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '启动建房奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '完成建房奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '搬迁入驻奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  }
]

// 动迁安置类型
export const RelocationResettleTypes = {
  HouseSoar: 'HouseSoar', // 房屋腾空确认单
  GreenSoar: 'GreenSoar', // 青苗腾空确认单
  ChooseHouse: 'ChooseHouse', // 择房确认单
  ChooseAddress: 'ChooseAddress', // 择址确认单
  BuildHouse: 'BuildHouse', // 建房告知单
  ChooseHouseDelive: 'ChooseHouseDelive', // 择房交付告知单
  ChooseGraveAddress: 'ChooseGraveAddress', // 坟墓择址确认单
  MigrateGrave: 'MigrateGrave', // 坟墓迁移告知单
  ProLandDelive: 'ProLandDelive', // 生产用地交付告知单
  SocialSecurity: 'SocialSecurity', // 社保缴费确认单
  ChooseHouseCheck: 'ChooseHouseCheck' // 自建房验收告知单
}
