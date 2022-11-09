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
