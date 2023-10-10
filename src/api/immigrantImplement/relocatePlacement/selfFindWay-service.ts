import request from '@/config/axios'
import type { SelfFindWayType } from './selfFindWay-types'

/**
 * 获取自谋出路初始化数据
 * @param doorNo 户号
 * @returns
 */
export const getSelfFindWayApi = (doorNo: string) => {
  return request.get({ url: '/immigrantSelfSeeking/findByDoorNo', params: { doorNo } })
}

/**
 * 保存办理
 * @param data 表单提交数据
 * @returns
 */
export const saveSelfFindWayApi = (data: any): Promise<TableResponse<SelfFindWayType>> => {
  return request.post({ url: '/immigrantSelfSeeking/save', data })
}
