import request from '@/config/axios'
import { LandlordDtoType } from './types'

/**
 * 查询农户信息列表
 */
export const getLandlordListApi = (
  query: Partial<LandlordDtoType>
): Promise<TableResponse<LandlordDtoType>> => {
  return request.get({ url: '/peasantHousehold', params: query })
}

/**
 * 新增农户信息
 */
export const addLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/create', data })
}

/**
 * 更新农户信息
 */
export const updateLandlordApi = (data: LandlordDtoType): Promise<LandlordDtoType> => {
  return request.post({ url: '/peasantHousehold/update', data })
}

/**
 * 删除农户信息
 */
export const delLandlordByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/peasantHousehold/delete/${id}` })
}

/**
 * 查询单个农户信息
 */
export const getLandlordByIdApi = (id: number): Promise<LandlordDtoType> => {
  return request.get({ url: `/peasantHousehold/${id}` })
}

/**
 * 模版下载
 */
export const downLandlordTemplateApi = (): Promise<LandlordDtoType> => {
  return request.get({ url: `/import_template/demographic` })
}
