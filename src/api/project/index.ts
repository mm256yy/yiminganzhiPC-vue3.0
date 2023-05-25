import request from '@/config/axios'
import { ProjectDtoType, ProjectQueryType, ProjectConfigType } from './types'

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

/**
 * 新增或编辑项目信息
 */
export const saveProjectApi = (project: ProjectDtoType): Promise<ProjectDtoType> => {
  const url = project.id ? '/project/update' : '/project/create'
  return request.post({ url, data: project })
}

/**
 * 删除项目
 * @param id 项目id
 */
export const deleteProjectApi = (id: number): Promise<void> => {
  return request.post({ url: `/project/delete/${id}` })
}

/**
 * 查询项目配置信息
 */
export const projectConfigApi = (projectId: number): Promise<ProjectConfigType> => {
  return request.get({ url: `/project/config/${projectId}` })
}

/**
 * 新增或编辑项目配置信息
 */
export const saveProjectConfigApi = (
  projectConfig: ProjectConfigType
): Promise<ProjectConfigType> => {
  const url = projectConfig.id ? '/project/config/update' : '/project/config/create'
  return request.post({ url, data: projectConfig })
}

/**
 * 查询单个项目信息
 */
export const getProjectInfoApi = (id: string | number) => {
  return request.get({ url: `/project/${id}` })
}

/**
 * 复核
 */
export const reviewProjectApi = () => {
  return request.post({
    url: '/project/review'
  })
}

/**
 * 项目统计信息
 */
export const getProjectStatisticalApi = () => {
  return request.get({
    url: '/project/statistical'
  })
}
