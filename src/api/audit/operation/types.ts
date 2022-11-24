import { PagedQueryType } from '../../common'

/**
 * 操作日志查询类型
 */
export type OperationLogQueryType = {
  projectId?: number
  userName: string
  name: string
  ip: string
  path: string
  module: string
  methodName: string
  requestMethod: string
  operationType: string
  success: boolean
} & PagedQueryType

/**
 * 操作日志信息类型
 */
export type OperationLogInfoType = {
  id: number
  projectId: number
  requestId: string
  userName: string
  nickName: string
  name: string
  ip: string
  city: string
  path: string
  module: string
  className: string
  methodName: string
  requestMethod: string
  contentType: string
  requestBody: boolean
  param: string
  token: string
  operationType: string
  success: boolean
  code: number
  exceptionMessage: string
  browserName: string
  browserVersion: string
  osName: string
  platformName: string
  engineName: string
  engineVersion: string
  mobile: boolean
  deviceName: string
  deviceModel: string
  remark: string
  createTime: string
}
