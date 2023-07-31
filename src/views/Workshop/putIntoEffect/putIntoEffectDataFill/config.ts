// tab 唯一标识
export const ReportTabIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// 实物采集 tab 数组
export const ReportTabs = [
  // 资产评估
  {
    type: 0,
    name: '房屋主体评估',
    id: ReportTabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    type: 0,
    name: '房屋装修评估',
    id: ReportTabIds[1],
    icon: 'mdi:house-city',
    active: false
  },
  {
    type: 0,
    name: '房屋附属设施评估',
    id: ReportTabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    type: 0,
    name: '零星林（果）木评估',
    id: ReportTabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    type: 0,
    name: '土地基本情况评估',
    id: ReportTabIds[4],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    type: 0,
    name: '土地青苗及附着物评估',
    id: ReportTabIds[5],
    icon: 'fluent-emoji-high-contrast:sheaf-of-rice',
    active: false
  },
  {
    type: 0,
    name: '坟墓评估',
    id: ReportTabIds[6],
    icon: 'tabler:grave-2',
    active: false
  },
  // 资格认定
  {
    type: 1,
    name: '人口核定',
    id: ReportTabIds[0],
    icon: 'mdi:user-details',
    active: false
  },
  {
    type: 1,
    name: '房屋确权',
    id: ReportTabIds[1],
    icon: 'clarity:house-solid',
    active: false
  },
  // 安置确认

  {
    type: 2,
    name: '搬迁安置',
    id: ReportTabIds[0],
    icon: 'mdi:lorry',
    active: false
  },
  {
    type: 2,
    name: '生产安置',
    id: ReportTabIds[1],
    icon: 'pixelarticons:buildings',
    active: false
  },
  {
    type: 2,
    name: '坟墓安置',
    id: ReportTabIds[2],
    icon: 'tabler:grave-2',
    active: false
  },
  // 动迁安置
  {
    type: 5,
    name: '房屋腾空确认单',
    id: ReportTabIds[0],
    icon: 'material-symbols:emoji-transportation',
    active: false
  },
  {
    type: 5,
    name: '青苗腾空确认单',
    id: ReportTabIds[1],
    icon: 'icon-park-outline:sapling',
    active: false
  },
  {
    type: 5,
    name: '择房确认单',
    id: ReportTabIds[2],
    icon: 'mdi:house-clock-outline',
    active: false
  },
  {
    type: 5,
    name: '择址确认单',
    id: ReportTabIds[3],
    icon: 'mdi:selection-multiple-marker',
    active: false
  },
  {
    type: 5,
    name: '建房告知单',
    id: ReportTabIds[4],
    icon: 'mdi:notice-board',
    active: false
  },
  {
    type: 5,
    name: '择房交付告知单',
    id: ReportTabIds[5],
    icon: 'mdi:house-city-outline',
    active: false
  },
  {
    type: 5,
    name: '坟墓择址确认单',
    id: ReportTabIds[6],
    icon: 'tabler:grave-2',
    active: false
  },
  {
    type: 5,
    name: '坟墓迁移告知单',
    id: ReportTabIds[7],
    icon: 'tabler:grave-2',
    active: false
  },
  {
    type: 5,
    name: '生产用地交付告知单',
    id: ReportTabIds[8],
    icon: 'mdi:land-fields',
    active: false
  },
  {
    type: 5,
    name: '社保缴费确认单',
    id: ReportTabIds[9],
    icon: 'mdi:user-details',
    active: false
  },
  {
    type: 5,
    name: '自建房验收告知单',
    id: ReportTabIds[10],
    icon: 'material-symbols:fact-check-outline-rounded',
    active: false
  },
  {
    type: 5,
    name: '安置进度管理',
    id: ReportTabIds[11],
    icon: 'pixelarticons:buildings',
    active: false
  },

  // 过渡腾空
  {
    type: 7,
    name: '房屋腾空',
    id: ReportTabIds[12],
    icon: 'tabler:grave-2',
    active: false
  },
  // 过渡腾空
  {
    type: 7,
    name: '土地腾空',
    id: ReportTabIds[13],
    icon: 'tabler:grave-2',
    active: false
  },
  // 过渡腾空
  {
    type: 7,
    name: '过渡安置',
    id: ReportTabIds[14],
    icon: 'tabler:grave-2',
    active: false
  }
]

export const EnterpriseTabs = [
  {
    name: '企业基本情况',
    id: ReportTabIds[0],
    icon: 'bi:building-fill-exclamation',
    active: false
  },
  {
    name: '房屋信息',
    id: ReportTabIds[1],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '附属物信息',
    id: ReportTabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星(林)果木信息',
    id: ReportTabIds[3],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '设施设备信息',
    id: ReportTabIds[4],
    icon: 'fluent-mdl2:product-variant',
    active: false
  },
  {
    name: '经营现状信息',
    id: ReportTabIds[5],
    icon: 'bxs:smile',
    active: false
  },
  {
    name: '附件上传',
    id: ReportTabIds[6],
    icon: 'material-symbols:file-present-rounded',
    active: false
  }
]

export const IndividualBTabs = [
  {
    name: '个体工商基本情况',
    id: ReportTabIds[0],
    icon: 'material-symbols:add-business-outline-rounded',
    active: false
  },
  {
    name: '房屋信息',
    id: ReportTabIds[1],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '零星(林)果木信息',
    id: ReportTabIds[2],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '附属物信息',
    id: ReportTabIds[3],
    icon: 'bi:device-hdd-fill',
    active: false
  },

  {
    name: '设施设备信息',
    id: ReportTabIds[4],
    icon: 'fluent-mdl2:product-variant',
    active: false
  },
  {
    name: '附件上传',
    id: ReportTabIds[5],
    icon: 'material-symbols:file-present-rounded',
    active: false
  }
]

export const villageInfoCTabs = [
  {
    name: '房屋信息',
    id: ReportTabIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '零星(林)果木信息',
    id: ReportTabIds[1],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '附属物信息',
    id: ReportTabIds[2],
    icon: 'bi:device-hdd-fill',
    active: false
  },

  {
    name: '农村小型专项及农副业设施信息',
    id: ReportTabIds[3],
    icon: 'fluent-mdl2:product-variant',
    active: false
  },
  {
    name: '坟墓调查信息',
    id: ReportTabIds[4],
    icon: 'tabler:grave-2',
    active: false
  },
  {
    name: '附件上传',
    id: ReportTabIds[5],
    icon: 'material-symbols:file-present-rounded',
    active: false
  }
]

export const FlowTabs = [
  {
    id: 0,
    name: '资产评估'
  },
  {
    id: 1,
    name: '资格认定'
  },
  {
    id: 2,
    name: '安置确认'
  },
  {
    id: 3,
    name: '协议签订'
  },
  {
    id: 4,
    name: '移民建卡'
  },
  {
    id: 5,
    name: '动迁安置'
  },
  {
    id: 6,
    name: '模拟安置'
  },
  {
    id: 7,
    name: '过渡安置'
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

// 生产安置方式
export const ProductionResettleWay = [
  {
    id: '1',
    name: '农业安置',
    disabled: false
  },
  {
    id: '2',
    name: '养老保险',
    disabled: false
  },
  {
    id: '3',
    name: '自谋职业',
    disabled: false
  }
]
