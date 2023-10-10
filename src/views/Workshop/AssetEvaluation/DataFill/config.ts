// tabs 唯一标识
export const TabIds = [1, 2, 3, 4, 5, 6, 7, 8]

// 居民户资产评估 tabs 列表
export const LandlordTabs = [
  {
    name: '房屋主体评估',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '房屋装修评估',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false
  },
  {
    name: '房屋附属设施评估',
    id: TabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星林（果）木评估',
    id: TabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '土地基本情况评估',
    id: TabIds[4],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    name: '土地青苗及附着物评估',
    id: TabIds[5],
    icon: 'fluent-emoji-high-contrast:sheaf-of-rice',
    active: false
  }
  // {
  //   name: '坟墓评估',
  //   id: TabIds[6],
  //   icon: 'tabler:grave-2',
  //   active: false
  // }
]

// 企业资产评估 tabs 列表
export const EnterpriseTabs = [
  {
    name: '房屋主体评估',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '房屋装修评估',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false
  },
  {
    name: '房屋附属设施评估',
    id: TabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星林（果）木评估',
    id: TabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '土地基本情况评估',
    id: TabIds[4],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    name: '土地青苗及附着物评估',
    id: TabIds[5],
    icon: 'fluent-emoji-high-contrast:sheaf-of-rice',
    active: false
  },
  {
    name: '设备设施评估',
    id: TabIds[6],
    icon: 'fluent-mdl2:product-variant',
    active: false
  }
]

// 个体工商户资产评估 tabs 列表
export const IndividualBTabs = [
  {
    name: '房屋主体评估',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '房屋装修评估',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false
  },
  {
    name: '房屋附属设施评估',
    id: TabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星林（果）木评估',
    id: TabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '土地基本情况评估',
    id: TabIds[4],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    name: '土地青苗及附着物评估',
    id: TabIds[5],
    icon: 'fluent-emoji-high-contrast:sheaf-of-rice',
    active: false
  },
  {
    name: '设备设施评估',
    id: TabIds[6],
    icon: 'fluent-mdl2:product-variant',
    active: false
  }
]

// 村集体资产评估 tabs 列表
export const VillageInfoCTabs = [
  {
    name: '房屋主体评估',
    id: TabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '房屋装修评估',
    id: TabIds[1],
    icon: 'mdi:house-city',
    active: false
  },
  {
    name: '房屋附属设施评估',
    id: TabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星林（果）木评估',
    id: TabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '土地基本情况评估',
    id: TabIds[4],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    name: '土地青苗及附着物评估',
    id: TabIds[5],
    icon: 'fluent-emoji-high-contrast:sheaf-of-rice',
    active: false
  },
  {
    name: '小型专项及农副业设施评估',
    id: TabIds[6],
    icon: 'fluent-mdl2:product-variant',
    active: false
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
