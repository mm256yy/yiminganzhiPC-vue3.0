<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
          <ElButton @click="recordClick" v-if="props.surveyStatus === 'review'">修改日志</ElButton>
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
        <ElTableColumn label="数量" prop="number" align="center" header-align="center">
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
        <ElTableColumn label="所处位置" prop="gravePosition" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择所处位置" v-model="row.gravePosition">
              <ElOption
                v-for="item in dictObj[288]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="所属村集体" prop="householdId" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择所属村集体" v-model="row.householdId">
              <ElOption
                v-for="item in villageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
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
// import { useRouter } from 'vue-router'

// const { currentRoute } = useRouter()
// const { type } = currentRoute.value.query as any
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

interface PropsType {
  householdId: string
  doorNo: string
  surveyStatus
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const recordShow = ref(false)
const villageList = ref<any[]>([])

const recordClose = () => {
  recordShow.value = false
}
const recordClick = () => {
  recordShow.value = true
}

const defaultRow = {
  doorNo: props.doorNo,
  registrantId: props.householdId,
  householdId: '',
  relation: '',
  graveType: '',
  materials: '',
  graveYear: '',
  gravePosition: '',
  number: 0,
  remark: '',
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
    // doorNo: props.doorNo,
    registrantId: +props.householdId,
    status: props.surveyStatus == 2 ? 'review' : undefined
  }
  getGraveListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
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
  saveGraveListApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}

onMounted(() => {
  getVillageList()
})
</script>
