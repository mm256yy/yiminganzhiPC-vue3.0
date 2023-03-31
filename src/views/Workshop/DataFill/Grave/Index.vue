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
        <ElTableColumn label="穴位" prop="graveTypeText" align="center" header-align="center">
          <!-- <template #default="{ row }">
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
          </template> -->
        </ElTableColumn>
        <ElTableColumn label="数量" prop="number" align="center" header-align="center">
          <!-- <template #default="{ row }">
            <ElInputNumber
              :min="0"
              :placeholder="type == 'Landlord' ? '' : '请输入数量'"
              v-model="row.number"
              :disabled="type == 'Landlord'"
            />
          </template> -->
        </ElTableColumn>
        <ElTableColumn label="材料" prop="materialsText" align="center" header-align="center">
          <!-- <template #default="{ row }">
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
          </template> -->
        </ElTableColumn>
        <ElTableColumn label="立坟年份" prop="graveYear" align="center" header-align="center">
          <!-- <template #default="{ row }">
            <ElInput
              v-model="row.graveYear"
              :placeholder="type == 'Landlord' ? '' : '请输入年份'"
              :disabled="type == 'Landlord'"
            >
              <template #append>年</template>
            </ElInput>
          </template> -->
        </ElTableColumn>
        <ElTableColumn label="所处位置" prop="gravePosition" align="center" header-align="center">
          <template #default="{ row }">
            <!-- <ElInput
              v-model="row.gravePosition"
              :placeholder="type == 'Landlord' ? '' : '请输入所处位置'"
              :disabled="type == 'Landlord'"
            /> -->
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
          <!-- <template #default="{ row }">
            <ElInput
              :placeholder="type == 'Landlord' ? '' : '请输入'"
              v-model="row.remark"
              :disabled="type == 'Landlord'"
            />
          </template> -->
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
// , computed
import { ref, computed } from 'vue'
//  ElInputNumber,
//   ElInput,
//   ElSelect,
//   ElOption,
import { ElButton, ElSpace, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getGraveListApi, saveGraveListApi } from '@/api/workshop/datafill/grave-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useRouter } from 'vue-router'
const dictStore = useDictStoreWithOut()

const { currentRoute } = useRouter()
const dictObj = computed(() => dictStore.getDictObj)
const { type } = currentRoute.value.query as any
interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

// const dictStore = useDictStoreWithOut()

// const dictObj = computed(() => dictStore.getDictObj)

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

const getList = () => {
  const params = {
    // doorNo: props.doorNo,
    registrantId: +props.householdId
  }
  getGraveListApi(params).then((res) => {
    tableData.value = res.content
  })
}

getList()

const onAddRow = () => {
  tableData.value.push({})
}

const onSave = () => {
  tableData.value.forEach((item) => {
    item.doorNo = props.doorNo
    item.householdId = props.householdId
  })
  saveGraveListApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
</script>
