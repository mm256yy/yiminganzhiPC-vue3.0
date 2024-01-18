import request from '@/config/axios'
import { PolicyDtoType } from './types'

/**
 * 查询消息列表
 */
export const getNotifyApi = (
  query: Partial<PolicyDtoType>
): Promise<TableResponse<PolicyDtoType>> => {
  return request.get({ url: '/notify', params: query })
}

/**
 * 新增消息
 */
export const addNotifyApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/notify/save', data })
}

/**
 * 更新消息
 */
export const updateNotifyApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/notify/update', data })
}

/**
 * 删除消息
 */
export const delNotifyByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/notify/delete/${id}` })
}

/**
 * 查询单个消息
 */
export const getNotifyIdApi = (id: number): Promise<PolicyDtoType> => {
  return request.get({ url: `/notify/${id}` })
}
