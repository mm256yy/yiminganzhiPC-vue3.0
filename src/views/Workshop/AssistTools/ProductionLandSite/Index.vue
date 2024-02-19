<template>
  <div class="box-wrapper">
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">实施工具</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">生产用地择址</ElBreadcrumbItem>
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
          <div> 生产用地择址 </div>
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
        <ElTable :data="tableData" style="width: 100%" height="600">
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
          <ElTableColumn
            label="安置点"
            prop="settleAddressText"
            align="center"
            header-align="center"
          />
<<<<<<< HEAD
          <<<<<<< HEAD
          <!-- <ElTableColumn label="户型" prop="area" align="center" header-align="center" /> -->
          =======
          <ElTableColumn label="户型" prop="area" align="center" header-align="center" />
          >>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
=======
          <ElTableColumn label="户型" prop="area" align="center" header-align="center" />
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
          <ElTableColumn label="地块编号" prop="landNo" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable placeholder="请选择" v-model="row.landNo">
                <ElOption
                  v-for="item in row.landNoOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                  :disabled="item.isOccupy === '1'"
                />
              </ElSelect>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="土地面积（亩）"
<<<<<<< HEAD
            prop="landArea"
=======
            prop="placeOrder"
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
            align="center"
            header-align="center"
          >
            <template #default="{ row }">
<<<<<<< HEAD
              <ElInputNumber placeholder="请输入" :min="0" v-model="row.landArea" />
=======
              <ElInputNumber placeholder="请输入" :min="0" v-model="row.placeOrder" />
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="操作"
            prop="action"
            fixed="right"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <ElButton link type="primary" @click="onRowUpload(scope.row)">档案上传</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <div class="py-[10px] bg-[#fff]" style="padding-left: 10px">
        <ElPagination
<<<<<<< HEAD
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
=======
          v-model:current-page="tableObject.params.currentPage"
          v-model:page-size="tableObject.params.size"
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableObject.params.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <DefaultUpload :show="dialog" :door-no="doorNo" @close="close" />
    </WorkContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPagination,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
<<<<<<< HEAD
  getProductionLandSiteListApi,
=======
  getHomesteadLandSiteListApi,
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
  saveBatchProductionLandFileApi
} from '@/api/AssetEvaluation/landBasicInfo-service'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { useAppStore } from '@/store/modules/app'
import DefaultUpload from '../components/DefaultUpload.vue'
import { getChooseConfigApi } from '@/api/immigrantImplement/siteConfirmation/common-service'
import { useTable } from '@/hooks/web/useTable'

const dialog = ref<boolean>(false)
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const doorNo = ref<string>('')
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const tableLoading = ref<boolean>(false)
const emit = defineEmits(['updateData'])
const villageTree = ref<any[]>([])
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const { tableObject } = useTable()
<<<<<<< HEAD
const pageSize = ref(10)
const pageNum = ref(1)
// const totalNum = ref(0)
=======

>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
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
  },
  {
    field: 'settleAddress"',
    label: '安置点',
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

// 档案上传
const onRowUpload = (row: any) => {
  doorNo.value = row.doorNo
  dialog.value = true
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

const close = () => {
  dialog.value = false
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

const handleSizeChange = (val: number) => {
<<<<<<< HEAD
  pageSize.value = val
  getList()
}
const handleCurrentChange = (val: number) => {
  console.log(val, '测试数据')
  pageNum.value = val
=======
  tableObject.params.size = val
  getList()
}
const handleCurrentChange = (val: number) => {
  tableObject.params.currentPage = val
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
  getList()
}

// 获取列表数据
const getList = async () => {
  tableLoading.value = true
  try {
<<<<<<< HEAD
    const params = {
      ...tableObject.params,
      page: pageNum.value - 1,
      size: pageSize.value
    }
    const result = await getProductionLandSiteListApi(params)
=======
    const result = await getHomesteadLandSiteListApi(tableObject.params)
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
    const arr: any = []
    result.content.map((item: any) => {
      arr.push({
        ...item,
        landNoOptions: []
      })
    })

    arr.map(async (item: any) => {
<<<<<<< HEAD
      // item.settleAddress
      item.landNoOptions = await getLandNoList()
=======
      item.landNoOptions = await getLandNoList(item.settleAddress)
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
    })

    tableData.value = arr || []
    tableObject.params.total = result.total
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

// 保存
const onSave = () => {
  ElMessageBox.confirm(`确定要批量保存吗？`)
    .then(async () => {
      const tableList = tableData.value.map((item) => {
        return {
          ...item
        }
      })
      saveBatchProductionLandFileApi(tableList).then(() => {
        ElMessage.success('操作成功！')
        getList()
      })
    })
    .catch(() => {})
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'village')
  villageTree.value = list || []
  return list || []
}

// 获取宅基地地块编号选项列表
<<<<<<< HEAD
const getLandNoList = async () => {
  let arr: any = []
  // if (settleAddress) {
  let params = {
    projectId,
    type: 1
    // settleAddress
  }
  const res = await getChooseConfigApi(params)
  if (res && res?.content.length) {
    arr = [...res.content]
  }
  // }
=======
const getLandNoList = async (settleAddress?: string) => {
  let arr: any = []
  if (settleAddress) {
    let params = {
      projectId,
      type: 2,
      settleAddress
    }
    const res = await getChooseConfigApi(params)
    if (res && res?.content.length) {
      arr = [...res.content]
    }
  }
>>>>>>> a36f2fa55c4167857a1f4d6a5f9b2c205ab62912
  return arr
}

onMounted(() => {
  getVillageTree()
  getList()
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
