import request from '@/config/axios'
import { MainHouseDtoType } from './mainHouse-types'

/**
 * 获取房屋主体评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getMainHouseListApi = (
  query: Partial<MainHouseDtoType>
): Promise<TableResponse<MainHouseDtoType>> => {
  return request.get({ url: '/immigrant_house', params: query })
}

/**
 * 保存多个房屋主体评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveMainHouseApi = (data: any): Promise<TableResponse<MainHouseDtoType>> => {
  return request.post({ url: '/immigrant_house/createAll', data })
}

/**
 * 删除单条房屋主体评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteMainHouseApi = (id: any): Promise<TableResponse<MainHouseDtoType>> => {
  return request.post({ url: `/immigrant_house/delete/${id}` })
}
