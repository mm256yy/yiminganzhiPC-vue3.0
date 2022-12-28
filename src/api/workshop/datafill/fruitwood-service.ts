import request from '@/config/axios'
import { FruitwoodDtoType } from './fruitwood-types'

/**
 * 查询果木信息列表
 */

export const getFruitwoodListApi = (
  query: Partial<FruitwoodDtoType>
): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.get({ url: '/immigrant_tree', params: query })
}

/**
 * 保存
 */
export const postFruitwoodListApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.post({ url: '/immigrant_tree/createAll', data })
}
