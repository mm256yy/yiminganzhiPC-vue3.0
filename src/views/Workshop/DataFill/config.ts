// tab 唯一标识
export const ReportTabIds = [1, 2, 3, 4, 5, 6, 7, 8]

// 实物采集 tab 数组
export const ReportTabs = [
  {
    name: '人口信息',
    id: ReportTabIds[0],
    icon: 'mdi:user-details',
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
    name: '坟墓调查信息',
    id: ReportTabIds[4],
    icon: 'tabler:grave-2',
    active: false
  },
  {
    name: '家庭收入情况信息',
    id: ReportTabIds[5],
    icon: 'ri:exchange-cny-fill',
    active: false
  },
  {
    name: '安置意愿调查信息',
    id: ReportTabIds[6],
    icon: 'bxs:smile',
    active: false
  },

  {
    name: '附件上传',
    id: ReportTabIds[7],
    icon: 'material-symbols:file-present-rounded',
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
    id: 1,
    name: '实物采集'
  }
  // {
  //   id: 2,
  //   name: '实物复核'
  // }
]

// 填报状态
export const ReportStatus = {
  ReportSucceed: 'ReportSucceed',
  UnReport: 'UnReport'
}

// 签字状态
export const SignStatus = {
  SignSucceed: 'SignSucceed',
  UnSign: 'UnSign'
}

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
