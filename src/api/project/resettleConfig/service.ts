import request from '@/config/axios'
import type { ResettleConfigInfoType, ResettleConfigQueryType } from './types'

/**
 * 查询安置意愿配置列表
 */
export const listResettleConfigApi = (
  query: Partial<ResettleConfigQueryType>
): Promise<TableResponse<ResettleConfigInfoType>> => {
  return request.get({ url: 'immigrant_will_config', params: query })
}

/**
 * 新增或编辑安置意愿配置
 */
export const saveResettleConfigApi = (
  ResettleConfig: ResettleConfigInfoType
): Promise<ResettleConfigInfoType> => {
  const url = ResettleConfig.id ? '/immigrant_will_config/update' : '/immigrant_will_config/create'
  return request.post({ url, data: ResettleConfig })
}

/**
 * 删除安置意愿配置
 * @param id 用户id
 */
export const deleteResettleConfigApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrant_will_config/delete/${id}` })
}
