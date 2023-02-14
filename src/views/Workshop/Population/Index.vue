<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">基础设置</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">人口信息预导入</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParams" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <span style="margin: 0 10px; font-size: 16px; font-weight: 600">人口预导入表</span>

          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text">
            共 <span class="num">{{ headInfo.peasantHouseholdNum }}</span> 户
            <span class="distance"></span> <span class="num">{{ headInfo.demographicNum }}</span> 人
          </div>
        </div>
        <ElSpace>
          <ElPopover v-if="excelList && excelList.length" :width="800" trigger="hover">
            <template #reference>
              <div class="view-upload">
                <span class="pr-10px">批量导入记录</span>
                <Icon icon="ant-design:eye-outlined" color="var(--el-color-primary)" />
              </div>
            </template>
            <div class="file-list">
              <div class="file-item" v-for="item in excelList" :key="item.id">
                <div class="file-name flex items-center">
                  <Icon icon="ant-design:file-sync-outlined" />
                  <div class="w-200px ml-5px">
                    {{ item.name }}
                  </div>
                </div>
                <div class="flex m-lr-20px">
                  {{ item.remark }}
                </div>
                <div class="status flex-shrink-0">
                  <div class="flex items-center" v-if="item.status === FileReportStatus.success">
                    <span class="pr-10px">
                      ( 共导入 <span class="number">{{ item.demographicNum }}</span> 人，
                      <span class="number">{{ item.peasantHouseholdNum }}</span> 户 )
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

          <ElUpload
            action="/api/peasantHousehold/import"
            :headers="headers"
            :data="{ projectId }"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            :on-success="uploadDone"
            :on-error="uploadError"
          >
            <template #trigger>
              <ElButton :icon="importIcon" type="primary">批量导入</ElButton>
            </template>
          </ElUpload>
          <ElButton :icon="downloadIcon" type="default" @click="onDownloadTemplate">
            模版下载
          </ElButton>
        </ElSpace>
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
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
      >
        <template #longitude="{ row }">
          <div>{{ row.longitude || '-' }}</div>
          <div>{{ row.latitude || '-' }}</div>
        </template>
        <template #createdDate="{ row }">
          <div>{{ formatDate(row.createdDate) }}</div>
        </template>

        <template #age="{ row }">
          <div>{{ analyzeIDCard(row.card) }}</div>
        </template>

        <template #action="{ row }">
          <TableEditColumn
            :view-type="'link'"
            :disabled="row.relation === '1'"
            :row="row"
            :edit="false"
            @delete="onDelRow"
          />
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElButton,
  ElSpace,
  ElUpload,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPopover,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getDemographicListApi,
  delDemographicByIdApi,
  getDemographicHeadApi,
  getExcelList
} from '@/api/workshop/population/service'
import { downLandlordTemplateApi } from '@/api/workshop/landlord/service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import type {
  DemographicDtoType,
  DemographicHeadType,
  ExcelListType
} from '@/api/workshop/population/types'
import { Icon } from '@/components/Icon'
import { formatDate, analyzeIDCard } from '@/utils/index'

enum FileReportStatus {
  success = 'Succeed',
  failure = 'Failure',
  importing = 'Importing'
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const downloadIcon = useIcon({ icon: 'ant-design:cloud-download-outlined' })
const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
const villageTree = ref<any[]>([])
const headInfo = ref<DemographicHeadType>({
  demographicNum: 0,
  peasantHouseholdNum: 0
})
const uploadLoading = ref(false)
const excelList = ref<ExcelListType[]>([])
let timer = 0

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList, setSearchParams } = methods

const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})

tableObject.params = {
  projectId
}

getList()

const getVillageTree = async () => {
  const list = await getVillageTreeApi(projectId)
  villageTree.value = list || []
  return list || []
}

const getDemographicHeadInfo = async () => {
  const info = await getDemographicHeadApi()
  headInfo.value = info
}

const getExcelUploadList = async () => {
  const res = await getExcelList()
  if (res && res.content) {
    excelList.value = res.content
  }
}

onMounted(() => {
  getVillageTree()
  getDemographicHeadInfo()
  getExcelUploadList()
  timer = window.setInterval(() => {
    getExcelUploadList()
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = 0
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },
  {
    field: 'age',
    label: '年龄',
    search: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'nationText',
    label: '民族',
    search: {
      show: false
    }
  },

  {
    field: 'censusRegister',
    label: '户籍所在地',
    search: {
      show: false
    }
  },
  {
    field: 'censusTypeText',
    label: '户籍类型',
    search: {
      show: false
    }
  },
  {
    field: 'maritalText',
    label: '婚姻状况',
    search: {
      show: false
    }
  },
  {
    field: 'populationTypeText',
    label: '人口类型',
    search: {
      show: false
    }
  },
  {
    field: 'insuranceTypeText',
    label: '参保情况',
    search: {
      show: false
    }
  },

  // {
  //   field: 'householdNumber',
  //   label: '户籍册编号',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'relationText',
  //   label: '与户主关系',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'townCodeText',
  //   label: '街道/乡镇',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'villageText',
  //   label: '行政村',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'virutalVillageText',
  //   label: '自然村',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'phone',
  //   label: '联系方式',
  //   search: {
  //     show: false
  //   }
  // },

  // {
  //   field: 'createdDate',
  //   label: '导入时间',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    search: {
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
    field: 'relation',
    label: '是否户主',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '是',
            value: '1'
          },
          {
            label: '否',
            value: '0'
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'code',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择县\街道\行政村\自然村',
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
    label: '姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号'
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

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
  console.log(searchData)

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
  tableObject.params = {
    projectId
  }
  if (params.code) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
      delete params.code
      setSearchParams({ ...params })
    })
  } else {
    delete params.code
    setSearchParams({ ...params })
  }
}

const onDownloadTemplate = () => {
  downLandlordTemplateApi('demographic').then((res) => {
    if (res && res.templateUrl) {
      window.open(res.templateUrl)
    }
  })
}

const beforeUpload = () => {
  uploadLoading.value = true
}

const uploadDone = () => {
  uploadLoading.value = false
}

const uploadError = (error) => {
  try {
    const response = JSON.parse(error.message)
    ElMessage.error(response.message)
    uploadLoading.value = false
  } catch (err) {
    // err
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
    justify-content: space-between;

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
  }
}
</style>
