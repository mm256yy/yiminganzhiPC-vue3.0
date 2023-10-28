import request from '@/config/axios'
import { PlacementPointDtoType } from './placementPoint-types'

/**
 * 获取安置点配置列表
 * @param query 查询参数
 * @returns
 */
export const getPlacementPointListApi = (
  query: Partial<PlacementPointDtoType>
): Promise<TableResponse<PlacementPointDtoType>> => {
  return request.get({
    url: '/settleAddress',
    params: query
  })
}

/**
 * 新增/编辑安置点配置
 * @param data 表单数据
 * @returns
 */
export const editPlacementPointApi = (
  data: PlacementPointDtoType
): Promise<PlacementPointDtoType> => {
  return request.post({
    url: '/settleAddress/save',
    data
  })
}

/**
 * 删除安置点配置
 * @param id 当前行专业项目 ID
 * @returns
 */
export const delPlacementPointByIdApi = (id: number): Promise<void> => {
  return request.post({
    url: `/settleAddress/delete/${id}`
  })
}
/**
 * 查询单个安置点
 * @param id 当前行专业项目 ID
 * @returns
 */
export const getPlacementPointByIdApi = (id: number): Promise<void> => {
  return request.get({
    url: `/settleAddress/${id}`
  })
}
