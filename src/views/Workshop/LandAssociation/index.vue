<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <!-- <ElBreadcrumbItem class="text-size-12px">实施工具</ElBreadcrumbItem> -->
      <ElBreadcrumbItem class="text-size-12px">土地关联</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="onReset" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left max-header">
          <span style="font-size: 14px; font-weight: 600">土地列表</span>
          <div>
            <span>（共 {{ tableObject.total }}条土地数据）</span>
          </div>
        </div>
        <ElSpace style="align-items: baseline">
          <ElButton type="primary" @click="onBind"> 关联绑定 </ElButton>
          <ElPopover :width="250" trigger="click">
            <template #reference>
              <ElButton type="primary"> 模板下载 </ElButton>
            </template>
            <div>
              <ElButtonGroup>
                <ElButton
                  type="primary"
                  text
                  @click="
                    onExport(getExportData, {
                      templateKey: 'land_relation',
                      ProjectId: projectId,
                      ProjectStatus: 'implementation'
                    })
                  "
                >
                  关联关系模板
                </ElButton>
                <ElButton
                  type="primary"
                  text
                  @click="
                    onExport(getExportData, {
                      templateKey: 'land_estimate',
                      ProjectId: projectId,
                      ProjectStatus: 'implementation'
                    })
                  "
                >
                  土地评估结果模板
                </ElButton>
                <ElButton
                  type="primary"
                  text
                  @click="
                    onExport(getExportData, {
                      templateKey: 'land_appendage',
                      ProjectId: projectId,
                      ProjectStatus: 'implementation'
                    })
                  "
                >
                  土地青苗及附着物评估结果模板
                </ElButton>
              </ElButtonGroup>
            </div>
          </ElPopover>
          <ElPopover :width="250" trigger="click">
            <template #reference>
              <ElButton type="primary"> 数据导入 </ElButton>
            </template>
            <div>
              <ElButtonGroup>
                <ElUpload
                  ref="upload"
                  v-model:file-list="fileList"
                  :headers="headers"
                  :show-file-list="false"
                  accept=".xls,.xlsx"
                  class="upload-demo"
                  :on-success="onImport"
                  :action="`/api/landEstimate/importData?projectId=${projectId}&templateKey=land_relation`"
                  :limit="1"
                >
                  <el-button type="primary" text>关联关系导入</el-button>
                </ElUpload>
                <ElUpload
                  ref="upload"
                  v-model:file-list="fileList"
                  :headers="headers"
                  :show-file-list="false"
                  accept=".xls,.xlsx"
                  class="upload-demo"
                  :on-success="onImport"
                  :action="`/api/landEstimate/importData?projectId=${projectId}&templateKey=land_estimate`"
                  :limit="1"
                >
                  <el-button type="primary" text>土地评估结果导入</el-button>
                </ElUpload>
                <ElUpload
                  ref="upload"
                  v-model:file-list="fileList"
                  :headers="headers"
                  :show-file-list="false"
                  accept=".xls,.xlsx"
                  class="upload-demo"
                  :on-success="onImport"
                  :action="`/api/landEstimate/importData?projectId=${projectId}&templateKey=land_appendage`"
                  :limit="1"
                >
                  <el-button type="primary" text>土地青苗及附着物评估结果导入</el-button>
                </ElUpload>
              </ElButtonGroup>
            </div>
          </ElPopover>
          <ElButton
            type="primary"
            @click="onExport(getEexportRelationList, { projectId, ...tableObject.params })"
          >
            数据导出
          </ElButton>
          <ElPopover :width="1000" trigger="click" @show="handelshow">
            <template #reference>
              <div class="view-upload">
                <span class="pr-10px">批量导入日志</span>
                <Icon icon="ant-design:eye-outlined" color="var(--el-color-primary)" />
              </div>
            </template>
            <div class="file-list" v-loading="loading">
              <div class="file-item" v-for="item in excelList" :key="item.id">
                <div class="file-name flex items-center flex-none w-372px">
                  <Icon icon="ant-design:file-sync-outlined" />
                  <div class="w-350px ml-5px">
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
                      条)
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
        </ElSpace>
      </div>
      <Table
        ref="tabalRef"
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
        :selection="true"
        @register="register"
        :header-cell-style="headerRow"
        max-height="700px"
      >
        <template #totalPrice="{ row }">
          <div>{{
            (row.areaCodeText || '') +
            '-' +
            (row.townCodeText || '') +
            '-' +
            (row.villageCodeText || '')
          }}</div>
        </template>
        <template #landLevel="{ row }">
          <div>{{ row.landTypeText }}</div>
        </template>
        <template #area="{ row }">
          {{ dictObj[326].filter((item) => item.value == row.area)[0].label }}
        </template>
        <template #landNature="{ row }">
          {{ dictObj[222].filter((item) => item.value == row.landNature)[0].label }}
        </template>
        <template #inundationRange="{ row }">
          {{ dictObj[346].filter((item) => item.value == row.inundationRange)[0].label }}
        </template>
        <template #relationFlag="{ row }">
          {{ row.relationFlag == '1' ? '已关联' : '未关联' }}
        </template>
        <template #estimateFlag="{ row }">
          {{ row.estimateFlag == '1' ? '已评估' : '未评估' }}
        </template>
        <template #filling="{ row }">
          <div class="flex">
            <ElButton
              link
              style="color: blue"
              @click="handleEdit(row)"
              v-if="row.relationFlag == '1'"
              >评估</ElButton
            >
          </div>
        </template>
      </Table>
    </div>
    <Edit
      :show="EditShow"
      :row="rows"
      :id="ids"
      :data="datas"
      @close="closeEdit"
      @get-field="getField"
    />
    <Dialog :model-value="flag" title="绑定成功" style="width: 600px" :max-height="150">
      绑定成功，是否继续进行资产评估？
      <template #footer>
        <ElButton type="primary" @click="onToPg">进行评估</ElButton>
        <ElButton @click="onClosePg">暂时不评</ElButton>
      </template>
    </Dialog>
  </WorkContentWrap>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick, toRaw } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Dialog } from '@/components/Dialog'
import {
  ElButton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElMessage,
  ElSpace,
  ElUpload,
  ElPopover,
  ElButtonGroup,
  ElMessageBox
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import dayjs from 'dayjs'
import {
  getLandEstimate,
  getDeleteById,
  getEexportRelationList
} from '@/api/fundManage/fundPayment-service'
import { getDistrictTreeApi } from '@/api/district'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDictByName, getPgExcelList } from '@/api/workshop/population/service'
import type { UploadInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { getExportData } from '@/api/fundManage/landimport'
import Edit from '@/views/Workshop/LandAssociation/EditForm.vue'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const districtTree = ref<any[]>([])
const landTypeOptions = ref<any>([])
const { register, tableObject, methods } = useTable({
  getListApi: getLandEstimate,
  delListApi: getDeleteById
})
const { getList, setSearchParams } = methods
const { push } = useRouter()
const flag = ref<any>(false)
const dataList = reactive({
  doorNo: '',
  householdId: '',
  name: '',
  type: '',
  estimateStatus: '1'
})
const closeEdit = () => {
  EditShow.value = false
}

const getField = (e: any) => {
  console.log('HHHH', e)
  dataList.doorNo = e.doorNo
  dataList.householdId = e.id
  dataList.name = e.name
  dataList.type = e.type
  EditShow.value = false
  getList()
  flag.value = true
  ElMessage.success('关联成功')
}

enum FileReportStatus {
  success = 'Succeed',
  failure = 'Failure',
  importing = 'Importing'
}
tableObject.params = {
  projectId,
  type: 'PeasantHousehold'
}
let fileList = ref()
let EditShow = ref(false)
getList()
let upload = ref<UploadInstance>()
const getdistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
  districtTree.value.push({
    name: '其他',
    code: '1'
  })
  return list || []
}
const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})
// 获取地类选项列表
const getLandTypeOptions = () => {
  getDictByName('土地类型').then((res: any) => {
    landTypeOptions.value = res
    landTypeOptions.value.forEach((item: any) => {
      item.id = item.value
      if (item.children) {
        item.children.forEach((key: any) => {
          key.id = item.value + '-' + key.value
        })
      }
    })
    console.log('土地类型', landTypeOptions.value)
  })
}
onMounted(() => {
  getdistrictTree()
  getLandTypeOptions()
  console.log(tableObject)
})
const onClosePg = () => {
  flag.value = false
}
const onToPg = () => {
  console.log(dataList, 'dataList')
  let type = ''
  switch (dataList.type) {
    case 'PeasantHousehold':
      type = 'Landlord'
      break
    case 'Company':
      type = 'Enterprise'
      break
    case 'IndividualHousehold':
      type = 'IndividualB'
      break
    case 'Village':
      type = 'VillageInfoC'
      break
    case 'LandNoMove':
      type = 'LandNoMoveL'
      break
    default:
      break
  }
  if (type.length > 0) {
    push({
      name: 'AssetEvaDataFillX',
      query: {
        projectId,
        householdId: dataList.householdId,
        name: dataList.name,
        doorNo: dataList.doorNo,
        type
        // estimateStatus: 1
      }
    })
  } else {
    ElMessage.info('暂未开发')
  }
}
const schema = reactive<CrudSchema[]>([
  {
    field: 'code',
    label: '权属单位',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
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
    field: 'doorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入户号'
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'householder',
    label: '户主',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入户主'
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'landNumber',
    label: '地块编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入地块编号'
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入使用权人'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'landName',
    label: '地名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入地名'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'landNature',
    label: '土地性质',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[222]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'landLeve',
    label: '地类',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: landTypeOptions,
        checkStrictly: true,
        renderAfterExpand: false,
        props: {
          value: 'id',
          label: 'label'
        },
        nodeKey: 'id'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'area',
    label: '所在区域',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[326]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'relationFlag',
    label: '关联状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          { label: '已关联', value: '1' },
          { label: '未关联', value: '0' }
        ]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'estimateFlag',
    label: '评估状态',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          { label: '已评估', value: '1' },
          { label: '未评估', value: '0' }
        ]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'inundationRange',
    label: '淹没范围',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: dictObj.value[346]
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'area',
    label: '所在区域',
    search: {
      show: false
    }
  },
  {
    field: 'inundationRange',
    label: '淹没范围',
    search: {
      show: false
    }
  },
  {
    field: 'sheetNumber',
    label: '图幅号',
    search: {
      show: false
    }
  },
  {
    field: 'landNumber',
    label: '地块编号',
    search: {
      show: false
    }
  },
  {
    field: 'householder',
    label: '户主',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '户号',
    search: {
      show: false
    }
  },
  {
    field: 'relationFlag',
    label: '关联状态',
    search: {
      show: false
    }
  },
  {
    field: 'estimateFlag',
    label: '评估状态',
    search: {
      show: false
    }
  },
  {
    field: 'landName',
    label: '地名',
    search: {
      show: false
    }
  },
  {
    field: 'totalPrice',
    label: '权属单位',
    search: {
      show: false
    }
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    search: {
      show: false
    }
  },
  {
    field: 'landNature',
    label: '土地性质',
    search: {
      show: false
    }
  },
  {
    field: 'xzdw',
    label: '现状地物',
    search: {
      show: false
    }
  },
  {
    field: 'landLevel',
    label: '地类',
    search: {
      show: false
    }
  },
  {
    field: 'shapeArea',
    label: '面积(㎡)',
    search: {
      show: false
    }
  },
  {
    field: 'shapeLeng',
    label: '周长(米)',
    search: {
      show: false
    }
  },
  {
    field: 'avgElevat',
    width: 100,
    label: '平均高程点',
    search: {
      show: false
    }
  },
  {
    field: 'minElevat',
    label: '最低高程点',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'maxElevat',
    label: '最高高程点',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'avgX',
    label: '平均经度',
    search: {
      show: false
    }
  },
  {
    field: 'minX',
    label: '最低经度',
    search: {
      show: false
    }
  },
  {
    field: 'maxX',
    label: '最高经度',
    search: {
      show: false
    }
  },
  {
    field: 'avgY',
    label: '平均纬度',
    search: {
      show: false
    }
  },
  {
    field: 'minY',
    label: '最低纬度',
    search: {
      show: false
    }
  },
  {
    field: 'maxY',
    label: '最高纬度',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  },
  {
    field: 'relationBy',
    label: '关联办理人',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'filling',
    label: '操作',
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

let { allSchemas } = useCrudSchemas(schema)
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
const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData, tableObject.params)

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }
  // 处理参数
  let params = {
    ...searchData
  }
  params[getParamsKey('Country')] = null
  params[getParamsKey('Township')] = null
  params[getParamsKey('Village')] = null
  params[getParamsKey('NaturalVillage')] = null
  params.ownershipUnitIsNull = null
  if (params.grantTime) {
    params.grantTime = [params.grantTime]
  }
  // for (let i in params) {
  //   if (!params[i]) {
  //     delete params[i]
  //   }
  // }
  console.log(params)

  if (params.code == '1') {
    params.ownershipUnitIsNull = '1'
    delete params.code
  }
  if (params.code) {
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
    })
    delete params.code
  }
  if (params.landLeve) {
    if (params.landLeve.includes('-')) {
      params.landLevelOne = params.landLeve.split('-')[0]
      params.landLevelTwo = params.landLeve.split('-')[1]
    } else {
      params.landLevelOne = params.landLeve
    }
    delete params.landLeve
  }
  console.log(params)

  setSearchParams({ ...params })
}

const onReset = () => {
  tableObject.params = {
    projectId,
    type: 'PeasantHousehold'
  }

  getList()
}

let onImport = () => {
  ElMessage.success('导入成功')
  getList()
  upload.value!.clearFiles()
}
let onExport = async (callback, name) => {
  let res = await callback(name)
  console.log(res)
  let filename = ''
  let url = ''
  if (res.headers) {
    filename = res.headers
    filename = filename['content-disposition']
    filename = filename.split(';')[1].split('filename=')[1]
    filename = decodeURIComponent(filename)
    let blob = new Blob([res.data])
    const URL = window.URL || window.webkitURL
    url = URL.createObjectURL(blob)
  } else {
    filename = res.name
    url = res.templateUrl
  }
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  elink.href = url
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}
let excelList = ref()
let loading = ref(false)
const getExcelUploadList = async () => {
  const type = 'landEstimateRelation'
  const res = await getPgExcelList(type)
  if (res && res.content) {
    excelList.value = res.content
  }
  loading.value = false
}
let handelshow = () => {
  loading.value = true
  getExcelUploadList()
}
let handleEdit = (row) => {
  let type = ''
  switch (row.householdType) {
    case 'PeasantHousehold':
      type = 'Landlord'
      break
    case 'Company':
      type = 'Enterprise'
      break
    case 'IndividualHousehold':
      type = 'IndividualB'
      break
    case 'Village':
      type = 'VillageInfoC'
      break
    case 'LandNoMove':
      type = 'LandNoMoveL'
      break
    default:
      break
  }
  if (type.length > 0) {
    push({
      name: 'AssetEvaDataFillX',
      query: {
        projectId,
        householdId: row.householdId,
        name: row.householder,
        doorNo: row.doorNo,
        type,
        estimateStatus: row.estimateFlag
      }
    })
  } else {
    ElMessage.info('暂未开发')
  }
}
let ids: any = ref([])
let rows: any = ref([])
let datas: any = ref([])
let onBind = () => {
  console.log(tabalRef.value.selections)
  datas.value = tabalRef.value.selections
  if (tabalRef.value.selections.length == 0) {
    ElMessage.info('请选择关联土地')
    return
  }
  let m = ''
  rows.value = []
  ids.value = []
  tabalRef.value.selections.forEach((item: any) => {
    rows.value.push(item.landNumber)
    ids.value.push(item.id)
    if (item.relationFlag == '1') {
      m += item.landNumber + `,`
    }
  })
  if (m.length > 0) {
    ElMessageBox.confirm(
      `土地编号：${m}已关联，是否继续关联，如选择继续关联，则以最新一次关联为准`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    ).then(() => {
      EditShow.value = true
    })
  } else {
    EditShow.value = true
  }
}
let headerRow = (data) => {
  if (data.columnIndex > 5 && data.columnIndex < 10) {
    return {
      background: 'rgb(161 252 253)'
    }
  }
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

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}

.max-header {
  width: 1000px;
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
