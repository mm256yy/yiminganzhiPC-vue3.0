import request from '@/config/axios'
import type { FillTypes } from './types'

/**
 * 填报完成
 * @param data 表单提交数据
 * @returns
 */
export const saveImmigrantFillingApi = (data: any): Promise<TableResponse<FillTypes>> => {
  return request.post({ url: '/immigrantFilling/save', data })
}
