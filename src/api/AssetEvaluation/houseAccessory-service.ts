import request from '@/config/axios'
import { HouseAccessoryDtoType } from './houseAccessory-types'

/**
 * 获取房屋附属设施评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getHouseAccessoryListApi = (
  query: Partial<HouseAccessoryDtoType>
): Promise<TableResponse<HouseAccessoryDtoType>> => {
  return request.get({ url: '/immigrant_appendant', params: query })
}

/**
 * 保存多个房屋附属设施评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveHouseAccessoryApi = (data: any): Promise<TableResponse<HouseAccessoryDtoType>> => {
  return request.post({ url: '/immigrant_appendant/createAll', data })
}

/**
 * 删除单条房屋附属设施评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteHouseAccessoryApi = (id: any): Promise<TableResponse<HouseAccessoryDtoType>> => {
  return request.post({ url: `/immigrant_appendant/delete/${id}` })
}
