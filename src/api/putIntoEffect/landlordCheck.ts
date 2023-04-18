import request from '@/config/axios'
// 更新搬迁安置
export const updateAssetHouse = (data: any): Promise<any> => {
  return request.post({ url: '/assetHouse/update', data })
}
// 删除搬迁安置
export const delassetHouse = (id: number): Promise<void> => {
  return request.post({ url: `/assetHouse/delete/${id}` })
}
// 新增搬迁安置
export const addHaeeossstu = (data: any): Promise<any> => {
  // if (id == '2') {
  //   data.status = 'review'
  // }
  return request.post({ url: '/Haeeossstu/create', data })
}
export const getHouseByIdApi = (id: number): Promise<any> => {
  return request.get({ url: `/assetHouse/${id}` })
}
export const getassetHouse = (query: Partial<any>): Promise<TableResponse<any>> => {
  return request.get({ url: '/assetHouse', params: query })
}
