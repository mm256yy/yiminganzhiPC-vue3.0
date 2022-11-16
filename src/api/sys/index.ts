import request from '@/config/axios'
import { TreeNodeType } from '../common'
import {
  UserInfoType,
  MenuDtoType,
  UserQueryType,
  DictInfoType,
  DictQueryType,
  DictDetailType,
  DictDetailQueryType,
  DictAndDetailType,
  SystemRoleEnum,
  ProjectRoleEnum,
  RoleType
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
 * 分页读取字典列表
 */
export const listDictApi = (query: DictQueryType): Promise<TableResponse<DictInfoType>> => {
  return request.get({ url: 'dict', params: query })
}

/**
/**
 * 新增或编辑字典
 */
export const saveDictApi = (dict: DictInfoType): Promise<DictInfoType> => {
  const url = dict.id ? '/dict/update' : '/dict/create'
  return request.post({ url, data: dict })
}

/**
 * 删除字典
 * @param id 用户id
 */
export const deleteDictApi = (id: number): Promise<void> => {
  return request.post({ url: `/dict/${id}` })
}

/**
 * 查询字典详情列表
 */
export const listDictDetailApi = (query: DictDetailQueryType): Promise<DictAndDetailType> => {
  console.log('123', query.name)
  return request.get({ url: `dict/${query.name}`, params: query })
}

/**
/**
 * 新增或编辑字典详情
 */
export const saveDictDetailApi = (dict: DictDetailType): Promise<DictDetailType> => {
  const url = dict.id ? '/dict/val/update' : '/dict/val/create'
  return request.post({ url, data: dict })
}

/**
 * 删除字典详情
 * @param id 用户id
 */
export const deleteDictDetailApi = (id: number, projectId: number): Promise<void> => {
  return request.post({ url: `/dict/val/${id}`, data: { projectId } })
}
