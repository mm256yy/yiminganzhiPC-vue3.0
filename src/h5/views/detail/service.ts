// 接口
import request from '@/h5/axios'
//乡愁列表
export const getHomesicknessId = (): Promise<any> => {
  return request.get({ url: `/h5/news?type=5` })
}
