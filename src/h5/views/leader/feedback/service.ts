// 接口
import request from '@/config/axios'
//信息反馈
export const getFeedback = (params: any): Promise<any> => {
  return request.get({
    url: `/feedback`,
    params
  })
}
//信息反馈详情
export const getFeedbackId = (params: any): Promise<any> => {
  return request.get({
    url: `/feedback/${params}`
  })
}
//新增信息反馈
export const postFeedbackMessage = (data: any): Promise<any> => {
  return request.post({
    url: '/feedbackMessage/save',
    data
  })
}
