<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资产评估</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">村集体信息</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search
        :schema="allSchemas.searchSchema"
        expand
        :defaultExpand="false"
        :expand-field="'doorNo'"
        @search="onSearch"
        @reset="setSearchParams"
      />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">村集体列表</span>

          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            共 <span class="num">{{ headInfo.peasantHouseholdNum }}</span> 家村集体
            <span class="distance"></span>
            已填报 <span class="num !text-[#30A952]">{{ headInfo.assessNumber }}</span> 家
            <span class="distance"></span>
            未填报 <span class="num !text-[#FF3030]">{{ headInfo.notAssessNumber }}</span> 家
          </div>
        </div>
        <ElSpace>
          <ElPopover v-if="excelList && excelList.length" :width="1000" trigger="click">
            <template #reference>
              <div class="view-upload">
                <span class="pr-10px">批量导入记录</span>
                <Icon icon="ant-design:eye-outlined" color="var(--el-color-primary)" />
              </div>
            </template>
            <div class="file-list">
              <div class="file-item" v-for="item in excelList" :key="item.id">
                <div class="file-name flex items-center flex-none w-272px">
                  <Icon icon="ant-design:file-sync-outlined" />
                  <div class="w-250px ml-5px">
                    {{ item.name }}
                  </div>
                </div>
                <div class="flex-none w-150px">{{
                  item.createdDate ? dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') : ''
                }}</div>
                <div class="flex-none w-398px m-lr-20px">
                  {{ item.remark }}
                </div>
                <div class="flex-shrink-0">
                  <div class="flex items-center" v-if="item.status === FileReportStatus.success">
                    <span class="pr-10px">
                      ( 共导入
                      <span class="number">{{ item.num ? '' + item.num : '-' }}</span>
                      户数据
                      <!-- <span class="number">{{
                        item.peasantHouseholdNum ? '' + item.peasantHouseholdNum : '-'
                      }}</span>
                      户 ) -->
                    </span>
                    <Icon icon="ant-design:check-circle-outlined" color="#30A952" />
                  </div>

                  <div
                    class="flex items-center text-[#F93F3F]"
                    v-else-if="item.status === FileReportStatus.failure"
                  >
                    <span class="pr-10px">上传失败</span>
                    <Icon icon="ant-design:close-circle-outlined" color="#F93F3F" />
                  </div>

                  <div v-else>导入中</div>
                </div>
              </div>
            </div>
          </ElPopover>
          <ElButton type="primary" @click="onExport" :icon="downloadIcon"> 下载模板 </ElButton>
          <ElButton type="primary" @click="onImport" :icon="importIcon"> 批量导入 </ElButton>
        </ElSpace>
      </div>
      <Table
        selection
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :pagination="{
          total: tableObject.total
        }"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #regionText="{ row }">
          <div>
            {{
              `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
              ${row.villageText ? '/' + row.villageText : ''}
              ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
              `
            }}
          </div>
        </template>

        <template #hasPropertyAccount="{ row }">
          <div>{{ row.hasPropertyAccount ? '是' : '否' }}</div>
        </template>
        <template #houseImplementEscalationStatus="{ row }">
          <div>
            <span
              :class="[
                'report-status',
                row.houseImplementEscalationStatus === '1' ? 'status-suc' : 'status-err'
              ]"
            >
              {{ row.houseImplementEscalationStatus === '1' ? '报告已上传' : '报告未上传' }}
            </span>
          </div>
        </template>
        <template #estimateStatus="{ row }">
          <div class="flex items-center justify-center">
            <span
              :class="['status', row.estimateStatus === '1' ? 'status-suc' : 'status-err']"
            ></span>
            <span :class="[row.estimateStatus === '1' ? '' : 'red']">
              {{ row.estimateStatus === '1' ? '已评估' : '未评估' }}
            </span>
            <span
              class="!hidden"
              :class="['ml-5', row.implementEscalationStatus === '0' ? 'red' : '']"
            >
              {{ row.implementEscalationStatus === '0' ? '未上传报告' : '已上传报告' }}
            </span>
          </div>
        </template>
        <template #estimateTime="{ row }">
          <div>{{ formatTime(row.estimateTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
        </template>
        <template #locationType="{ row }">
          <div>{{ getLocationText(row.locationType) }}</div>
        </template>

        <template #filling="{ row }">
          <div class="filling-btn" @click="fillData(row)">数据评估</div>
        </template>
      </Table>
    </div>
    <Export
      :show="exportDialog"
      @close="onExportDialogClose"
      :list="exportList"
      :type="'Village'"
      :flag="1"
    />
    <InExport
      :show="inExportDialog"
      @close="inExportDialogClose"
      :list="importList"
      :type="'Village'"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElBreadcrumb, ElBreadcrumbItem, ElSpace, ElButton, ElPopover } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { Table } from '@/components/Table'

import { getLandlordListApi, getLandlordHeadApi } from '@/api/AssetEvaluation/service'
import type { LandlordHeadInfoType } from '@/api/workshop/landlord/types'
import { screeningTree } from '@/api/workshop/village/service'
import { locationTypes, SurveyStatusEnum } from '@/views/Workshop/components/config'
import { formatTime } from '@/utils/index'

import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import Export from '@/views/Workshop/components/Export.vue'
import InExport from '@/views/Workshop/components/InExport.vue'
import { getPgExcelList } from '@/api/workshop/population/service'
import dayjs from 'dayjs'
const { currentRoute } = useRouter()

enum FileReportStatus {
  success = 'Succeed',
  failure = 'Failure',
  importing = 'Importing'
}

const excelList = ref<any[]>([])
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const { push } = useRouter()
const exportDialog = ref(false)
const inExportDialog = ref(false)
const villageTree = ref<any[]>([])
const headInfo = ref<any>({
  demographicNum: 0,
  peasantHouseholdNum: 0,
  reportSucceedNum: 0,
  unReportNum: 0,
  assessNumber: 0,
  notAssessNumber: 0
})
const downloadIcon = useIcon({ icon: 'ant-design:cloud-download-outlined' })
const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
interface exportListType {
  name: string
  value: string | number
}
let timer = 0
const exportList = ref<exportListType[]>([
  {
    name: '房屋评估表',
    value: 'assetEval_village_house'
  },
  {
    name: '房屋装修表',
    value: 'assetEval_village_fitup'
  },
  {
    name: '附属物调查表',
    value: 'assetEval_village_appendage'
  },
  {
    name: '基础设施评估表',
    value: 'assetEval_village_infra'
  },
  {
    name: '零星林果木调查表',
    value: 'assetEval_village_tree'
  },
  {
    name: '小型专项及农副业设施表',
    value: 'assetEval_village_facilities'
  }
])
const importList = ref<exportListType[]>([
  {
    name: '零星林果木调查表',
    value: 'assetEval_village_tree'
  },
  {
    name: '房屋评估表',
    value: 'assetEval_village_house'
  },
  {
    name: '房屋装修表',
    value: 'assetEval_village_fitup'
  },
  {
    name: '附属物调查表',
    value: 'assetEval_village_appendage'
  },
  {
    name: '基础设施评估表',
    value: 'assetEval_village_infra'
  },
  {
    name: '小型专项及农副业设施表',
    value: 'assetEval_village_facilities'
  }
])
const onExport = () => {
  exportDialog.value = true
  console.log('1111111')
}
const onImport = () => {
  inExportDialog.value = true
  console.log('导入')
}
const onExportDialogClose = () => {
  exportDialog.value = false
}
const inExportDialogClose = () => {
  inExportDialog.value = false
}
const { register, tableObject, methods } = useTable({
  getListApi: getLandlordListApi
})
const { setSearchParams } = methods

tableObject.params = {
  projectId,
  status: 'implementation'
}

setSearchParams({
  type: 'Village',
  status: SurveyStatusEnum.Implementation,
  estimateStatus: currentRoute.value.query['estimateStatus']
})

const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'Village')
  villageTree.value = list || []
  return list || []
}

const getLandlordHeadInfo = async () => {
  const info = await getLandlordHeadApi({
    type: 'Village',
    status: SurveyStatusEnum.Implementation
  })
  headInfo.value = info
}
const getExcelUploadList = async () => {
  const type = 'assetEval_village'
  const res = await getPgExcelList(type)
  if (res && res.content) {
    excelList.value = res.content
  }
}

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = 0
})
onMounted(() => {
  getVillageTree()
  getLandlordHeadInfo()
  getExcelUploadList()
  timer = window.setInterval(() => {
    getExcelUploadList()
  }, 3000)
})
const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
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
    field: 'name',
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
  },
  {
    field: 'showDoorNo',
    label: '村集体编码',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入编码'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '联系方式',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式'
      }
    },
    table: {
      show: false
    }
  },

  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'name',
    label: '村集体名称',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '村集体编码',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '联系方式',
    search: {
      show: false
    }
  },
  {
    field: 'regionText',
    label: '所属区域',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'locationType',
    label: '所在位置',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[326]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'estimateUser',
    label: '评估人',
    search: {
      show: false
    }
  },
  {
    field: 'estimateStatus',
    label: '评估状态',
    search: {
      show: false
    }
  },
  {
    field: 'houseImplementEscalationStatus',
    label: '报告上传状态',
    search: {
      show: false
    }
  },
  {
    field: 'estimateTime',
    label: '评估时间',
    search: {
      show: false
    },
    showOverflowTooltip: false
  },
  {
    field: 'filling',
    label: '评估',
    fixed: 'right',
    width: 115,
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
])

const { allSchemas } = useCrudSchemas(schema)

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}

const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}

const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (!data.implementFillStatus) {
    Reflect.deleteProperty(params, 'implementFillStatus')
  }

  // 需要重置一次params
  tableObject.params = {
    projectId
  }
  if (!params.hasPropertyAccount) {
    delete params.hasPropertyAccount
  }

  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }

      params.type = 'Village'
      params.status = SurveyStatusEnum.Implementation
      setSearchParams({ ...params })
    })
  } else {
    params.type = 'Village'
    params.status = SurveyStatusEnum.Implementation
    setSearchParams({ ...params })
  }
}

// 数据填报
const fillData = (row) => {
  push({
    name: 'AssetEvaDataFill',
    query: {
      projectId,
      householdId: row.id,
      doorNo: row.doorNo,
      type: 'VillageInfoC',
      estimateStatus: row.estimateStatus
    }
  })
}
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}

.report-status {
  &.status-err {
    color: #ff3939;
  }

  &.status-suc {
    color: #0cc029;
  }
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}
</style>
