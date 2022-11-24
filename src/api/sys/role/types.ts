export interface RoleType {
  projectId: number
  id: number
  name: string
  reserve: boolean
  remark: string
  code: string
  [key: string]: any
}

export interface SearchRoleParamsType {
  page: number
  size: number
  sort: string[]
  projectId: number
  blurry: string
}

export interface RoleMenuType {
  id?: number
  roleId: number
  menuId: number
}
