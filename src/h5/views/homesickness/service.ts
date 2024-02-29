// 接口
// 接口
import request from '@/h5/axios'
//乡愁列表
export const getHomesickness = (): Promise<any> => {
  return request.get({
    url: `/h5/getHomesicknessList?size=9999`,
    params: { sort: ['createdDate,desc'], size: 9999 }
  })
}

//乡愁新列表
export const getHomesicknessNewList = (): Promise<any> => {
  return request.get({
    url: `/h5/getCanUseHomesicknessList`,
    params: { sort: ['createdDate,desc'], size: 9999 }
  })
}
