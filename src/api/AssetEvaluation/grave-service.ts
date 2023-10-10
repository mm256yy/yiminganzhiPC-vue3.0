import request from '@/config/axios'
import { GraveDtoType } from './grave-types'

/**
 * 获取坟墓评估列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getGraveListApi = (
  query: Partial<GraveDtoType>
): Promise<TableResponse<GraveDtoType>> => {
  return request.get({ url: '/immigrantGrave', params: query })
}

/**
 * 保存多个坟墓评估数据
 * @param data 表单提交数据
 * @returns
 */
export const saveGraveApi = (data: any): Promise<TableResponse<GraveDtoType>> => {
  return request.post({ url: '/immigrantGrave/createAll', data })
}

/**
 * 删除单条坟墓评估数据
 * @param id 当前被删除的数据 ID
 * @returns
 */
export const deleteGraveApi = (id: any): Promise<TableResponse<GraveDtoType>> => {
  return request.post({ url: `/immigrantGrave/delete/${id}` })
}
