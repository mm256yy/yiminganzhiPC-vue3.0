import request from '@/config/axios'
import { VillageDtoType } from './types'

/**
 * 查询自然村列表
 */
export const getVillageListApi = (
  query: Partial<VillageDtoType>
): Promise<TableResponse<VillageDtoType>> => {
  return request.get({ url: '/village', params: query })
}

/**
 * 新增自然村
 */
export const addVillageApi = (data: VillageDtoType): Promise<VillageDtoType> => {
  return request.post({ url: '/village/create', data })
}

/**
 * 更新自然村
 */
export const updateVillageApi = (data: VillageDtoType): Promise<VillageDtoType> => {
  return request.post({ url: '/village/update', data })
}

/**
 * 删除自然村
 */
export const delVillageByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/village/delete/${id}` })
}

/**
 * 查询单个自然村
 */
export const getVillageByIdApi = (id: number): Promise<VillageDtoType> => {
  return request.get({ url: `/village/${id}` })
}
