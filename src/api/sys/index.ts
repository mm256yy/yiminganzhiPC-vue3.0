import request from '@/config/axios'
import { TreeNodeType } from '../common'
import {
  UserInfoType,
  MenuDtoType,
  UserQueryType,
  SystemRoleEnum,
  ProjectRoleEnum,
  RoleType,
  IMenuSearchParams
  // UserSaveDtoType
} from './types'

export const getSystemRoleName = (role: SystemRoleEnum) => {
  return role === SystemRoleEnum.SYS_ADMIN
    ? '系统管理员'
    : role === SystemRoleEnum.PROJECT_ADMIN
    ? '项目管理员'
    : role === SystemRoleEnum.NORMAL_USER
    ? '普通用户'
    : '未知'
}

export const getProjectRoleName = (role: ProjectRoleEnum) => {
  return role === ProjectRoleEnum.PROJECT_ADMIN
    ? '项目管理员'
    : role === ProjectRoleEnum.NORMAL_USER
    ? '普通用户'
    : '未知'
}

/**
 * 当前登录用户信息
 */
export const currentUserApi = (): Promise<UserInfoType> => {
  return request.get({ url: '/auth/info' })
}

/**
 * 返回当前登录用户在某项目中的授权菜单
 * @param projectId 项目id
 * @returns 菜单树
 */
export const userMenuApi = (projectId: number): Promise<MenuDtoType[]> => {
  return request.get({ url: '/menu/build', params: { projectId } })
}

/**
 * 分页读取用户列表
 */
export const listUserApi = (query: UserQueryType): Promise<TableResponse<UserInfoType>> => {
  return request.get({ url: '/user/list', params: query })
}

/**
 * 新增或编辑用户
 */
export const saveUserApi = (user: UserInfoType): Promise<UserInfoType> => {
  const url = user.id ? '/user/update' : '/user/create'
  return request.post({ url, data: user })
}

/**
 * 删除用户
 * @param id 用户id
 * @param projectId 项目id，如果只是删除用户在单个项目中的关联
 */
export const deleteUserApi = (id: number, projectId?: number): Promise<void> => {
  return request.post({ url: `/user/delete/${id}`, params: { projectId } })
}

/**
 * 取某项目的组织树结构
 */
export const getOrgTreeApi = (projectId: number): Promise<TreeNodeType> => {
  return request.get({ url: '/org/tree', params: { projectId } })
}

/**
 * 得到某项目的所有角色
 */
export const getAllRoleApi = (projectId: number): Promise<RoleType[]> => {
  return request.get({ url: '/role/all', params: { projectId } })
}

/**
 * 获取所有的菜单列表
 */

export const getSearchMenuApi = (
  params: IMenuSearchParams
): Promise<TableResponse<MenuDtoType>> => {
  return request.get({ url: '/menu', params: { ...params, size: 100 } })
}

/**
 * 查询单个菜单信息
 */

export const getMenuItemInfoApi = (id: number): Promise<MenuDtoType> => {
  return request.get({ url: `/menu/${id}` })
}

/**
 * 新增菜单
 */
export const createMenuApi = (data: MenuDtoType): Promise<MenuDtoType> => {
  return request.post({
    url: '/menu/create',
    data
  })
}

/**
 * 修改菜单
 */
export const updateMenuApi = (data: MenuDtoType): Promise<MenuDtoType> => {
  return request.post({
    url: '/menu/update',
    data
  })
}

/**
 * 删除菜单
 */
export const deleteMenuApi = (ids: number[]): Promise<void> => {
  return request.post({
    url: `/menu/delete/${ids[0]}`
  })
}
