<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace v-if="type != 'Landlord'">
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
            >保存</ElButton
          >
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
        <ElTableColumn label="户号" prop="registrantDoorNo" align="center" header-align="center">
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
        <ElTableColumn label="立坟年份" prop="graveYear" align="center" header-align="center">
          <template #default="{ row }">
            <ElInput
              v-model="row.graveYear"
              :placeholder="type == 'Landlord' ? '' : '请输入年份'"
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
              :placeholder="type == 'Landlord' ? '' : '请选择所处位置'"
              v-model="row.gravePosition"
              :disabled="type == 'Landlord'"
            >
              <ElOption
                v-for="item in dictObj[288]"
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
            <span @click="onDelRow(scope.row)" :style="{ color: 'red', cursor: 'pointer' }"
              >删除</span
            >
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
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
  ElSelect,
  ElOption,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getGraveListApi, saveGraveListApi } from '@/api/workshop/datafill/grave-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useRouter } from 'vue-router'
import { getLandlordListApi, immigrantGraveDelete } from '@/api/workshop/landlord/service'
const { currentRoute } = useRouter()
const { type } = currentRoute.value.query as any
interface PropsType {
  householdId: string
  doorNo: string
}
const loading = ref(false)
const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
const dictStore = useDictStoreWithOut()
const list = ref<any[]>([])

const dictObj = computed(() => dictStore.getDictObj)
const options = ref<any[]>([])
// const defaultRow = {
//   doorNo: props.doorNo,
//   householdId: props.householdId,
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
onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})
const getList = () => {
  const params = {
    doorNo: props.doorNo,
    householdId: +props.householdId
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
      item.doorNo = props.doorNo
      item.householdId = props.householdId
    })
    saveGraveListApi(tableData.value).then(() => {
      ElMessage.success('操作成功！')
      getList()
    })
  }
}
</script>
