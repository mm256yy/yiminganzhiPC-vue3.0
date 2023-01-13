<!-- 果木 -->
<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
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
        <ElTableColumn
          label="品种名称"
          :width="175"
          prop="name"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              allow-create
              placeholder="请输入品种名称"
              v-if="row.isAdd"
              v-model="row.name"
            >
              <ElOption
                v-for="item in dictObj[250]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <div v-else>
              {{ row.nameText }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="用途"
          :width="180"
          prop="usageType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              placeholder="请选择用途"
              v-if="row.isAdd"
              v-model="row.usageType"
            >
              <ElOption
                v-for="item in dictObj[325]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <div v-else>
              {{ row.usageTypeText }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="规格" :width="180" prop="size" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              placeholder="请选择规格"
              v-if="row.isAdd"
              v-model="row.size"
            >
              <ElOption
                v-for="item in dictObj[269]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <div v-else>
              {{ row.sizeText }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="单位" :width="180" prop="unit" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect
              clearable
              filterable
              placeholder="请选择单位"
              v-if="row.isAdd"
              v-model="row.unit"
            >
              <ElOption
                v-for="item in dictObj[264]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
            <div v-else>
              {{ row.unitText }}
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="数量" :width="200" prop="number" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.number" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
          <template #default="scope">
            <ElInput placeholder="请输入内容" v-model="scope.row.remark" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, computed } from 'vue'
import {
  ElButton,
  ElInputNumber,
  ElInput,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElSelect,
  ElOption
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getFruitwoodListApi,
  saveFruitwoodListApi
} from '@/api/workshop/datafill/fruitwood-service'
import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])

const dictStore = useDictStoreWithOut()

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
  isAdd: true
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
  tableData.value.push(defaultRow)
}

const onSave = () => {
  saveFruitwoodListApi(tableData.value).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
</script>
