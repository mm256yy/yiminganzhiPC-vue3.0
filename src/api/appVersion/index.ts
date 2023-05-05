import request from '@/config/axios'
import { AppVersionDtoType } from './types'

/**
 * 分页查询版本管理列表
 */
export const listAppVersionApi = (query?: any): Promise<TableResponse<AppVersionDtoType>> => {
  return request.get({ url: '/appVersion', params: { ...query, sort: ['createTime', 'desc'] } })
}

/**
 * 增
 */
export const addAppVersionApi = (data: AppVersionDtoType): Promise<void> => {
  return request.post({ url: '/appVersion/create', data })
}

/**
 * 改
 */
export const updateAppVersionApi = (data: AppVersionDtoType): Promise<void> => {
  return request.post({ url: '/appVersion/update', data })
}

/**
 * 删
 */
export const deleteAppVersionApi = (id: number): Promise<void> => {
  return request.post({ url: `/appVersion/delete/${id}` })
}

/**
 * 查
 */
export const getAppVersionItemApi = (id: number): Promise<AppVersionDtoType> => {
  return request.get({ url: `/appVersion/${id}` })
}
