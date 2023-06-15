export interface LandInfoType {
  villageCode: string
  householdName: string
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
  [key: string]: any
}

export interface ParamsType {
  villageCode?: string
  householdName?: string
  type?: string
}
