import request from '@/config/axios'
import type { CaptchaType, UserLoginType, UserLoginResType } from './types'

export const loginApi = (data: UserLoginType): Promise<UserLoginResType> => {
  return request.post({ url: '/auth/login', data })
}

export const logoutApi = (): Promise<void> => {
  return request.post({ url: '/auth/logout' })
}

export const loginCaptchaApi = (): Promise<CaptchaType> => {
  return request.post({ url: '/auth/captcha' })
}

/**
 * 当前登录用户在当前项目中的权限列表
 * 项目信息通过请求头传递
 */
export const getPermissionApi = (): Promise<string[]> => {
  return request.get({ url: '/auth/permission' })
}

/**
 * 修改密码
 * @param data
 * @returns
 */
export const modifyPasswordApi = (data: any): Promise<string[]> => {
  return request.post({ url: '/user/pass', data })
}
