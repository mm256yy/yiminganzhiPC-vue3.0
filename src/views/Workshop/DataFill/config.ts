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
    name: '家庭收入情况信息',
    id: ReportTabIds[4],
    icon: 'ri:exchange-cny-fill',
    active: false
  },
  {
    name: '安置意愿调查信息',
    id: ReportTabIds[5],
    icon: 'bxs:smile',
    active: false
  },
  {
    name: '坟墓调查信息',
    id: ReportTabIds[6],
    icon: 'tabler:grave-2',
    active: false
  },
  {
    name: '附件上传',
    id: ReportTabIds[7],
    icon: 'material-symbols:file-present-rounded',
    active: false
  }
]

export const FlowTabs = [
  {
    id: 1,
    name: '实物采集'
  }
]

export const ReportStatus = {
  ReportSucceed: 'ReportSucceed',
  UnReport: 'UnReport'
}
