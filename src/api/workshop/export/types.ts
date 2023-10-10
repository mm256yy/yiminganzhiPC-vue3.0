export interface ExportType {
  peasantHouseholdType?: string
  type: number[]
}

export interface LandlordDtoType {
  id?: number
  name?: string
  sex?: string
  card?: string
  doorNo?: string
  townCode?: string
  neighborhoodCommittee?: string
  villageCode?: number
  address?: string
  projectId?: number
  longitude?: string
  latitude?: string
  phone?: string
  locationType?: string
  cityCode?: string
  areaCode?: string
  hasPropertyAccount?: boolean
  allocationStatus?: string
  householdNumber?: string // 户籍册编号
  status?: string // 移民阶段，如数据采集 survey，实物复核 implementation
  type?: string
  [key: string]: any
}
