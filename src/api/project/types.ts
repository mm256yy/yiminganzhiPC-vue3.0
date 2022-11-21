import { PagedQueryType } from '../common'

/**
 * 项目信息类型
 */
export type ProjectDtoType = {
  id: number
  name: string
  description?: string
  dingCorpId?: number
}

/**
 * 项目查询类型
 */
export type ProjectQueryType = {
  name?: string
} & PagedQueryType

/**
 * 项目配置信息
 */
export type ProjectConfigType = {
  projectId: number
  id?: number
  dingCorpId: string
  dingAgentId: string
  dingAppKey: string
  dingAppSecret: string
}
