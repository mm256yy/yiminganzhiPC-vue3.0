import { SystemRoleEnum } from '../sys/types'

export type UserLoginType = {
  userName: string
  password: string
  authCode: string
  authKey: string
  reservoirName: string
}

/**
 * 用户登录返回的用户类型
 */
export type JwtUserType = {
  id: number
  userName: string
  nickName: string
  systemRole: SystemRoleEnum
  sex: string
  avatar: string
  phone: string
  enabled: boolean
}

/**
 * 用户登录返回类型
 */
export type UserLoginResType = {
  /**
   * 授权 token
   */
  token: string
  /**
   * 用户信息
   */
  reservoirName: string
  user: JwtUserType
  /**
   * 是否弱密码
   */
  weakPwd: boolean
}

export type UserType = {
  userName: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}

/**
 * 验证码返回值
 */
export type CaptchaType = {
  key: string
  /**
   * 图片 base64 返回字符串
   */
  image: string
}
