import type { CSSProperties } from 'vue'
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T
  }

  declare type Nullable<T> = T | null

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  declare type ComponentRef<T> = InstanceType<T>

  declare type LocaleType = 'zh-CN' | 'en'

  declare type AxiosHeaders =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  declare interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headersType?: string
    responseType?: AxiosResponseType
  }

  declare interface IResponse<T = any> {
    code: number
    data: T extends any ? T : T & any
    message: string
  }

  /**
   * 表格分页接口
   */
  declare interface TableResponse<T = any> {
    total: number
    content: T[]
    page: number
    size: number
    other: any
  }

  /**
   * 地图类
   */
  declare const BMapGL: any
  declare const BMAP_ANCHOR_TOP_LEFT: any
}
