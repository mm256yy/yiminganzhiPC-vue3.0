<template>
  <div class="flex items-center">
    <ElButton @click="onBack" :icon="BackIcon" class="px-9px py-0px !h-28px mr-8px !text-12px">
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">实物成果</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">村集体</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">{{ getTitles(pageType) }}</ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="onReset"
      />
    </div>

    <div class="line"></div>
    <div class="table-wrap" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> {{ getTitles(pageType) }} </div>
        <ElButton type="primary" @click="onExport">数据导出</ElButton>
      </div>
      <el-table
        v-if="pageType === '1'"
        :data="houseList"
        :height="getHeight(houseList)"
        style="width: 100%"
      >
        <el-table-column prop="houseNo" label="幢号" align="center" header-align="center" />
        <el-table-column
          prop="storeyNumber"
          label="房屋层数"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="constructionTypeText"
          label="结构"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="landArea"
          label="房屋建筑面积（m²）"
          align="center"
          header-align="center"
        />
        <el-table-column prop="remark" label="备注" align="center" header-align="center" />
      </el-table>
      <el-table
        v-if="pageType === '2'"
        :data="appendantList"
        :height="getHeight(appendantList)"
        style="width: 100%"
      >
        <el-table-column prop="index" label="序号" align="center" header-align="center" />
        <el-table-column prop="name" label="类型" align="center" header-align="center" />
        <el-table-column prop="unitText" label="单位" align="center" header-align="center" />
        <el-table-column prop="sizeText" label="规格" align="center" header-align="center" />
        <el-table-column prop="number" label="数量" align="center" header-align="center" />
        <el-table-column prop="remark" label="备注" align="center" header-align="center" />
      </el-table>
      <el-table
        v-if="pageType === '3'"
        :data="treeList"
        :height="getHeight(treeList)"
        style="width: 100%"
      >
        <el-table-column prop="index" label="序号" align="center" header-align="center" />
        <el-table-column prop="name" label="品种" align="center" header-align="center" />
        <el-table-column prop="unitText" label="单位" align="center" header-align="center" />
        <el-table-column prop="sizeText" label="规格" align="center" header-align="center" />
        <el-table-column prop="number" label="数量" align="center" header-align="center" />
        <el-table-column prop="remark" label="备注" align="center" header-align="center" />
      </el-table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElTable, ElTableColumn, ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getVillageCollectiveListApi,
  exportReportApi
} from '@/api/workshop/dataQuery/villageCollective-service'
import { ParamsType } from '@/api/workshop/dataQuery/villageCollective-types'
import { screeningTree } from '@/api/workshop/village/service'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
const { currentRoute } = useRouter()
const { pageType } = currentRoute.value.query as any

const { back } = useRouter()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const emit = defineEmits(['export'])
const BackIcon = useIcon({ icon: 'iconoir:undo' })

const houseList = ref<any[]>([])
const appendantList = ref<any[]>([])
const treeList = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)

const { tableObject } = useTable({
  getListApi: getVillageCollectiveListApi
})

tableObject.params = {
  projectId
}

const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '村集体名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入村集体名称'
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

/**
 * 计算 table 的高度
 * @param arr 当前 table 的数据
 */
const getHeight = (arr: any) => {
  if (arr.length === 0) {
    return 150
  } else if (arr.length > 9) {
    return 500
  } else {
    return 'auto'
  }
}

// 获取表格标题
const getTitles = (type: string) => {
  const map = {
    '1': '房屋统计表',
    '2': '附属物统计表',
    '3': '零星林(果)木统计表'
  }
  return map[type]
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }

  for (let key in params) {
    if (!params[key]) {
      delete params[key]
    }
  }

  getTableList({})
}

const onReset = () => {
  tableObject.params = {}
  getTableList({})
}

/**
 * 获取表格数据
 * @param params 查询参数
 * villageCode 所属区域 code
 * householdName 村集体名称
 */
const getTableList = (params: ParamsType) => {
  loading.value = true
  getVillageCollectiveListApi(params)
    .then((res: any) => {
      if (res) {
        houseList.value = res.houseList
        appendantList.value = res.appendantList
        treeList.value = res.treeList
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 数据导出
const onExport = async () => {
  const params = {
    exportType: pageType
  }
  const res = await exportReportApi(params)
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
  villageTree.value = list || []
  return list || []
}

const onBack = () => {
  back()
}

onMounted(() => {
  getVillageTree()
  getTableList({})
})
</script>
<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
