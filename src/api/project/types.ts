import { PagedQueryType } from '../common'

/**
 * 项目信息类型
 */
export type ProjectDtoType = {
  id: number
  name: string
}

/**
 * 项目查询类型
 */
export type ProjectQueryType = {
  name?: string
} & PagedQueryType
