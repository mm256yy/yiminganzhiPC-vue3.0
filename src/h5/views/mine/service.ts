// 接口
//
// 接口
import request from '@/h5/axios'

//家庭成员
export const getLeadershipScreen = (params: any): Promise<any> => {
  return request.get({
    url: `/h5/getFamily`,
    params
  })
}
//基本信息 personalInformation
export const getPersonalInformation = (): Promise<any> => {
  return request.get({
    url: `/h5/personalInformation`
  })
}
