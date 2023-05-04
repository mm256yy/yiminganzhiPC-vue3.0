import { SurveyStatusEnum } from '@/views/Workshop/components/config'

// 全局变量 实时更新
export const globalData: {
  currentSurveyStatus: SurveyStatusEnum
} = {
  currentSurveyStatus: SurveyStatusEnum.Survey // 当前采集的阶段状态
}
