import request from '@/config/axios'
import { LoginLogInfoType, LoginLogQueryType } from './types'

/**
 * 分页查询项目信息
 */
export const listLoginLogApi = (
  query?: LoginLogQueryType
): Promise<TableResponse<LoginLogInfoType>> => {
  return request.get({ url: '/log/login', params: query })
}
