import request from '@/config/axios'

/**
 * 更新概算填报列表
 * @param data 表单数据
 * @returns
 */
export const updateInvestListApi = (data: any): Promise<any> => {
  return request.post({
    url: '/funSubject/updateInvest',
    data
  })
}
