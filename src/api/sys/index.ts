import request from '@/config/axios'
import { UserInfoType, MenuDtoType } from './types'

/**
 * 当前登录用户信息
 */
export const currentUserApi = (): Promise<IResponse<UserInfoType>> => {
  return request.get({ url: '/auth/info' })
}

/**
 * 返回当前登录用户在某项目中的授权菜单
 * @param projectId 项目id
 * @returns 菜单树
 */
export const userMenuApi = (projectId: number): Promise<IResponse<MenuDtoType>> => {
  return request.get({ url: '/menu/build' })
}
