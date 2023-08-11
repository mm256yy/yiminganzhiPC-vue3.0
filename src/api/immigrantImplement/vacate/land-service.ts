import request from '@/config/axios'

// 获取土地腾空信息
export const getLandVacateInfoApi = (doorNo: string): Promise<any> => {
  return request.get({
    url: '/immigrantLandEmpty/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// 保存土地腾空信息
export const saveLandVacateInfoApi = (data: any): Promise<any> => {
  return request.post({
    url: '/immigrantLandEmpty/save',
    data
  })
}
