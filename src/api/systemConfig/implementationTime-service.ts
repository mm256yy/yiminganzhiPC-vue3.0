import request from '@/config/axios'
import { ImplementationTimeDtoType } from './implementationTime-types'

/**
 * 获取实施时间配置列表
 * @param query 查询参数
 * @returns
 */
export const getImplementationTimeListApi = (
  query: Partial<ImplementationTimeDtoType>
): Promise<TableResponse<ImplementationTimeDtoType>> => {
  return request.get({
    url: '/scheduleConfig',
    params: query
  })
}

/**
 * 新增/编辑时间配置
 * @param data 表单数据
 * @returns
 */
export const saveImplementationTimeApi = (
  data: ImplementationTimeDtoType
): Promise<ImplementationTimeDtoType> => {
  return request.post({
    url: '/scheduleConfig/save',
    data
  })
}

/**
 * 新增/编辑时间配置 网格管理
 * @param data 表单数据
 * @returns
 */
export const saveImplementationTimeApiList = (data: any) => {
  return request.post({
    url: '/scheduleConfig/save',
    data
  })
}




