import request from '@/config/axios'

// 获取坟墓安置列表
export const getGraveArrageListApi = (data: any): Promise<any> => {
  return request.get({ url: '/immigrantGrave', params: data })
}

// 新增坟墓安置
export const addGraveArrageApi = (data: any): Promise<any> => {
  return request.post({ url: '/immigrantGrave/create', data })
}

// 删除坟墓安置
export const delGraveArrageApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrantGrave/delete/${id}` })
}

// 更新坟墓安置信息
export const updateGraveArrageApi = (data: any): Promise<any> => {
  return request.post({ url: '/immigrantGrave/update', data })
}
