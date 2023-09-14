import request from '@/config/axios'

// 获取资金科目列表
export const getFundSubjectListApi = (params?: any) => {
  return request.get({ url: `/funSubject/list`, params })
}
