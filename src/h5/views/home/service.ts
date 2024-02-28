// 接口
import request from '@/h5/axios'
//领导端大屏
export const getLeadershipScreen = (params: any): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getLeadershipScreen`,
    params
  })
}
//新政村下拉
export const getVillageList = (): Promise<any> => {
  return request.get({
    url: `/leadershipScreen/getVillageList`
  })
}
//通知公告
export const getNewsList = (query) => {
  return request.get({ url: '/h5/news', params: query })
}
//通知公告详细 news/43
export const getNewsListId = (id) => {
  return request.get({ url: `/h5/news/${id}` })
}
//乡愁列表
export const getHomesickness = (): Promise<any> => {
  return request.get({
    url: `/h5/getHomesicknessList`,
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

// 获取用户token
export const getTokenApi = () => {
  return request.post({ url: `/leader/getToken` })
}
