// 修改手机号 /h5/updatePhone
import request from '@/h5/axios'
//领导端大屏
export const getupdatePhone = (data: any): Promise<any> => {
  return request.post({
    url: `/h5/updatePhone`,
    data
  })
}
