import request from '@/config/axios'
import type { IRole, ISearchRoleParams, IRoleMenu } from './types'

/**
 * 角色列表查询
 */

export const searchRoleListApi = (params: ISearchRoleParams): Promise<TableResponse<IRole>> => {
  return request.get({
    url: '/role',
    params
  })
}

/**
 * 查询单个菜单信息
 */

export const getRoleItemInfoApi = (id: number): Promise<IRole> => {
  return request.get({ url: `/role/${id}` })
}

/**
 * 新增角色
 */

export const createRoleApi = (data: IRole): Promise<IRole> => {
  return request.post({
    url: '/role/create',
    data
  })
}

/**
 * 修改角色
 */
export const updateRoleApi = (data: IRole): Promise<IRole> => {
  return request.post({
    url: '/role/update',
    data
  })
}

/**
 * 删除角色
 */
export const deleteRoleApi = (ids: number[]): Promise<void> => {
  return request.post({
    url: `/role/delete/${ids[0]}`
  })
}

/**
 * 查询角色关联的菜单
 */
export const getRoleRelationMenu = (id: number): Promise<IRoleMenu[]> => {
  return request.get({
    url: `/role/relation/${id}`
  })
}

/**
 * 关联角色菜单
 */
export const setRoleRelationMenu = (data: IRoleMenu[]): Promise<void> => {
  return request.post({
    url: `/role/relation/menu`,
    data
  })
}
