<template>
  <div class="box-wrapper">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">实施工具</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">坟墓择址</ElBreadcrumbItem>
    </ElBreadcrumb>
    <WorkContentWrap>
      <div class="search-wrap">
        <Search
          :schema="allSchemas.searchSchema"
          :defaultExpand="false"
          :expand-field="'card'"
          @search="onSearch"
          @reset="onReset"
        />
      </div>
      <div class="line"></div>
      <div class="table-wrap !py-12px !mt-0px" v-loading="tableLoading">
        <div class="flex items-center justify-between pb-12px">
          <div> 坟墓择址 </div>
          <ElSpace>
            <ElButton
              :icon="saveIcon"
              type="primary"
              class="!bg-[#30A952] !border-[#30A952] save-btn"
              @click="onSave"
            >
              批量保存
            </ElButton>
          </ElSpace>
        </div>
        <ElTable :data="tableData" style="width: 100%">
          <ElTableColumn
            label="序号"
            :width="60"
            type="index"
            align="center"
            header-align="center"
          />
          <ElTableColumn label="所属区域" prop="region" align="center" header-align="center">
            <template #default="{ row }">
              {{
                `
              ${row.cityCodeText ? row.cityCodeText + '/' : ''}
              ${row.areaCodeText ? row.areaCodeText : ''}
              ${row.townCodeText ? '/' + row.townCodeText : ''}
              ${row.villageText ? '/' + row.villageText : ''}
              ${row.virutalVillageText ? '/' + row.virutalVillageText : ''}
              `
              }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="户主姓名" prop="name" align="center" header-align="center" />
          <ElTableColumn label="户号" prop="showDoorNo" align="center" header-align="center" />
          <ElTableColumn prop="relationText" label="坟墓与登记人关系" align="center" />
          <ElTableColumn prop="graveTypeText" label="穴位" align="center" />
          <ElTableColumn prop="number" label="数量" align="center" />
          <ElTableColumn prop="handleWay" label="处理方式" align="center">
            <template #default="{ row }">
              <ElSelect
                clearable
                filterable
                placeholder="请选择"
                v-model="row.handleWay"
                @change="handleSelectChange"
              >
                <ElOption
                  v-for="item in dictObj[238]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="settingGrave" label="安置公墓/择址地址" align="center">
            <template #default="{ row }">
              <ElSelect
                v-if="isTomb"
                clearable
                filterable
                placeholder="请选择"
                v-model="row.settingGrave"
              >
                <ElOption
                  v-for="item in dictObj[377]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <ElInput v-else placeholder="请输入" v-model="row.settingGrave" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="graveNo" label="坟墓编号" align="center">
            <template #default="{ row }">
              <ElInput placeholder="请输入" v-model="row.graveNo" />
            </template>
          </ElTableColumn>
          <ElTableColumn prop="remark" label="备注" align="center">
            <template #default="{ row }">
              <ElInput placeholder="请输入" v-model="row.remark" />
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" prop="action" fixed="right">
            <template #default="scope">
              <ElButton link type="primary" @click="onRowUpload(scope.row)">档案上传</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <div class="py-[10px] bg-[#fff]" style="padding-left: 10px">
        <ElPagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableObject.params.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <TombUpload :show="dialog" :door-no="doorNo" @close="close" />
    </WorkContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElSpace,
  ElTable,
  ElInput,
  ElTableColumn,
  ElMessage,
  ElSelect,
  ElOption,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination,
  ElMessageBox
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  getTombSiteListApi,
  saveBatchTombFileApi
} from '@/api/AssetEvaluation/landBasicInfo-service'
import { getDictByName } from '@/api/workshop/population/service'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { useAppStore } from '@/store/modules/app'
import { useTable } from '@/hooks/web/useTable'
import TombUpload from '../components/TombUpload.vue'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const landTypeOptions = ref<any>([]) // 地类选项
const dialog = ref<boolean>(false)
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const doorNo = ref<string>('')
const emit = defineEmits(['updateData'])
const villageTree = ref<any[]>([])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tableLoading = ref<boolean>(false)
const isTomb = ref<boolean>(false)

const { tableObject } = useTable()
const pageSize = ref(10)
const pageNum = ref(1)
tableObject.params = {
  projectId,
  status: 'implementation'
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
        flat: true
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '户号',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户号'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '户主姓名',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入户主名称'
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const close = () => {
  dialog.value = false
  getList()
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

  tableObject.params = {
    ...tableObject.params,
    ...params
  }
  getList()
}

// 重置
const onReset = () => {
  tableObject.params = {
    projectId,
    status: 'implementation'
  }
  getList()
}

const handleSelectChange = (value: any) => {
  isTomb.value = value === '2'
}

const handleSizeChange = (val: number) => {
  tableObject.params.size = val
  getList()
}
const handleCurrentChange = (val: number) => {
  tableObject.params.currentPage = val
  getList()
}

// 获取列表数据
const getList = async () => {
  tableLoading.value = true
  try {
    const params = {
      ...tableObject.params,
      page: pageNum.value - 1,
      size: pageSize.value
    }
    const result = await getTombSiteListApi(params)
    tableData.value = result.content
    tableObject.params.total = result.total
    tableLoading.value = false
  } catch {
    tableData.value = []
    tableLoading.value = false
  }
}

// 获取地类选项列表
const getLandTypeOptions = () => {
  getDictByName('土地类型').then((res: any) => {
    landTypeOptions.value = res
  })
}

// 保存
const onSave = () => {
  ElMessageBox.confirm(`确定要批量保存吗？`)
    .then(async () => {
      const tableList = tableData.value.map((item) => {
        return {
          ...item,
          projectId
        }
      })
      saveBatchTombFileApi(tableList).then(() => {
        ElMessage.success('操作成功！')
        getList()
      })
    })
    .catch(() => {})
}

// 档案上传
const onRowUpload = (row: any) => {
  doorNo.value = row.doorNo
  dialog.value = true
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
  villageTree.value = list || []
  return list || []
}

onMounted(() => {
  getVillageTree()
  getList()
  getLandTypeOptions()

  console.log('LPP', dictObj.value[238])
})
</script>
<style lang="less" scoped>
.btn-txt {
  color: red;
  cursor: pointer;
}

.title-hint {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}

.box-wrapper {
  min-width: 100%;
  position: relative;
  top: 0;
  left: 0;
}

.save-btn {
  position: relative;
  right: 10px;
  top: 2px;
}
</style>
