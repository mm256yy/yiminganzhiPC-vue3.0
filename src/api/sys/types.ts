import { PagedQueryType } from '../common'
import { ProjectDtoType } from '../project/types'

export type RoleSmallType = {
  id: number
  name?: string
  code?: string
}

/**
 * 项目角色
 */
export enum ProjectRoleEnum {
  PROJECT_ADMIN = 'PROJECT_ADMIN',
  NORMAL_USER = 'NORMAL_USER'
}

/**
 * 系统角色
 */
export enum SystemRoleEnum {
  SYS_ADMIN = 'SYS_ADMIN',
  PROJECT_ADMIN = 'PROJECT_ADMIN',
  NORMAL_USER = 'NORMAL_USER'
}

/**
 * 用户搜索类型
 */
export type UserQueryType = {
  projectId: number
  blurry: string
  enabled: boolean
  orgId: number
  roleId: number
} & PagedQueryType

/**
 * 项目用户信息
 */
export type ProjectUserType = {
  projectId?: number
  projectName?: string
  projectRole: ProjectRoleEnum
  position: string
  dingId?: string
  orgId?: number
  orgName?: string
  defaultProject?: boolean
  roles?: RoleSmallType[]
  roleIds?: number[]
  mapPic?: string
  mapJson?: string
  [key: string]: any
}

/**
 * 包含用户详情信息
 */
export type UserInfoType = {
  id?: number
  userName: string
  nickName: string
  systemRole: SystemRoleEnum
  sex: string
  avatar: string
  phone?: string
  enabled: boolean
  lastLoginTime?: string
  createdDate?: string
  projectUsers: ProjectUserType[]
  // 权限
  permissions?: string[]
}

/**
 * 菜单dto
 */
export type MenuDtoType = {
  id: number
  /**
   * 0=目录，1=菜单，2=权限
   */
  type: number
  name: string
  showName: string
  permission: string
  path: string
  sort: number
  componentCode: string
  componentName: string
  parentId: number
  iframe: boolean
  cache: boolean
  hidden: boolean
  icon: string
  children: MenuDtoType[]
  projectId: number
  status: string
}

/**
 * 角色类型
 */
export type RoleType = {
  id: number
  projectId: number
  name: string
  reserve: boolean
  code: string
  remark?: string
}

/**
 * 组织类型
 */
export type OrgType = {
  id: number
  name: string
}

/**
 * 菜单列表查询条件参数
 */
export interface IMenuSearchParams {
  blurry: string
  projectId: number
}

/*
 * 字典查询类型
 */
export type DictQueryType = {
  blurry: string
  dictGroup: string
  includeVal: boolean
} & PagedQueryType

/**
 * 字典信息类型
 */
export type DictInfoType = {
  id?: number
  name: string
  dictGroup: string
  remark: string
  dictValList: DictDetailType[] | null
}

/**
 * 字典详情查询类型
 */
export type DictDetailQueryType = {
  name: string
  projectId: number
}

/**
 * 字典详情信息
 */
export type DictDetailType = {
  id?: number
  dictId: number
  projectId: number
  label: string
  value: string
  sort: string
}

/**
 * 包含详情的字典信息
 */
export type DictAndDetailType = {
  id?: number
  name: string
  remark: string
  dictValList: DictDetailType[]
  projects: ProjectDtoType[]
}

// ******** 组织管理 **********
/**
 * 组织查询类型
 */
export type orgQueryType = {
  name?: string | null
  enable?: boolean | null
}

/**
 * 单个组织类型
 */
export type orgInfoType = {
  projectId: number
  id: number
  name: string
  parentId: number
  enabled: boolean
  remark: string
  sortNum: number
  serialNumber?: string
  children?: orgInfoType[]
}

/**
 * 组织树类型
 */
// export type orgTreeType = {
//   id: number
//   label: string
//   data?: any
//   children?: orgTreeType[]
// }
