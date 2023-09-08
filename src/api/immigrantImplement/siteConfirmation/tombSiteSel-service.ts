import request from '@/config/axios'
import { GraveType } from './tombSiteSel-types'

/**
 * 获取坟墓择址列表
 * @param query 查询条件
 * @returns Object 接口请求后返回对象
 */
export const getGraveListApi = (params: any) => {
  return request.get({ url: '/immigrantGrave', params })
}

/**
 * 保存多个坟墓择址数据
 * @param data 表单提交数据
 * @returns
 */
export const saveGraveApi = (data: any): Promise<TableResponse<GraveType>> => {
  return request.post({ url: '/immigrantGrave/createAll', data })
}
