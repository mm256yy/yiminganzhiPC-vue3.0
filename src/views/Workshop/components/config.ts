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

// yes or no
export const yesAndNoEnums = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]

// 上报状态
export const ReportStatusEnums = [
  {
    label: '已上报',
    value: 'ReportSucceed'
  },
  {
    label: '未上报',
    value: 'UnReport'
  }
]

export enum SurveyStatusEnum {
  Survey = 'survey', // 实物调查
  Review = 'review' // 实物复核
}
