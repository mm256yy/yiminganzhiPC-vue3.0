import { ReportTypes } from '@/views/Workshop/Home/type'
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

// 面包屑标题列表
export const breadcrumbTitles = ['一户一档', '企（事）业单位', '个体户', '村集体', '专业项目']

// 一户一档 tabs
export const houseHoldTabs = [
  {
    id: 1,
    name: '身份/资产'
  },
  {
    id: 2,
    name: '协议/确认单'
  },
  {
    id: 3,
    name: '图片影像'
  },
  {
    id: 4,
    name: '其它档案'
  }
]

// 通用 tabs
export const commonTabs = [
  {
    id: 1,
    name: '基本信息'
  },
  {
    id: 2,
    name: '协议/手续'
  },
  {
    id: 3,
    name: '图片影像'
  },
  {
    id: 4,
    name: '其它档案'
  }
]

// 专业项目 tabs
export const professionTabs = [
  {
    id: 1,
    name: '协议/手续'
  },
  {
    id: 2,
    name: '报告批文'
  },
  {
    id: 3,
    name: '图片影像'
  },
  {
    id: 4,
    name: '其它档案'
  }
]

// 报告及批文 tabs
export const reportApprovalTabs = [
  {
    id: 1,
    name: '报告归集'
  },
  {
    id: 2,
    name: '其他报告'
  }
]

export const reportList = [
  {
    name: '调查大纲',
    url: `/workshop/report?type=${ReportTypes.Outline}&title=调查大纲`,
    type: 'Outline',
    checked: false
  },
  {
    name: '调查报告',
    url: `/workshop/report?type=${ReportTypes.Report}&title=调查报告`,
    type: 'Report',
    checked: false
  },
  {
    name: '规划大纲',
    url: `/workshop/report?type=${ReportTypes.PlanningOutline}&title=规划大纲`,
    type: 'PlanningOutline',
    checked: false
  },
  {
    name: '规划报告',
    url: `/workshop/report?type=${ReportTypes.PlanningReport}&title=规划报告`,
    type: 'PlanningReport',
    checked: false
  },
  {
    name: '设计变更报告',
    url: `/workshop/changeReport?type=${ReportTypes.Change}&title=设计变更报告`,
    type: 'Change',
    checked: false
  },
  {
    name: '导截流验收设计报告',
    url: `/workshop/report?type=${ReportTypes.Models}&title=导截流验收设计报告`,
    type: 'Models',
    checked: false
  },
  {
    name: '蓄水验收设计报告',
    url: `/workshop/report?type=${ReportTypes.WaterStorage}&title=蓄水验收设计报告`,
    type: 'WaterStorage',
    checked: false
  },
  {
    name: '竣工验收设计报告',
    url: `/workshop/report?type=${ReportTypes.Completion}&title=竣工验收设计报告`,
    type: 'Completion',
    checked: false
  }
]

export const otherReportList = [
  {
    name: '社稳报告',
    url: '/workshop/report?type=${ReportTypes.SocialStability}&title=社稳报告',
    type: 'SocialStability',
    checked: false
  },
  {
    name: '地灾评估',
    url: '/workshop/report?type=${ReportTypes.Disaster}&title=地灾评估',
    type: 'Disaster',
    checked: false
  },
  {
    name: '安置点规划设计',
    url: '/workshop/report?type=${ReportTypes.Site}&title=安置点规划设计',
    type: 'Site',
    checked: false
  },
  {
    name: '企(事)业单位',
    url: '/workshop/report?type=${ReportTypes.Enterprise}&title=企事业单位',
    type: 'Enterprise',
    checked: false
  },
  {
    name: '专业项目',
    url: '/workshop/professionalReport?type=${ReportTypes.ProfessionalProject}&title=专业项目',
    type: 'ProfessionalProject',
    checked: false
  },
  {
    name: '库底清理',
    url: '/workshop/professionalReport?type=${ReportTypes.Clean}&title=库底清理',
    type: 'Clean',
    checked: false
  },
  {
    name: '土地报批',
    url: '/workshop/report?type=${ReportTypes.Land}&title=土地报批',
    type: 'Land',
    checked: false
  },
  {
    name: '林地可研',
    url: '/workshop/report?type=${ReportTypes.Woodland}&title=林地可研',
    type: 'Woodland',
    checked: false
  },
  {
    name: '其他',
    url: '/workshop/report?type=${ReportTypes.Other}&title=其他',
    type: 'Other',
    checked: false
  }
]
