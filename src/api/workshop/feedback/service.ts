import request from '@/config/axios'
import { FeedBackType } from './types'

/**
 * 查询反馈信息列表
 */
export const getFeedBackListApi = (
  query: Partial<FeedBackType>
): Promise<TableResponse<FeedBackType>> => {
  return request.get({
    url: '/feedback',
    params: {
      ...query
    }
  })
}

/**
 * 保存反馈信息
 */
export const saveFeedBackApi = (data: FeedBackType): Promise<FeedBackType> => {
  return request.post({
    url: '/feedback/save',
    data
  })
}

/**
 * 查询单个反馈信息
 */
export const getFeedBackByIdApi = (id: number): Promise<FeedBackType> => {
  return request.get({ url: `/feedback/${id}` })
}

/**
 * 保存问题反馈信息
 */
export const saveFeedbackMessageApi = (data: any): Promise<FeedBackType> => {
  return request.post({
    url: `/feedbackMessage/save`,
    data
  })
}

/**
 * 问题反馈详情
 */
export const getFeedbackMessageByIdApi = (feedbackId: number): Promise<FeedBackType> => {
  return request.get({
    url: '/feedbackMessage/findByFeedbackId',
    params: {
      feedbackId
    }
  })
}
