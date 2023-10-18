import request from '@/config/axios'
import { PaymentApplicationDtoType } from './paymentApplication-types'
/**
 * 获取付款申请列表数据
 */
export const getPaymentApplicationListApi = (params?: PaymentApplicationDtoType) => {
  return request.get({ url: `/funPaymentRequest`, params })
}

/**
 * 删除付款申请
 */
export const delPaymentApplicationByIdApi = (id: number): Promise<void> => {
  return request.post({ url: `/funPaymentRequest/delete/${id}` })
}

// /* 获取付款审核列表数据*/
// export const getPaymentReviewListApi = (params: PaymentApplicationDtoType) => {
//   return request.get({ url: `/funPaymentRequest`, params })
// }

// /**
//  * 删除付款审核
//  */
// export const delPaymentReviewApi = (id: number): Promise<void> => {
//   return request.post({ url: `/funPaymentRequest/delete/${id}` })
// }
