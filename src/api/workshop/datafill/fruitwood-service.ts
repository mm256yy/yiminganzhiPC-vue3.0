import request from '@/config/axios'
import { FruitwoodDtoType, FruitwoodParamsType } from './fruitwood-types'
const id = window.location.href.substring(location.href.lastIndexOf('=') + 1)

/**
 * 查询果木信息列表
 */

export const getFruitwoodListApi = (
  query: Partial<FruitwoodParamsType>
): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.get({ url: '/immigrant_tree', params: query })
}

/**
 * 保存
 */
export const saveFruitwoodListApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  if (id == '2') {
    console.log(id, 'id')
    data.status = 'review'
  }
  return request.post({ url: '/immigrant_tree/createAll', data })
}

export const deleteFruitwoodListApi = (data: any): Promise<TableResponse<FruitwoodDtoType>> => {
  return request.post({ url: `/immigrant_tree/delete/${data}` })
}
