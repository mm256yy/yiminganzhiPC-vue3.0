export interface ExportType {
  peasantHouseholdType?: string
  templateKey?: any
  type?: any
  projectId?: any
  status?: any
  page?: any
  size?: any
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
  warnStatus?: string
  type?: string
  [key: string]: any
}
