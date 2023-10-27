import request from '@/h5/axios'
// import { VerifyCodeDtoType } from './types'

/**
 * 获取验证码
 */
export const getVerifyCodeApi = (data?: any) => {
  return request.post({ url: `/msg/send`, data })
}

// 领导端登录
export const leaderLogin = (data?: any) => {
  return request.post({
    url: '/auth/login',
    data,
    headers: {
      DeviceType: 'pad'
    }
  })
}

// 用户登录
export const userLogin = (data?: any) => {
  return request.post({ url: '/h5/login', data })
}
