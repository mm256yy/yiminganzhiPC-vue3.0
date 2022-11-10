import request from '@/config/axios'
import { ProjectDtoType, ProjectQueryType } from './types'

/**
 * 分页查询项目信息
 */
export const listProjectApi = (
  query?: ProjectQueryType
): Promise<TableResponse<ProjectDtoType>> => {
  return request.get({ url: '/project', params: query })
}

/**
 * 设置当前用户的默认项目
 */
export const setDefaultProjectApi = (projectId: number) => {
  return request.post({ url: `/project/default/${projectId}` })
}
