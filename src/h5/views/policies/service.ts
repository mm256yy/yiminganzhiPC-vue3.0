// 接口
import request from '@/h5/axios'
//政治法规
export const getPolicyLaw = (): Promise<any> => {
  return request.get({
    url: `/h5/news?type=2`
  })
}
export const getPolicyLawId = (id): Promise<any> => {
  return request.get({
    url: `/h5/news/${id}`
  })
}
