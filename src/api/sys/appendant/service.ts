import request from '@/config/axios'
import type { AppendantInfoType, AppendantQueryType } from './types'

/**
 * 分页读取附属物列表
 */
export const listAppendantApi = (
  query: Partial<AppendantQueryType>
): Promise<TableResponse<AppendantInfoType>> => {
  return request.get({ url: '/immigrant_appendant_option', params: query })
}

/**
 * 新增或编辑附属物
 */
export const saveAppendantApi = (appendant: AppendantInfoType): Promise<AppendantInfoType> => {
  const url = appendant.id
    ? '/immigrant_appendant_option/update'
    : '/immigrant_appendant_option/create'
  return request.post({ url, data: appendant })
}

/**
 * 删除附属物
 * @param id 用户id
 */
export const deleteAppendantApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrant_appendant_option/${id}` })
}
