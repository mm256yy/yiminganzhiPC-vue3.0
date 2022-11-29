import { PagedQueryType } from '../common'

/**
 * 行政区划信息类型
 */
export type DistrictNodeType = {
  id: number
  parentId: number
  code: string
  name: string
  shortName: string
  districtType: string
  latitude: number
  longitude: number
  address: string
  introduction: string
  hasChild: boolean
  zoom: number
  level: number
  children?: any[]
}

/**
 * 项目查询类型
 */
export type DistrictQueryType = {
  id?: number
  parentId?: number
  code?: string
} & PagedQueryType
