<!-- 果木 -->
<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace v-if="isEdit">
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            :loading="loading"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
          <ElButton
            @click="recordClick"
            v-if="surveyStatus === SurveyStatusEnum.Review && isUpdateShow === 'Landlord'"
          >
            修改日志
          </ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn label="品种名称" prop="name" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              allow-create
              placeholder="请输入品种名称"
              v-model="row.name"
              filterable
              :disabled="!isEdit"
              @change="
                (e) => {
                  setList(e, row)
                }
              "
            >
              <ElOption
                v-for="item in dictObj[250]"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </ElSelect>
            <!-- <div v-else>
              {{ row.nameText }}
            </div> -->
          </template>
        </ElTableColumn>
        <ElTableColumn label="用途" prop="usageType" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              placeholder="请选择用途"
              v-model="row.usageType"
              :disabled="!isEdit"
            >
              <ElOption
                v-for="item in dictObj[325]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <!-- <div v-else>
              {{ row.usageTypeText }}
            </div> -->
          </template>
        </ElTableColumn>
        <ElTableColumn label="规格" prop="size" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择规格" v-model="row.size" :disabled="!isEdit">
              <ElOption
                v-for="item in dictObj[269]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>

            <!-- <div v-else>
              {{ row.sizeText }}
            </div> -->
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择单位" v-model="row.unit" :disabled="!isEdit">
              <ElOption
                v-for="item in dictObj[264]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <!-- <div v-else>
              {{ row.unitText }}
            </div> -->
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" :width="180" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.number" :precision="2" :disabled="!isEdit" />
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn
          label="高程"
          prop="altitude"
          align="center"
          :width="180"
          header-align="center"
        >
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.altitude" />
          </template>
        </ElTableColumn> -->
        <ElTableColumn label="所在位置" prop="locationType" align="center" header-align="center">
          <template #default="scope">
            <ElSelect
              class="w-350px"
              v-model="scope.row.locationType"
              @change="(val) => onChangeLocationType(val, scope.row)"
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
        <ElTableColumn label="淹没范围" prop="inundationRange" align="center" header-align="center">
          <template #default="scope">
            <ElSelect clearable v-model="scope.row.inundationRange" :disabled="!isEdit">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入内容" v-model="scope.row.remark" :disabled="!isEdit" />
          </template>
        </ElTableColumn>
        <ElTableColumn v-if="isEdit" label="操作" prop="action">
          <template #default="scope">
            <span @click="onDelRow(scope.row)" :style="{ color: 'red', cursor: 'pointer' }">
              删除
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <RecordListDialog
      type="果树信息"
      :recordShow="recordShow"
      @close="recordClose"
      :doorNo="doorNo"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, computed, onMounted } from 'vue'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElSelect,
  ElOption,
  ElMessageBox
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getFruitwoodListApi,
  saveFruitwoodListApi,
  deleteFruitwoodListApi
} from '@/api/workshop/datafill/fruitwood-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import RecordListDialog from '../components/RecordListDialog.vue'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import { useRouter } from 'vue-router'
import { setlocationType } from '@/utils/index'
import { getHouseListApi, getByName } from '@/api/workshop/datafill/house-service'

const router = useRouter()
const isUpdateShow = router.currentRoute.value?.query?.type

interface PropsType {
  householdId: string
  doorNo: string
  surveyStatus: SurveyStatusEnum
  classifyType?: string // 角色分类类型
}

// 是否可编辑
const isEdit = computed(() => {
  return props.classifyType !== 'check'
})

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

const dictStore = useDictStoreWithOut()
const recordShow = ref(false)
const loading = ref(false)

const recordClose = () => {
  recordShow.value = false
}
const recordClick = () => {
  recordShow.value = true
}
const dictObj = computed(() => dictStore.getDictObj)

const defaultRow = {
  doorNo: props.doorNo,
  householdId: props.householdId,
  name: '',
  usageType: '',
  size: '',
  unit: '',
  number: 0,
  remark: '',
  isAdd: true,
  altitude: 0,
  locationType: '',
  inundationRange: null
}
const onDelRow = (row) => {
  ElMessageBox.confirm('确认要删除该信息吗？', '警告', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(async () => {
      if (row.id) {
        await deleteFruitwoodListApi(row.id)
        getList()
      } else {
        tableData.value.splice(tableData.value.indexOf(row), 1)
      }

      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
const getList = () => {
  const params = {
    doorNo: props.doorNo,
    householdId: +props.householdId,
    size: 1000
  }
  getFruitwoodListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push({ ...defaultRow })
}

const onSave = () => {
  if (
    tableData.value.some((item) => {
      return !item.name
    })
  ) {
    ElMessage.error('品种名称不能为空')
  } else {
    tableData.value = tableData.value.filter((item) => {
      if (
        !(
          item.altitude == 0 &&
          item.name == '' &&
          item.remark == '' &&
          item.size == '' &&
          item.unit == '' &&
          item.usageType == ''
        )
      ) {
        return item
      }
    })
    loading.value = true
    saveFruitwoodListApi(tableData.value)
      .then(() => {
        ElMessage.success('操作成功！')
        loading.value = false
        getList()
      })
      .catch(() => {
        ElMessage.error('操作失败！')
        loading.value = false
      })
  }
}
let onChangeLocationType = (e, row) => {
  row.inundationRange = setlocationType(e)
}
let houst: any = ref([])
onMounted(() => {
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

      defaultRow.locationType = houst.value.filter((bbq: any) => bbq.id == m[0])[0]?.locationType
      defaultRow.inundationRange = houst.value.filter(
        (bbq: any) => bbq.id == m[0]
      )[0]?.inundationRange
      console.log(defaultRow.locationType, houst.value, 'bbq')
    }
  })
})
let setList = (e, row: any) => {
  console.log(e)
  getByName(e).then((res) => {
    console.log(res)
    if (res) {
      row.usageType = res.usageType
      row.unit = res.unit
    }
  })
}
</script>
