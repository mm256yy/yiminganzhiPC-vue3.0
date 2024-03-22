import request from '@/config/axios'
// import { StatisticsDtoType } from './home-service'

/**
 * 获取实施统计
 * @returns
 */
export const getImplementationStatistics = () => {
  return request.get({ url: '/workbench/implementation/statistics' })
}

/**
 * 获取实施Top排行组
 * @returns
 */
export const getImplementationTopGroup = (stageTag: string) => {
  return request.get({ url: `/workbench/implementation/top15?stageTag=${stageTag}` })
}

/**
 * 获取评估统计
 * @returns
 */
export const getEvaluationStatistics = () => {
  return request.get({ url: '/workbench/evaluator/statistics' })
}

/**
 * 获取消息反馈
 * @returns
 */
export const getMessageFeedback = () => {
  return request.get({ url: '/workbench/feedback' })
}

/**
 * 获取消息通知
 * @returns
 */
export const getNotify = () => {
  return request.get({ url: '/notify' })
}

/**
 * 获取评估统计
 * @returns
 */
export const getEvaluatorStatistics = () => {
  return request.get({ url: '/workbench/evaluator/statistics' })
}

/**
 * 获取评估Top排行组
 * @returns
 */
export const getEvaluatorTopGroup = () => {
  return request.get({ url: `/workbench/evaluator/top5` })
}
