import request from '@/config/axios'
import { PolicyDtoType } from './types'

/**
 * 查询二维码列表
 */
export const getQrcodeApi = (
  query: Partial<PolicyDtoType>
): Promise<TableResponse<PolicyDtoType>> => {
  return request.get({ url: '/qrcode', params: query })
}

/**
 * 新增二维码
 */
export const addQrcodeApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/qrcode/create', data })
}

/**
 * 更新二维码
 */
export const updateQrcodeApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/qrcode/update', data })
}

/**
 * 删除二维码
 */
export const delQrcodeByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/qrcode/delete/${id}` })
}

/**
 * 查询单个二维码
 */
export const getQrcodeyIdApi = (id: number): Promise<PolicyDtoType> => {
  return request.get({ url: `/qrcode/${id}` })
}
