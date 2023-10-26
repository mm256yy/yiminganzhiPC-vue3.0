// 接口
import request from '@/config/axios'
//政治法规
export const getPolicyLaw = (): Promise<any> => {
  return request.get({
    url: `/news?type=3`
  })
}
export const getPolicyLawId = (id): Promise<any> => {
  return request.get({
    url: `/news/${id}`
  })
}
