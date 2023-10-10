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
