import { PagedQueryType } from '../../common'

export type AppendantInfoType = {
  id?: number
  name: string
  size: string
  unit: string
}

export type AppendantQueryType = {
  name?: string
} & PagedQueryType
