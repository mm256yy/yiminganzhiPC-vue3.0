<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 居民户报表 </div>
        <div></div>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getHouseholdReportListApi } from '@/api/fundReport/service'

const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { register, tableObject } = useTable()

const commonTableItemSchema = {
  search: {
    show: false
  },
  form: {
    show: false
  },
  detail: {
    show: false
  }
}

let allSchemas = reactive<any>({})

/**
 * 处理表头
 * 表格数据
 * @param nameLink
 * @param list
 */
const getTableHeaderAndData = (nameLink: any[], list: any[]) => {
  let nameList: any[] = []
  let dataList: any[] = []

  const fieldKey = 'field'
  if (nameLink && nameLink.length) {
    let count = 0
    nameList = nameLink.map((item, index) => {
      const oneLevTit =
        index === 0 ? '补偿费' : index === 1 ? '补助费' : index === 2 ? '奖励费' : '其他'
      const fields: {
        [key: string]: any
      } = {
        label: oneLevTit,
        children: [],
        ...commonTableItemSchema
      }

      if (item.length) {
        item.forEach((ytem, yDex) => {
          fields.children.push({
            label: ytem,
            children: [
              {
                label: '应发',
                field: `${fieldKey}_${yDex * 2 + count}`,
                ...commonTableItemSchema
              },
              {
                label: '已发',
                field: `${fieldKey}_${yDex * 2 + 1 + count}`,
                ...commonTableItemSchema
              }
            ],
            ...commonTableItemSchema
          })
        })
      }

      count += item.length * 2

      return fields
    })

    // 表头
    nameList = [
      {
        field: 'doorNo',
        label: '户号',
        search: {
          show: true,
          component: 'Input'
        },
        table: {
          show: false
        },
        form: {
          show: false
        },
        detail: {
          show: false
        }
      },
      {
        field: 'name',
        label: '名称',
        search: {
          show: true,
          component: 'Input'
        },
        table: {
          show: false
        },
        form: {
          show: false
        },
        detail: {
          show: false
        }
      },
      {
        label: '户主',
        field: 'name',
        fixed: true,
        ...commonTableItemSchema
      },
      ...nameList
    ]
  }

  // key-value 数组
  if (list && list.length) {
    list.forEach((item) => {
      const obj = {}
      item.forEach((ytem, dex) => {
        if (dex > 2) {
          obj['name'] = item[1]
          obj[`${fieldKey}_${dex - 3}`] = ytem
        }
      })
      dataList.push(obj)
    })
  }

  return {
    nameList,
    dataList
  }
}

const getTableList = async (params?: any) => {
  tableObject.loading = true
  const res = await getHouseholdReportListApi({
    projectId: projectId,
    size: tableObject.size,
    page: tableObject.currentPage - 1,
    ...params
  }).finally(() => {
    tableObject.loading = false
  })
  if (res) {
    const { nameLink, list } = res as any
    // 拿到表头
    const { nameList, dataList } = getTableHeaderAndData(nameLink, list.content)

    const schemas = useCrudSchemas(nameList)
    allSchemas = schemas.allSchemas
    // 赋值表格数据
    tableObject.total = list.total
    tableObject.tableList = dataList || []
  }
}

// 搜索
const setSearchParams = (data: any) => {
  console.log(data, 'data')
  getTableList(data)
}

getTableList()

watch(
  () => tableObject.currentPage,
  () => {
    getTableList()
  }
)

watch(
  () => tableObject.size,
  () => {
    // 当前页不为1时，修改页数后会导致多次调用getList方法
    if (tableObject.currentPage === 1) {
      getTableList()
    } else {
      tableObject.currentPage = 1
      getTableList()
    }
  }
)
</script>
