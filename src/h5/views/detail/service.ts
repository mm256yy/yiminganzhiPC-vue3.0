// 接口
import request from '@/h5/axios'
//乡愁列表
export const getHomesicknessId = (id): Promise<any> => {
  return request.get({ url: `/h5/getHomesickness?id=${id}` })
}
export const getNews = (params): Promise<any> => {
  return request.get({ url: `/h5/news`, params })
}
