import { Table, TableExpose } from '@/components/Table'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, watch, computed, unref, nextTick } from 'vue'
import { get } from 'lodash-es'
import type { TableProps } from '@/components/Table/src/types'
import { useI18n } from '@/hooks/web/useI18n'
import { TableSetPropsType } from '@/types/table'

const { t } = useI18n()

interface UseTableConfig<T = any> {
  getListApi: (option: any) => Promise<TableResponse<T>>
  delListApi?: (option: any, value?: string) => Promise<void>
  // 返回数据格式配置
  response?: {
    list: string
    total?: string
  }
  props?: TableProps
}

interface TableObject<T = any> {
  size: number
  currentPage: number
  total: number
  tableList: T[]
  params: any
  loading: boolean
  currentRow: Nullable<T>
}

export const useTable = <T = any>(config?: UseTableConfig<T>) => {
  const tableObject = reactive<TableObject<T>>({
    // 页数
    size: 10,
    // 当前页
    currentPage: 1,
    // 总条数
    total: 10,
    // 表格数据
    tableList: [],
    // AxiosConfig 配置
    params: {},
    // 加载中
    loading: true,
    // 当前行的数据
    currentRow: null
  })

  const paramsObj = computed(() => {
    return {
      ...tableObject.params,
      size: tableObject.size,
      page: tableObject.currentPage
    }
  })

  watch(
    () => tableObject.currentPage,
    () => {
      methods.getList()
    }
  )

  watch(
    () => tableObject.size,
    () => {
      // 当前页不为1时，修改页数后会导致多次调用getList方法
      if (tableObject.currentPage === 1) {
        methods.getList()
      } else {
        tableObject.currentPage = 1
        methods.getList()
      }
    }
  )

  // Table实例
  const tableRef = ref<typeof Table & TableExpose>()

  // ElTable实例
  const elTableRef = ref<ComponentRef<typeof ElTable>>()

  const register = (ref: typeof Table & TableExpose, elRef: ComponentRef<typeof ElTable>) => {
    tableRef.value = ref
    elTableRef.value = unref(elRef)
  }

  const getTable = async () => {
    await nextTick()
    const table = unref(tableRef)
    if (!table) {
      console.error('The table is not registered. Please use the register method to register')
    }
    return table
  }

  const delData = async (ids: string[] | number[], value?: string) => {
    const res = await (config?.delListApi && config?.delListApi(ids, value))
    if (res) {
      ElMessage.success(t('common.delSuccess'))

      // 计算出临界点
      const currentPage =
        tableObject.total % tableObject.size === ids.length || tableObject.size === 1
          ? tableObject.currentPage > 1
            ? tableObject.currentPage - 1
            : tableObject.currentPage
          : tableObject.currentPage

      tableObject.currentPage = currentPage
      methods.getList()
    }
  }

  const methods = {
    getList: async () => {
      tableObject.loading = true
      const params = unref(paramsObj)
      const realParams = { ...params, page: params.page - 1 }
      const data = await config?.getListApi(realParams).finally(() => {
        tableObject.loading = false
      })
      if (data) {
        tableObject.tableList =
          get(data || {}, (config?.response?.list as string) || 'content') || []
        tableObject.total = get(data || {}, (config?.response?.total as string) || 'total') || 0
      }
    },
    setProps: async (props: TableProps = {}) => {
      const table = await getTable()
      table?.setProps(props)
    },
    setColumn: async (columnProps: TableSetPropsType[]) => {
      const table = await getTable()
      table?.setColumn(columnProps)
    },
    getSelections: async () => {
      const table = await getTable()
      return (table?.selections || []) as T[]
    },
    // 与Search组件结合
    setSearchParams: (data: Recordable) => {
      // console.log(data)
      // console.log(data, tableObject.params)

      tableObject.currentPage = 1
      tableObject.params = Object.assign(tableObject.params, {
        size: tableObject.size,
        page: tableObject.currentPage,
        ...data
      })

      for (const i in tableObject.params) {
        if (!tableObject.params[i]) {
          delete tableObject.params[i]
        }
      }
      console.log(tableObject.params)

      methods.getList()
    },
    // 删除数据
    // 增加可选项：删除原因的输入框
    delList: async (
      ids: string[] | number[],
      multiple: boolean,
      message = true,
      prompt = false
    ) => {
      const tableRef = await getTable()
      if (multiple) {
        if (!tableRef?.selections.length) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      } else {
        if (!tableObject.currentRow) {
          ElMessage.warning(t('common.delNoData'))
          return
        }
      }
      if (message) {
        if (prompt) {
          await ElMessageBox.prompt(t('common.delMessage'), t('common.delWarning'), {
            confirmButtonText: t('common.delOk'),
            cancelButtonText: t('common.delCancel'),
            type: 'warning',
            inputValidator: (value) => {
              if (!value) {
                return false
              }
              return true
            }
          }).then(async ({ value }) => {
            await delData(ids, value)
          })
        } else {
          await ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
            confirmButtonText: t('common.delOk'),
            cancelButtonText: t('common.delCancel'),
            type: 'warning'
          }).then(async () => {
            await delData(ids)
          })
        }
      } else {
        await delData(ids)
      }
    }
  }

  config?.props && methods.setProps(config.props)

  return {
    register,
    elTableRef,
    tableObject,
    methods
  }
}
