import request from '@/config/axios'
import { TownshipFundEntryDtoType } from './townshipFundEntry-types'
/**
 * 获取乡镇资金入账列表数据
 */
export const getFunPayTownshipListApi = (params?: TownshipFundEntryDtoType) => {
  return request.get({ url: `/funGrant/funPayTownship`, params })
}

/**
 * 获取资金发放列表
 * @param params
 * @returns
 */
export const getFundDistributionListApi = (params?: TownshipFundEntryDtoType) => {
  return request.get({ url: `/funGrant/peasantHouseholdList`, params })
}

/**
 * 查询单个资金发放(id)
 * @param id
 * @returns
 */
export const getFundGrantById = (id: number) => {
  return request.get({ url: `/funGrant/${id}` })
}

/**
 * 查询单个资金发放(doorNo)
 * @param doorNo
 * @returns
 */
export const getFundGrantFindByDoorNo = (doorNo: any) => {
  return request.get({ url: `/funGrant/findByDoorNo?doorNo/${doorNo}` })
}

// 新增乡镇资金发放
export const addFundEntryApi = (data: Partial<TownshipFundEntryDtoType>): Promise<any> => {
  return request.post({
    url: '/funGrant/save',
    data
  })
}
