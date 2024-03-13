import request from '@/config/axios'

// 获取生产安置列表
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
// 新增生产安置
export const AddProduceListApi = (data: any): Promise<any> => {
  return request.post({ url: '/demographic/create', data })
}
// 删除生产安置
export const deleteProduceListApi = (id: any): Promise<any> => {
  return request.post({ url: `/demographic/delete/${id}` })
}
//更新生产安置
export const updateProduceListApi = (data: any): Promise<any> => {
  return request.post({ url: '/demographic/update', data })
}
// 参保人数 landEstimate/getLandAreaByDoorNo?doorNo=XXXX
export const getLandAreaByDoorNoApi = (doorNo: any): Promise<any> => {
  return request.get({
    url: '/landEstimate/getLandAreaByDoorNo',
    params: {
      doorNo
    }
  })
}
