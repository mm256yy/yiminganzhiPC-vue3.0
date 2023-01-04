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
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="text"
            >共<span class="num">{{ headInfo.peasantHouseholdNum }}</span
            >户<span class="distance"></span><span class="num">{{ headInfo.demographicNum }}</span
            >人
          </div>
        </div>
        <ElSpace>
          <ElPopover
            v-if="excelList && excelList.length"
            placement="bottom"
            :width="460"
            trigger="hover"
          >
            <template #reference>
              <div class="view-upload">
                <span class="pr-10px">批量导入</span>
                <Icon icon="ant-design:eye-outlined" color="var(--el-color-primary)" />
              </div>
            </template>
            <div class="file-list">
              <div class="file-item">
                <div class="flex items-center">
                  <Icon icon="ant-design:file-sync-outlined" />
                  <div class="ml-5px">范德萨地方.excl</div>
                </div>
                <div class="status">
                  <div class="flex items-center">
                    <span class="pr-10px"
                      >( 共导入 <span class="number">20</span> 人，<span class="number">20</span> 户
                      )</span
                    >
                    <Icon icon="ant-design:check-circle-outlined" color="#30A952" />
                  </div>

                  <!-- <div class="flex items-center text-[#F93F3F]">
                    <span class="pr-10px">上传失败</span>
                    <Icon icon="ant-design:close-circle-outlined" color="#F93F3F" />
                  </div> -->
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
          <ElButton :icon="downloadIcon" type="default" @click="onDownloadTemplate"
            >模版下载</ElButton
          >
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
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        @register="register"
        :showOverflowTooltip="false"
      >
        <template #longitude="{ row }">
          <div>{{ row.longitude || '-' }}</div>
          <div>{{ row.latitude || '-' }}</div>
        </template>
        <template #action="{ row }">
          <TableEditColumn :view-type="'link'" :row="row" :edit="false" @delete="onDelRow" />
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
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
  console.log(list, 'village list')
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
  console.log(res, 'list')
}

onMounted(() => {
  getVillageTree()
  getDemographicHeadInfo()
  getExcelUploadList()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    fixed: true,
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    fixed: true,
    width: 88,
    search: {
      show: false
    }
  },
  {
    field: 'sex',
    label: '性别',
    width: 88,
    search: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '户籍册编号',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'relation',
    label: '与户主关系',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'townCodeText',
    label: '街道/乡镇',
    width: 150,
    search: {
      show: false
    }
  },
  {
    field: 'villageText',
    label: '行政村',
    width: 150,
    search: {
      show: false
    }
  },
  {
    field: 'virutalVillageText',
    label: '自然村',
    width: 136,
    search: {
      show: false
    }
  },
  {
    field: 'phone',
    label: '联系方式',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'censusRegister',
    label: '户籍所在地',
    width: 188,
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 106,
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
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'villageCode',
    label: '行政区划',
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
    field: 'doorNo',
    label: '户籍册编号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户籍册编号'
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
    Village: 'neighborhoodCommittee',
    naturalVillage: 'villageCode'
  }
  return map[key]
}

const onSearch = (data) => {
  // 处理参数
  let params = {
    ...data
  }
  if (params.villageCode) {
    // 拿到对应的参数key
    findRecursion(villageTree.value, params.villageCode, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.villageCode
      }
      delete params.villageCode
      setSearchParams(params)
    })
  } else {
    delete params.villageCode
    setSearchParams(params)
  }
}

// todo
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
  align-items: center;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  color: var(--text-color-1);
  font-weight: 500;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  border-radius: 4px;
  border: 1px solid #ebebeb;
  cursor: default;
}

.file-list {
  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 0 16px;
    height: 40px;
    font-size: 14px;
    color: var(--text-color-1);

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }
  }
}
</style>
