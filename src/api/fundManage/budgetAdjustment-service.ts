import request from '@/config/axios'
import { BudgetAdjustmentType, AdjustmentType } from './budgetAdjustment-types'

/**
 * 获取概算调整列表数据
 * @param params 传参
 * @returns
 */
export const getBudgetAdjustmentListApi = (params: BudgetAdjustmentType) => {
  return request.get({ url: `/funPaymentRequest`, params })
}
/**
 * 调整概算
 * @param data
 * @returns
 */
export const updateAdjustmentApi = (data: AdjustmentType) => {
  return request.post({
    url: '/funGsAdjust/gsAdjust',
    data
  })
}

/* 概算审核（审核或驳货）*/
export const getPaymentReviewListSSApi = (data: Partial<BudgetAdjustmentType>): Promise<any> => {
  return request.post({
    url: '/funPaymentRequest/audit',
    data
  })
}
