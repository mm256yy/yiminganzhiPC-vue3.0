import request from '@/config/axios'

export const getTOP10 = () => {
  return request.get({ url: '/home/homeTop10' })
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

export const getnewsList = (query) => {
  return request.get({ url: '/news', params: query })
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
