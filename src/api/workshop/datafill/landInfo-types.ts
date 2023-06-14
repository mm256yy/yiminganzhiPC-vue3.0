export interface LandInfoDetailType {
  status: string
  doorNo: string
}

export interface LandInfoListType {
  id: number
  doorNo: string
  householdId: number
  uid: string
  projectId: number
  status: string
  type: string
  plowland: number
  gardenPlot: number
  forestLand: number
  trafficLand: number
  watersLand: number
  meadow: number
  commerceLand: number
  mineLand: number
  dwellingLand: number
  serviceLand: number
  facilityLand: number
  specialLand: number
  landTypeText: string
  objprops: string
}
