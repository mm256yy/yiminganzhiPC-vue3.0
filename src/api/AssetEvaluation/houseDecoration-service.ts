import request from '@/config/axios'
import { HouseDecorationDtoType } from './houseDecoration-types'

/**
 * 获取房屋装修评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getHouseDecorationListApi = (
  query: Partial<HouseDecorationDtoType>
): Promise<TableResponse<HouseDecorationDtoType>> => {
  return request.get({ url: '/assetHouseFitUp', params: query })
}

/**
 * 保存多个房屋装修评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveHouseDecorationApi = (
  data: any
): Promise<TableResponse<HouseDecorationDtoType>> => {
  return request.post({ url: '/assetHouseFitUp/createAll', data })
}

/**
 * 删除单条房屋装修评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteHouseDecorationApi = (
  id: any
): Promise<TableResponse<HouseDecorationDtoType>> => {
  return request.post({ url: `/assetHouseFitUp/delete/${id}` })
}
