// 接口
// 接口
import request from '@/h5/axios'
//乡愁列表
export const getHomesickness = (): Promise<any> => {
  return request.get({
    url: `/h5/getHomesicknessList?size=9999`
  })
}
