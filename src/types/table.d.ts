import { ButtonType } from 'element-plus'

export type TableColumn = {
  field: any
  label?: string
  children?: TableColumn[]
} & Recordable

export type TableSlotDefault = {
  row: Recordable
  column: TableColumn
  $index: number
} & Recordable

export interface Pagination {
  small?: boolean
  background?: boolean
  pageSize?: number
  defaultPageSize?: number
  total?: number
  pageCount?: number
  pagerCount?: number
  currentPage?: number
  defaultCurrentPage?: number
  layout?: string
  pageSizes?: number[]
  popperClass?: string
  prevText?: string
  nextText?: string
  disabled?: boolean
  hideOnSinglePage?: boolean
}

export interface TableSetPropsType {
  field: string
  path: string
  value: any
}

/**
 * 表格操作列的图标定义
 */
export type TableColumnActionIcon = {
  icon: string
  /**
   * 按钮提示
   */
  tooltip?: string
  type?: ButtonType
  disabled?: boolean
  action?: Function
} & Recordable
