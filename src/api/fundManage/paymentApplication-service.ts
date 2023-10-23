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
/**
 * 新增付款申请
 */
export const addPaymentApplicationList = (
  data: Partial<PaymentApplicationDtoType>
): Promise<any> => {
  return request.post({
    url: '/funPaymentRequest/create',
    data
  })
}

/**
 * 更新付款申请
 */
export const updatePaymentApplicationList = (
  data: Partial<PaymentApplicationDtoType>
): Promise<any> => {
  return request.post({
    url: '/funPaymentRequest/update',
    data
  })
}
/**
 * 付款对象列表数据
 */
export const getPaymentApplicationPpsList = (params?: any) => {
  return request.get({ url: `/funPaymentRequest/pps/list`, params })
}
/**
 * 查询单个付款详情(包含流程接口)
 */
export const PaymentApplicationByIdDetailApi = (id: number, type: number): Promise<void> => {
  return request.get({ url: `/funPaymentRequest/${id}?type=${type}` })
}
/* 获取付款审核列表数据*/
export const getPaymentReviewListApi = (params: PaymentApplicationDtoType) => {
  return request.get({ url: `/funPaymentRequest/auditList`, params })
}
/* 付款审核（审核或驳货）*/
export const getPaymentReviewListSSApi = (
  data: Partial<PaymentApplicationDtoType>
): Promise<any> => {
  return request.post({
    url: '/funPaymentRequest/audit',
    data
  })
}

/* 获取付款审核配置数据*/
export const funFlowNodeApi = (params?: any) => {
  return request.get({ url: `/funFlowNode`, params })
}
// /**
//  * 删除付款审核
//  */
// export const delPaymentReviewApi = (id: number): Promise<void> => {
//   return request.post({ url: `/funPaymentRequest/delete/${id}` })
// }
