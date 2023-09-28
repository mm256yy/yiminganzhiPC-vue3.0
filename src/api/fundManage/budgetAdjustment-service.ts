import request from '@/config/axios'
import { BudgetAdjustmentType } from './budgetAdjustment-types'

/**
 * 获取概算调整列表数据
 * @param params 传参
 * @returns
 */
export const getBudgetAdjustmentListApi = (params: BudgetAdjustmentType) => {
  return request.get({ url: `/funPaymentRequest`, params })
}
