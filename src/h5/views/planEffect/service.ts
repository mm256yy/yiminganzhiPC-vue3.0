// 接口
import request from '@/h5/axios'
//安置点详情
export const getsettleAddress = (id): Promise<any> => {
  return request.get({
    url: `/h5/settleAddress/${id}`
  })
}
