import { PagedQueryType } from '@/api/common'

export interface ResettlementDtoType {
  id?: number
  doorNo: string
  householdId: number
  familyNum: number | string
  countryNum: number | string
  unCountryNum: number | string
  opinion: string
  productionType: string
  removalType: string
  [key: string]: any
}

export interface ResettlementParamsType {
  doorNo: string
  householdId: number
}

export interface ResettlementConfigType {
  id: number
  projectId: number
  type: string
  way: string
  area: string
}

export interface ConfigParamsType {
  projectId: number
  type: string
  way: string
  area: string
}

export type ResettlementConfigParamsType = PagedQueryType & ConfigParamsType
