import request from '@/config/axios'
import { BudgetReviewType } from './budgetReview-types'

/**
 * 获取概算审核列表数据
 * @param params 传参
 * @returns
 */
export const getBudgetReviewListApi = (params: BudgetReviewType) => {
  return request.get({ url: `/funPaymentRequest/auditList`, params })
}
