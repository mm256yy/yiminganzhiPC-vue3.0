import request from '@/config/axios'
import type { FillType } from './selfBuildHouse-types'

/**
 * 获取自建房数据
 * @param doorNo 户号
 * @returns
 */
export const getSelfBuildHouseApi = (doorNo: string) => {
  return request.get({ url: '/immigrantBuildOneself/findByDoorNo', params: { doorNo } })
}

/**
 * 保存动迁安置信息
 * @param data 表单提交数据
 * @returns
 */
export const saveSelfBuildHouseApi = (data: any): Promise<TableResponse<FillType>> => {
  return request.post({ url: '/immigrantBuildOneself/save', data })
}
