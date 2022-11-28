import request from '@/config/axios'
import { PolicyDtoType } from './types'

/**
 * 查询政策法规列表
 */
export const getPolicyListApi = (
  query: Partial<PolicyDtoType>
): Promise<TableResponse<PolicyDtoType>> => {
  return request.get({ url: '/policyLaw', params: query })
}

/**
 * 新增政策法规
 */
export const addPolicyApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/policyLaw/create', data })
}

/**
 * 更新政策法规
 */
export const updatePolicyApi = (data: PolicyDtoType): Promise<PolicyDtoType> => {
  return request.post({ url: '/policyLaw/update', data })
}

/**
 * 删除政策法规
 */
export const delPolicyByIdApi = (id: number): Promise<void> => {
  return request.get({ url: `/policyLaw/delete/${id}` })
}

/**
 * 查询单个政策法规
 */
export const getPolicyByIdApi = (id: number): Promise<PolicyDtoType> => {
  return request.get({ url: `/policyLaw/${id}` })
}
