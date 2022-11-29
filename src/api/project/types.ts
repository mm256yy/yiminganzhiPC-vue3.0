import { PagedQueryType } from '../common'

/**
 * 项目信息类型
 */
export type ProjectDtoType = {
  id: number
  name: string
  description?: string
  dingCorpId?: number
  showName: string
  reservoirCode: string
  projectType: string
  townCode: string
  reservoirName: string
  districtTree: string[]
}

/**
 * 项目查询类型
 */
export type ProjectQueryType = {
  name?: string | null
  townCode?: string | null
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
