import request from '@/config/axios'
// 更新搬迁安置
export const updateRelocationApi = (data: any): Promise<any> => {
  return request.post({ url: '/assetHouse/update', data })
}
// 删除搬迁安置
export const delRelocationApi = (id: number): Promise<void> => {
  return request.post({ url: `/assetHouse/delete/${id}` })
}
// 新增搬迁安置
export const addRelocationApi = (data: any): Promise<any> => {
  return request.post({ url: '/assetHouse/create', data })
}
// 搬迁安置
export const getRelocationListApi = (data: any): Promise<any> => {
  return request.get({ url: '/assetHouse', params: data })
}

// 获取搬迁安置
export const getRelocationInfoApi = (doorNo: string) => {
  return request.get({
    url: '/immigrantSettle/findByDoorNo',
    params: {
      doorNo
    }
  })
}

// 保存搬迁安置
export const saveRelocationInfoApi = (data: any) => {
  return request.post({
    url: '/immigrantSettle/save',
    data
  })
}
