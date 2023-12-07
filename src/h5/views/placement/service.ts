// 接口
import request from '@/h5/axios'
//查询安置进度概览
export const getH5ImmigrantFilling = (): Promise<any> => {
  return request.get({
    url: `/h5/immigrantFilling`
  })
}
