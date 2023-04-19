import request from '@/config/axios'
// 更新搬迁安置
export const updateGaveArrageApi = (data: any): Promise<any> => {
  return request.post({ url: '/immigrantGrave/update', data })
}
// 删除坟墓安置
export const delGaveArrageApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantGrave/delete/${id}` })
}
// 新增坟墓安置
export const addGaveArrageApi = (data: any): Promise<any> => {
  return request.post({ url: '/immigrantGrave/create', data })
}
// 坟墓列表
export const getGaveArrageListApi = (data: any): Promise<any> => {
  return request.get({ url: '/immigrantGrave', params: data })
}
