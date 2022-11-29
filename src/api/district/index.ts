import request from '@/config/axios'
import { DistrictNodeType, DistrictQueryType } from './types'

/**
 * 分页查询行政区划
 */
export const listDistrictApi = (
  query?: DistrictQueryType
): Promise<TableResponse<DistrictNodeType>> => {
  return request.get({ url: '/district', params: query })
}

/**
 * 根据id查询单个行政区划
 */
export const getDistrictApi = (id: number): Promise<DistrictNodeType> => {
  return request.get({ url: `/district/${id}`, params: { id } })
}

/**
 * 根据code查询单个行政区划
 */
export const getDistrictByCodeApi = (code: string): Promise<DistrictNodeType> => {
  return request.get({ url: `/district/by-code`, params: { code } })
}

/**
 * 根据父节点id查询子节点列表
 */
export const getDistrictChildrenApi = (parentId: number): Promise<DistrictNodeType[]> => {
  return request.get({ url: `/district/child`, params: { parentId } })
}

/**
 * 新增或编辑行政区划信息
 */
export const saveDistrictApi = (district: DistrictNodeType): Promise<DistrictNodeType> => {
  const url = district.id ? '/district/update' : '/district/create'
  return request.post({ url, data: district })
}

/**
 * 删除项目
 * @param id 项目id
 */
export const deleteDistrictApi = (id: number): Promise<void> => {
  return request.post({ url: `/district/delete/${id}` })
}
