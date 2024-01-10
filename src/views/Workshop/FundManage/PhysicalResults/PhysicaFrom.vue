<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">企业</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px"> {{ getTitle }}</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> {{ titles }}</div>
        <div></div>
      </div>
      <Table
        ref="tableRef"
        :data="tableObject.tableList"
        :columns="allSchemas.columns"
        :showOverflowTooltip="true"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        highlightCurrentRow
      />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getEnterpriseAppendant,
  getEnterpriseTree,
  getIndividualHouseholdTree
} from '@/api/fundManage/fundPayment-service'
import { useRoute, useRouter } from 'vue-router'
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { back } = useRouter()

const { currentRoute } = useRouter()
const { id } = currentRoute.value.query as any

const getTitle = computed(() => {
  return id === '2' ? '房屋及其附属物' : '零星林（果）木'
})

let Route = useRoute()
let tableRef = ref()

let allSchemas = reactive<any>({
  columns: []
})

let tableObject = reactive({
  tableList: []
})

const onBack = () => {
  back()
}

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
let titles = ref('')
onMounted(() => {
  let id = Route.query.id
  console.log('query-ID', id)
  if (id == '2') {
    document.title = '企业房屋及其附属物汇总表序号 行政村（公示表）'
    titles.value = '企业房屋及其附属物汇总表序号 行政村（公示表）'
    getEnterpriseAppendants(getEnterpriseAppendant())
  } else if (id == '3') {
    document.title = '企业零星林（果）木汇总表序号 行政村（公示表）'
    titles.value = '企业零星林（果）木汇总表序号 行政村（公示表）'
    getEnterpriseTrees(getEnterpriseTree())
  } else if (id == '5') {
    document.title = '个体户零星林（果）木汇总表序号 行政村（公示表）'
    titles.value = '个体户零星林（果）木汇总表序号 行政村（公示表）'
    getEnterpriseTrees(getIndividualHouseholdTree())
  }
})

let getEnterpriseAppendants = async (e) => {
  //附属物接口处理
  let data: any = await e
  let clome: any = [
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
  data.titles.forEach((item: any, index: any) => {
    if (data.houseTitles.includes(item)) {
      clome[3].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    } else if (data.appendantTitles.includes(item)) {
      clome[4].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    }
  })
  let allData = useCrudSchemas(clome)
  allSchemas.columns = allData.allSchemas.tableColumns
  tableObject.tableList = data.list.reduce((pre, iem) => {
    pre.push({ ...iem })
    return pre
  }, [])
}

let getEnterpriseTrees = async (e) => {
  let data: any = await e
  let clome: any = [
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
  data.titles.forEach((item: any, index: any) => {
    if (data.usageTitles.includes(item)) {
      clome[3].children.push({
        label: item,
        field: `${index}`,
        ...commonTableItemSchema
      })
    }
  })
  let allData = useCrudSchemas(clome)
  allSchemas.columns = allData.allSchemas.tableColumns
  tableObject.tableList = data.list.reduce((pre, iem) => {
    pre.push({ ...iem })
    return pre
  }, [])
}
</script>
