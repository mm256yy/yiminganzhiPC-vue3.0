import request from '@/config/axios'
import { FruitwoodDtoType, FruitwoodParamsType } from './immigrantFacilities-type'

/**
 * 查询果木信息列表
 */

export const getFruitwoodListApi = (
  query: Partial<FruitwoodParamsType>
): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.get({ url: '/immigrantFacilities', params: query })
}

/**
 * 保存
 */
export const saveFruitwoodListApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.post({ url: '/immigrantFacilities/create', data })
}

/**
 * 删除
 */
export const deleteDevicel = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantFacilities/delete/${id}` })
}

export const updateApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.post({ url: '/immigrantFacilities/update', data })
}
