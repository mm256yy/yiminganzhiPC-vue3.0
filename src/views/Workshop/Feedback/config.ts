export const FeedbackStage = [
  {
    value: '1',
    label: '资格认定'
  },
  {
    value: '2',
    label: '资产评估'
  },
  {
    value: '3',
    label: '模拟安置'
  },
  {
    value: '4',
    label: '安置确认'
  },
  {
    value: '5',
    label: '择址确认'
  },
  {
    value: '6',
    label: '协议签订'
  },
  {
    value: '7',
    label: '移民建卡'
  },
  {
    value: '8',
    label: '腾空过渡'
  },
  {
    value: '9',
    label: '搬迁安置'
  },
  {
    value: '10',
    label: '生产安置'
  },
  {
    value: '11',
    label: '相关手续'
  },
  {
    value: '12',
    label: '集体资产处置方法'
  }
]

// 拿到阶段文字
export const getStateLabel = (value: string) => {
  return FeedbackStage.find((item) => item.value === value)?.label
}

// 拿到阶段的值
export const getStateValue = (label: string) => {
  return FeedbackStage.find((item) => item.label === label)?.value
}

// 1资格认定 2资产评估 3安置确认 4择址确认 5腾空过度 6动迁协议 7搬迁安置 8生产安置
