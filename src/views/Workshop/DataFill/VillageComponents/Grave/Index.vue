<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <ElSpace>
          <ElUpload
            action="/api/immigrantGrave/import"
            :headers="headers"
            :data="{ peasanHouseId, templateKey }"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            :on-success="uploadDone"
            :on-error="uploadError"
          >
            <template #trigger>
              <ElButton :icon="importIcon" type="primary" :loading="uploadLoading">
                批量导入
              </ElButton>
            </template>
          </ElUpload>
          <ElButton :icon="downloadIcon" type="default" @click="onDownloadTemplate">
            模版下载
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
          <ElInput v-model="sersoud" placeholder="请输入登记人或户号" />
          <ElButton type="primary" @click="getList">搜索</ElButton>
          <ElButton
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="
              () => {
                sersoud = null
                getList()
              }
            "
          >
            重置
          </ElButton>
        </ElSpace>
        <ElSpace v-if="type != 'Landlord'">
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%" row-key="id">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />

        <ElTableColumn
          label="登记人"
          prop="registrantName"
          width="100"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <el-select
              v-model="row.registrantName"
              filterable
              remote
              reserve-keyword
              placeholder="请输入登记人"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="graveTypeChange"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="户号"
          width="180"
          prop="registrantShowDoorNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.registrantShowDoorNo"
              disabled
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="坟墓与登记人关系"
          prop="relation"
          align="center"
          width="180"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              :placeholder="type == 'Landlord' ? '' : '请选择'"
              v-model="row.relation"
              :disabled="type == 'Landlord'"
            >
              <ElOption
                v-for="item in dictObj[307]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="坟墓编号"
          prop="graveAutoNo"
          align="center"
          width="250"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput placeholder="" v-model="row.graveAutoNo" disabled />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="穴位"
          prop="graveType"
          width="100"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              :placeholder="type == 'Landlord' ? '' : '请选择'"
              v-model="row.graveType"
              :disabled="type == 'Landlord'"
            >
              <ElOption
                v-for="item in dictObj[345]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" :width="175" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber
              :min="0"
              :placeholder="type == 'Landlord' ? '' : '请输入数量'"
              v-model="row.number"
              :disabled="type == 'Landlord'"
              :precision="2"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="材料"
          prop="materials"
          width="140"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              :placeholder="type == 'Landlord' ? '' : '请选择'"
              v-model="row.materials"
              :disabled="type == 'Landlord'"
            >
              <ElOption
                v-for="item in dictObj[295]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="立坟年份"
          width="150"
          prop="graveYear"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput
              v-model="row.graveYear"
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              :disabled="type == 'Landlord'"
            >
              <template #append>年</template>
            </ElInput>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="所处位置"
          prop="gravePosition"
          width="150"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              :placeholder="type == 'Landlord' ? '' : '请选择'"
              v-model="row.gravePosition"
              :disabled="type == 'Landlord'"
              @change="(e) => onChangeLocationType(e, row)"
            >
              <ElOption
                v-for="item in dictObj[326]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="淹没范围"
          prop="inundationRange"
          width="180"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable v-model="row.inundationRange">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="身份证号"
          prop="card"
          width="180"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.card"
              :disabled="type == 'Landlord'"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="联系方式"
          prop="phone"
          width="180"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.phone"
              :disabled="type == 'Landlord'"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" width="180" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.remark"
              :disabled="type == 'Landlord'"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" fixed="right" prop="action">
          <template #default="scope">
            <span @click="onDelRow(scope.row)" :style="{ color: 'red', cursor: 'pointer' }">
              删除
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElUpload,
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElMessage,
  ElMessageBox,
  ElPopover
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  exportGraveTemplate,
  getGraveListApi,
  saveGraveListApi
} from '@/api/workshop/datafill/grave-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useRouter } from 'vue-router'
import { WorkContentWrap } from '@/components/ContentWrap'
import { getLandlordListApi, immigrantGraveDelete } from '@/api/workshop/landlord/service'
import { getPgExcelList } from '@/api/workshop/population/service'
import dayjs from 'dayjs'
import { setlocationType } from '@/utils/index'
import { getHouseListApi } from '@/api/workshop/datafill/house-service'

const { currentRoute } = useRouter()
const { type } = currentRoute.value.query as any
interface PropsType {
  householdId: string
  doorNo: string
  villageCode?: string
}
let sersoud = ref()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const loading = ref(false)
const uploadLoading = ref(false)
const props = defineProps<PropsType>()
const peasanHouseId = +props.householdId
const templateKey = 'importGrave'
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const downloadIcon = useIcon({ icon: 'ant-design:cloud-download-outlined' })
const importIcon = useIcon({ icon: 'ant-design:import-outlined' })
const tableData = ref<any[]>([])
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
const dictStore = useDictStoreWithOut()
const list = ref<any[]>([])

const dictObj = computed(() => dictStore.getDictObj)
const options = ref<any[]>([])

const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})

enum FileReportStatus {
  success = 'Succeed',
  failure = 'Failure',
  importing = 'Importing'
}
const defaultRow = {
  registrantName: null,
  registrantDoorNo: null,
  relation: null,
  graveType: null,
  number: null,
  materials: null,
  graveYear: null,
  gravePosition: null,
  inundationRange: null,
  card: null,
  phone: null
}
const graveTypeChange = (val) => {
  options.value.forEach((item) => {
    if (item.name == val) {
      tableData.value.forEach((item2) => {
        if (item2.registrantName == item.name) {
          item2.registrantId = item.id
          item2.registrantDoorNo = item.doorNo
          item2.registrantShowDoorNo = item.showDoorNo
        }
      })
    }
  })
}
let handelshow = () => {
  loading.value = true
  getExcelUploadList()
}
let excelList = ref()
const getExcelUploadList = async () => {
  const type = 'importGrave'
  const res = await getPgExcelList(type)
  if (res && res.content) {
    excelList.value = res.content
  }
  loading.value = false
}
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    getLandlordListApi({
      name: query,
      type: 'PeasantHousehold',
      villageCodes: props.villageCode
    }).then((res) => {
      loading.value = false
      options.value = res.content
    })
    // setTimeout(() => {
    //   loading.value = false
    //   options.value = list.value.filter((item: any) => {
    //     return item.label.toLowerCase().includes(query.toLowerCase())
    //   })
    // }, 200)
  } else {
    options.value = []
  }
}

const getList = () => {
  const params = {
    villageDoorNo: props.doorNo,
    villageId: +props.householdId,
    size: 9999,
    registrantName: sersoud.value
  }
  getGraveListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

const onDelRow = (row) => {
  ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(async () => {
      if (row.id) {
        await immigrantGraveDelete(row.id)
        getList()
      } else {
        tableData.value.splice(tableData.value.indexOf(row), 1)
      }

      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const onSave = () => {
  tableData.value.forEach((item) => {
    item.villageDoorNo = props.doorNo
    item.villageId = props.householdId
  })
  let parmas = { immigrantGraveList: tableData.value, peasantHouseholdId: props.householdId }

  console.log(parmas, '入参是什么？')

  saveGraveListApi(parmas).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}

// 下载模板
const onDownloadTemplate = () => {
  const params = {
    doorNo: props.doorNo
  }
  exportGraveTemplate(params).then((res) => {
    let a = document.createElement('a')
    // ArrayBuffer 转为 Blob
    let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    let objectUrl = URL.createObjectURL(blob)
    a.setAttribute('href', objectUrl)
    a.setAttribute('download', '模板.xls')
    a.click()
  })
}

const beforeUpload = () => {
  uploadLoading.value = true
}

const uploadDone = () => {
  uploadLoading.value = false
  ElMessage({
    message: '正在导入，请等待批量导入结果',
    type: 'success'
  })
  getList()
}

const uploadError = (error) => {
  try {
    const response = JSON.parse(error.message)
    ElMessage.error(response.message)
    uploadLoading.value = false
  } catch (err) {
    console.log('导入报错信息:', err)
  }
}
let houst: any = ref([])
onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
  getHouseListApi({ doorNo: props.doorNo }).then((res) => {
    console.log(res.content)
    houst.value = res.content
    if (houst.value) {
      let m: any = []
      houst.value.forEach((item: any) => {
        if (item.id) {
          m.push(item.id)
        }
      })
      m.sort()
      console.log(m, houst.value)

      defaultRow.gravePosition = houst.value.filter((bbq: any) => bbq.id == m[0])[0]?.locationType
    }
  })
})
let onChangeLocationType = (e, row) => {
  row.inundationRange = setlocationType(e)
  console.log(tableData)
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
