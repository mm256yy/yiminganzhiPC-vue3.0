export interface IRole {
  projectId: number
  id: number
  name: string
  reserve: boolean
  remark: string
  code: string
  [key: string]: any
}

export interface ISearchRoleParams {
  page: number
  size: number
  sort: string[]
  projectId: number
  blurry: string
}

export interface IRoleMenu {
  id?: number
  roleId: number
  menuId: number
}
