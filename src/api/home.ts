import request from '@/config/axios'

export const getTopTen = (data) => {
  return request.get({ url: '/home/homeTop10?type=' + data })
}

export const homeStatistics = () => {
  return request.get({ url: '/home/homeStatistics' })
}

export const homeProgress = () => {
  return request.get({ url: '/home/homeProgress' })
}

export const homeDistribution = () => {
  return request.get({ url: '/home/homeDistribution' })
}

export const getNewsList = (query) => {
  return request.get({ url: '/news', params: query })
}

export const getPolicyListApi = (query) => {
  return request.get({ url: '/policyLaw', params: query })
}

export const detail = (id) => {
  return request.get({ url: `/news/${id}` })
}

// 获取首页报告展示数据
export const getReportNumber = () => {
  return request.get({ url: '/report/number' })
}

// export const getLandlordListApi = (
//   query: Partial<LandlordDtoType>
// ): Promise<TableResponse<LandlordDtoType>> => {
//   if (!query.code) {
//     delete query.areaCode
//     delete query.townCode
//     delete query.villageCode
//     delete query.virutalVillageCode
//   }
//   return request.get({ url: '/peasantHousehold', params: { sort: ['createdDate,desc'], ...query } })
// }
