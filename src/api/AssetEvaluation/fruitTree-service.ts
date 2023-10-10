import request from '@/config/axios'
import { FruitTreeDtoType } from './fruitTree-types'

/**
 * 获取零星林（果）木评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getFruitTreeListApi = (
  query: Partial<FruitTreeDtoType>
): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.get({ url: '/immigrant_tree', params: query })
}

/**
 * 保存多个零星林（果）木评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveFruitTreeApi = (data: any): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: '/immigrant_tree/createAll', data })
}

/**
 * 删除单条零星林（果）木评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteFruitTreeApi = (id: any): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: `/immigrant_tree/delete/${id}` })
}
