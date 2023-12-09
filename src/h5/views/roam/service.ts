// 接口
import request from '@/h5/axios'
// 获取用户token
export const getTokenApi = () => {
  return request.post({ url: `/leader/getToken` })
}
