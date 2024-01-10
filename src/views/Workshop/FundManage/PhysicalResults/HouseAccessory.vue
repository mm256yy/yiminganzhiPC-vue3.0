<template>
  <WorkContentWrap>
    <div class="table-wrap" v-loading="tableLoading">
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="allSchemas.columns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        highlightCurrentRow
        height="550"
        style="width: 100%; max-height: 550px"
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getEnterpriseAppendant } from '@/api/fundManage/fundPayment-service'

let tableRef = ref()
const tableLoading = ref<boolean>(false)
let allSchemas = reactive<any>({
  columns: []
})

let tableObject = reactive({
  tableList: []
})

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

// 获取附属物数据
const requestHouseAccessory = async () => {
  let column: any = [
    {
      width: 80,
      field: 'index',
      type: 'index',
      label: '序号'
    },
    {
      field: '0',
      label: '行政村',
      ...commonTableItemSchema
    },
    {
      field: '1',
      label: '名称',
      ...commonTableItemSchema
    },
    {
      label: '房屋面积',
      children: [],
      ...commonTableItemSchema
    },
    {
      label: '附属物',
      children: [],
      ...commonTableItemSchema
    }
  ]

  tableLoading.value = true

  try {
    const result: any = await getEnterpriseAppendant()
    result.titles.forEach((item: any, index: any) => {
      if (result.houseTitles.includes(item)) {
        column[3].children.push({
          label: item,
          field: `${index}`,
          ...commonTableItemSchema
        })
      } else if (result.appendantTitles.includes(item)) {
        column[4].children.push({
          label: item,
          field: `${index}`,
          ...commonTableItemSchema
        })
      }
    })
    let allData = useCrudSchemas(column)
    allSchemas.columns = allData.allSchemas.tableColumns
    tableObject.tableList = result.list.reduce((pre, iem) => {
      pre.push({ ...iem })
      return pre
    }, [])
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

onMounted(() => {
  requestHouseAccessory()
})
</script>
