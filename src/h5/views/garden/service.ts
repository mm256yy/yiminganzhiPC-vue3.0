// 接口
import request from '@/h5/axios'
//领导端大屏
export const getsettleAddress = (): Promise<any> => {
  return request.get({
    url: `/h5/settleAddress?size=99999`
  })
}
