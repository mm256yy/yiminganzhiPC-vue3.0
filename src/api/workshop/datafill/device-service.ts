import request from '@/config/axios'
import { FruitwoodDtoType, FruitwoodParamsType } from './device-types'

/**
 * 查询果木信息列表
 */

export const getFruitwoodListApi = (
  query: Partial<FruitwoodParamsType>
): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.get({ url: '/immigrantEquipment', params: query })
}

/**
 * 保存
 */
export const saveFruitwoodListApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.post({ url: '/immigrantEquipment/createAll', data })
}

/**
 * 删除
 */
export const deleteDevicel = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantEquipment/delete/${id}` })
}
