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
          <ElButton @click="recordClick" v-if="surveyStatus === SurveyStatusEnum.Review"
            >修改日志</ElButton
          >
        </ElSpace>
      </div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" :width="60" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="坟墓与登记人关系"
          prop="relation"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.relation">
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
        <ElTableColumn label="穴位" prop="graveType" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.graveType">
              <ElOption
                v-for="item in dictObj[345]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" width="180" prop="number" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" placeholder="请输入数量" v-model="row.number" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="材料" prop="materials" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.materials">
              <ElOption
                v-for="item in dictObj[295]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="立坟年份" prop="graveYear" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput v-model="row.graveYear" placeholder="请输入年份">
              <template #append>年</template>
            </ElInput>
          </template>
        </ElTableColumn>
        <ElTableColumn label="所在位置" prop="gravePosition" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              placeholder="请选择"
              v-model="row.gravePosition"
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
        <ElTableColumn label="淹没范围" prop="inundationRange" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable placeholder="请选择" v-model="row.inundationRange">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn label="所属村集体" prop="villageId" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              placeholder="请选择"
              v-model="row.villageId"
              @change="change"
            >
              <ElOption
                v-for="item in villageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn> -->
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput placeholder="请输入" v-model="row.remark" />
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
    <RecordListDialog
      type="坟墓信息"
      :recordShow="recordShow"
      @close="recordClose"
      :doorNo="doorNo"
    />
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, computed, onMounted } from 'vue'
import RecordListDialog from '../components/RecordListDialog.vue'
import {
  ElButton,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElInputNumber,
  ElInput,
  ElSelect,
  ElOption,
  ElMessageBox
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getGraveListApi, saveGraveListApi } from '@/api/workshop/datafill/grave-service'
import { getLandlordListApi, immigrantGraveDelete } from '@/api/workshop/landlord/service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import { setlocationType } from '@/utils/index'
import { getHouseListApi } from '@/api/workshop/datafill/house-service'

// import { useRouter } from 'vue-router'

// const { currentRoute } = useRouter()
// const { type } = currentRoute.value.query as any
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

interface PropsType {
  householdId: string
  doorNo: string
  name: string
  surveyStatus: SurveyStatusEnum
  classifyType?: string // 角色分类类型
  showDoorNo?: any
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const recordShow = ref(false)
const villageList = ref<any[]>([])
const loading = ref(false)
let houst: any = ref([])
const recordClose = () => {
  recordShow.value = false
}
const recordClick = () => {
  recordShow.value = true
}

// 是否可编辑
const isEdit = computed(() => {
  return props.classifyType !== 'check'
})

const defaultRow = {
  registrantId: props.householdId, // 登记人 ID
  registrantDoorNo: props.doorNo, // 登记人户号
  registrantName: props.name, // 登记人姓名
  registrantShowDoorNo: props.showDoorNo,
  villageId: '', // 村集体 ID
  villageDoorNo: '', // 村集体户号
  relation: '',
  graveType: '',
  materials: '',
  graveYear: '',
  gravePosition: '',
  number: 0,
  remark: '',
  locationType: '',
  isAdd: true
}

// 获取村集体列表
const getVillageList = () => {
  getLandlordListApi({ name: '', type: 'Village' }).then((res) => {
    villageList.value = initCollectiveData(res.content)
  })
}

/**
 * 初始化处理村集体数据
 * @param {Array} data 传入的数组
 * @returns {Array} newArr 返回的数组
 */
const initCollectiveData = (data: any) => {
  let newArr: any = []
  if (data && data.length) {
    data.map((item: any) => {
      newArr.push({
        doorNo: item.doorNo,
        label: item.name,
        value: item.id
      })
    })
    return newArr
  }
  return newArr
}

const getList = () => {
  const params = {
    registrantDoorNo: props.doorNo,
    registrantId: +props.householdId
  }
  getGraveListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

/**
 * 选择所属村集体
 * @param e 当前所选的值
 */
const change = (e: any) => {
  if (e) {
    let itemData = villageList.value.find((item: any) => item.value === e)
    tableData.value.map((item: any) => {
      if (item.villageId === e) {
        item.villageDoorNo = itemData.doorNo
      }
    })
  }
}

const onAddRow = () => {
  console.log(defaultRow)

  tableData.value.push({ ...defaultRow })
}

/**
 * 删除
 * @param row 当前行信息
 */
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
  loading.value = true
  // tableData.value.push({ peasantHouseholdId: props.householdId })
  let parmas = { immigrantGraveList: tableData.value, peasantHouseholdId: props.householdId }
  console.log(parmas, '入参是什么？')
  saveGraveListApi(parmas)
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

onMounted(() => {
  getVillageList()
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
}
</script>
