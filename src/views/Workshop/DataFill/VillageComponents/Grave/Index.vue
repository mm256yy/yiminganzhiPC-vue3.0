<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <ElSpace>
          <ElUpload
            action="/api/immigrantGrave/import"
            :headers="headers"
            :data="{ peasanHouseId }"
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
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />

        <ElTableColumn label="登记人" prop="registrantName" align="center" header-align="center">
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
          prop="registrantDoorNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.registrantDoorNo"
              disabled
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="坟墓与登记人关系"
          prop="relation"
          align="center"
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
        <ElTableColumn label="穴位" prop="graveType" align="center" header-align="center">
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
        <ElTableColumn label="材料" prop="materials" align="center" header-align="center">
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
        <ElTableColumn label="所处位置" prop="gravePosition" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              :placeholder="type == 'Landlord' ? '' : '请选择'"
              v-model="row.gravePosition"
              :disabled="type == 'Landlord'"
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
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.remark"
              :disabled="type == 'Landlord'"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" prop="action">
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
  ElMessageBox
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

const { currentRoute } = useRouter()
const { type } = currentRoute.value.query as any
interface PropsType {
  householdId: string
  doorNo: string
}

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const loading = ref(false)
const uploadLoading = ref(false)
const props = defineProps<PropsType>()
const peasanHouseId = +props.householdId
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
// const defaultRow = {
//   villageDoorNo: props.doorNo,
//   villageId: props.householdId,
//   registrantName: '',
//   registrantDoorNo: '',
//   registrantId: '',
//   graveType: '',
//   materials: '',
//   graveYear: '',
//   gravePosition: '',
//   number: 0,
//   remark: '',
//   isAdd: true
// }
const graveTypeChange = (val) => {
  options.value.forEach((item) => {
    if (item.name == val) {
      tableData.value.forEach((item2) => {
        if (item2.registrantName == item.name) {
          item2.registrantId = item.id
          item2.registrantDoorNo = item.doorNo
        }
      })
    }
  })
}

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    getLandlordListApi({ name: query, type: 'PeasantHousehold' }).then((res) => {
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
    villageId: +props.householdId
  }
  getGraveListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push({})
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
  if (
    tableData.value.some((item) => {
      return !item.registrantName
    })
  ) {
    ElMessage.error('登记人不能为空')
  } else {
    tableData.value.forEach((item) => {
      item.villageDoorNo = props.doorNo
      item.villageId = props.householdId
    })
    saveGraveListApi(tableData.value).then(() => {
      ElMessage.success('操作成功！')
      getList()
    })
  }
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

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})
</script>
