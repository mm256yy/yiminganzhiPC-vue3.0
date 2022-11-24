import request from '@/config/axios'
import { OperationLogInfoType, OperationLogQueryType } from './types'

/**
 * 分页查询项目信息
 */
export const listOperationLogApi = (
  query?: OperationLogQueryType
): Promise<TableResponse<OperationLogInfoType>> => {
  return request.get({ url: '/log/operation', params: query })
}
