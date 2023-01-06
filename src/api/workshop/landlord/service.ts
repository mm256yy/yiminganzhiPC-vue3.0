import request from '@/config/axios'
import { LandlordDtoType } from './types'

/**
 * 查询居民户信息列表
 */
export const getLandlordListApi = (
  query: Partial<LandlordDtoType>
): Promise<TableResponse<LandlordDtoType>> => {
  return request.get({ url: '/peasantHousehold', params: query })
}

/**
 * 新增居民户信息
 */
export const addLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/create', data })
}

/**
 * 更新居民户信息
 */
export const updateLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/update', data })
}

/**
 * 删除居民户信息
 */
export const delLandlordByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/peasantHousehold/delete/${id}` })
}

/**
 * 查询单个居民户信息
 */
export const getLandlordByIdApi = (id: number | string): Promise<LandlordDtoType> => {
  return request.get({ url: `/peasantHousehold/${id}` })
}

/**
 * 模版下载
 */
export const downLandlordTemplateApi = (name: string): Promise<any> => {
  return request.get({ url: `/import_template/${name}` })
}

/**
 * 查询居民户头部信息
 */
export const getLandlordHeadApi = (): Promise<any> => {
  return request.get({ url: `/peasantHousehold/head` })
}

/**
 * 上报居民户信息
 */
export const reportLandlordApi = (id) => {
  return request.post({
    url: `/peasantHousehold/report/${id}`
  })
}
