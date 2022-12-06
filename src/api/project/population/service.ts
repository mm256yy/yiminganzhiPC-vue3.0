import request from '@/config/axios'
import { VillageDtoType } from './types'

/**
 * 查询人口信息列表
 */
export const getVillageListApi = (
  query: Partial<VillageDtoType>
): Promise<TableResponse<VillageDtoType>> => {
  return request.get({ url: '/village', params: query })
}

/**
 * 新增人口信息
 */
export const addVillageApi = (data: VillageDtoType): Promise<VillageDtoType> => {
  return request.post({ url: '/village/create', data })
}

/**
 * 更新人口信息
 */
export const updateVillageApi = (data: VillageDtoType): Promise<VillageDtoType> => {
  return request.post({ url: '/village/update', data })
}

/**
 * 删除人口信息
 */
export const delVillageByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/village/delete/${id}` })
}

/**
 * 查询单个人口信息
 */
export const getVillageByIdApi = (id: number): Promise<VillageDtoType> => {
  return request.get({ url: `/village/${id}` })
}
