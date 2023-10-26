import request from '@/config/axios'
// import { VerifyCodeDtoType } from './types'

/**
 * 获取验证码
 */
export const getVerifyCodeApi = (phoneNum: string) => {
  return request.get({ url: `/msg/send/${phoneNum}` })
}
