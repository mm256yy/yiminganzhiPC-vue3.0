import request from '@/config/axios'
// // 更新生产安置
// export const updateProduceApi = (data: any): Promise<any> => {
//   return request.post({ url: '/demographic/update', data })
// }
// // 删除生产安置
// export const delProduceApi = (id: number): Promise<void> => {
//   return request.post({ url: `/demographic/delete/${id}` })
// }
// // 新增生产安置
// export const addProduceApi = (data: any): Promise<any> => {
//   return request.post({ url: '/demographic/create', data })
// }

// 获取生产安置
export const getProduceListApi = (data: any): Promise<any> => {
  return request.get({ url: '/demographic', params: data })
}

// 保存生产安置
export const saveProduceListApi = (data: any): Promise<any> => {
  return request.post({ url: '/demographic/save', data })
}

// 生产用地查询
export const getProduceLandInfoApi = (doorNo: any): Promise<any> => {
  return request.get({
    url: '/immigrantLand/findByDoorNo',
    params: {
      doorNo
    }
  })
}
