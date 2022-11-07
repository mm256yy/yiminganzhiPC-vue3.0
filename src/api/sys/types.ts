export type RoleSmallType = {
  id: number
  name: string
  code: string
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
 * 项目用户信息
 */
export type ProjectUserType = {
  projectId: number
  projectName: string
  prolectRole: ProjectRoleEnum
  position: string
  dingId: string
  defaultProject: boolean
  roles: RoleSmallType[]
}

/**
 * 包含用户详情信息
 */
export type UserInfoType = {
  id: number
  userName: string
  nickName: string
  systemRole: SystemRoleEnum
  sex: string
  avatar: string
  phone: string
  enabled: boolean
  lastPasswordResetTime: string
  createdDate: string
  projectUsers: ProjectUserType[]
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
}
