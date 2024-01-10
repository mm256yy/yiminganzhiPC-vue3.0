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
import { getEnterpriseTree } from '@/api/fundManage/fundPayment-service'

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

// 获取零星林（果）木数据
const requestFruitWood = async () => {
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
      label: '零星果木',
      children: [],
      ...commonTableItemSchema
    }
  ]
  tableLoading.value = true
  try {
    const result: any = await getEnterpriseTree()

    result.titles.forEach((item: any, index: any) => {
      if (result.usageTitles.includes(item)) {
        column[3].children.push({
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
  requestFruitWood()
})
</script>
