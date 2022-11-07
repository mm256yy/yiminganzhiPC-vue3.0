import request from '@/config/axios'
import type { CaptchaType, UserType, UserLoginType, UserLoginResType } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserLoginType): Promise<IResponse<UserLoginResType>> => {
  return request.post({ url: '/auth/login', data })
}

export const logoutApi = (): Promise<IResponse> => {
  return request.post({ url: '/auth/logout' })
}

export const loginCaptchaApi = (): Promise<IResponse<CaptchaType>> => {
  return request.post({ url: '/auth/captcha' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    total: number
    list: UserType[]
  }>({ url: '/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/role/list', params })
}
