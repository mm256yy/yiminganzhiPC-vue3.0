import { PagedQueryType } from '../../common'

/**
 * 登录日志查询类型
 */
export type LoginLogQueryType = {
  userName?: string
  ip?: string
  city?: string
  type?: number
  success?: boolean
} & PagedQueryType

/**
 * 登录日志信息类型
 */
export type LoginLogInfoType = {
  id?: number
  requestId: string
  userName: string
  path: string
  methodName: string
  userAgent?: string
  body?: string
  ip: string
  city?: string
  token?: string
  type?: number
  success?: boolean
  code?: number
  exceptionMessage?: string
  browserName?: string
  browserVersion?: string
  osName?: string
  platformName?: string
  mobile?: boolean
  deviceName?: string
  deviceModel?: string
  engineName?: string
  engineVersion?: string
  remark?: string
  createTime?: string
}
