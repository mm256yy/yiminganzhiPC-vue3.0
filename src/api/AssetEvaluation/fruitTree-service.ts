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
/**
 * 获取基础设备评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getImmigrantInfrastructure = (
  query: Partial<FruitTreeDtoType>
): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.get({ url: '/immigrantInfrastructure', params: query })
}
/**
 * 获取其他评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getImmigrantOther = (
  query: Partial<FruitTreeDtoType>
): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.get({ url: '/immigrantOther', params: query })
}
/**
 * 保存多个基础设备评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveImmigrantInfrastructure = (
  data: any
): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: '/immigrantInfrastructure/createAll', data })
}
/**
 * 保存多个其他设备评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveImmigrantOther = (data: any): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: '/immigrantOther/createAll', data })
}
/**
 * 删除单条基础设备评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteImmigrantInfrastructure = (
  id: any
): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: `/immigrantInfrastructure/delete/${id}` })
}
/**
 * 删除单条其他设备评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteImmigrantOther = (id: any): Promise<TableResponse<FruitTreeDtoType>> => {
  return request.post({ url: `/immigrantOther/delete/${id}` })
}
