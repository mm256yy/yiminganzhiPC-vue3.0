import { PagedQueryType } from '../../common'

export type AppendantInfoType = {
  id?: number
  name: string
  size: string
  unit: string
  sort?: number
}

export type AppendantQueryType = {
  name?: string
} & PagedQueryType
