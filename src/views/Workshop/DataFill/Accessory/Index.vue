<!-- 附属物 -->
<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加行</ElButton> -->
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
            >保存</ElButton
          >
        </ElSpace>
      </div>
      <div style="display: flex">
        <ElTable :data="tableDataLeft" style="width: 50%">
          <ElTableColumn
            label="序号"
            type="index"
            align="center"
            header-align="center"
            :width="60"
          />
          <ElTableColumn label="项目" prop="name" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable allow-create v-if="row.isAdd" v-model="row.name">
                <ElOption
                  v-for="item in dictObj[329]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.name }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="规格" prop="size" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable v-if="row.isAdd" v-model="row.size">
                <ElOption
                  v-for="item in dictObj[267]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.size }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="单位" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable v-if="row.isAdd" v-model="row.unit">
                <ElOption
                  v-for="item in dictObj[243]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.unit }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="数量"
            prop="number"
            align="center"
            header-align="center"
            :width="180"
          >
            <template #default="scope">
              <ElInputNumber
                :min="0"
                v-model="scope.row.number"
                :precision="scope.row.number > 0 ? 2 : 0"
              />
            </template>
          </ElTableColumn>
          <!-- <ElTableColumn label="高程" prop="altitude" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.altitude" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="淹没范围" prop="inundationRange" align="center" header-align="center">
          <template #default="scope">
            <ElSelect clearable v-model="scope.row.inundationRange">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn> -->

          <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
            <template #default="scope">
              <ElInput placeholder="请输入内容" v-model="scope.row.remark" />
            </template>
          </ElTableColumn>
        </ElTable>
        <div style="width: 20px"></div>
        <ElTable :data="tableDataRight" style="width: 50%">
          <ElTableColumn
            label="序号"
            prop="surveyId"
            align="center"
            header-align="center"
            :width="60"
          />
          <ElTableColumn label="项目" prop="name" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable allow-create v-if="row.isAdd" v-model="row.name">
                <ElOption
                  v-for="item in dictObj[329]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.name }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="规格" prop="size" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable v-if="row.isAdd" v-model="row.size">
                <ElOption
                  v-for="item in dictObj[267]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.size }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="单位" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              <ElSelect clearable filterable v-if="row.isAdd" v-model="row.unit">
                <ElOption
                  v-for="item in dictObj[243]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <div v-else>
                {{ row.unit }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="数量"
            prop="number"
            align="center"
            header-align="center"
            :width="180"
          >
            <template #default="scope">
              <ElInputNumber
                :min="0"
                v-model="scope.row.number"
                :precision="scope.row.number > 0 ? 2 : 0"
              />
            </template>
          </ElTableColumn>
          <!-- <ElTableColumn label="高程" prop="altitude" align="center" header-align="center">
          <template #default="scope">
            <ElInputNumber :min="0" v-model="scope.row.altitude" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="淹没范围" prop="inundationRange" align="center" header-align="center">
          <template #default="scope">
            <ElSelect clearable v-model="scope.row.inundationRange">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn> -->

          <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
            <template #default="scope">
              <ElInput placeholder="请输入内容" v-model="scope.row.remark" />
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
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
  getAccessoryListApi,
  saveAccessoryListApi,
  getAppendantOptionApi
} from '@/api/workshop/datafill/accessory-service'
import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  householdId: string
  doorNo: string
}

const props = defineProps<PropsType>()
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const tableData = ref<any[]>([])
const tableDataLeft = ref<any>([])
const tableDataRight = ref<any>([])
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

// const defaultRow = {
//   doorNo: props.doorNo,
//   householdId: props.householdId,
//   name: '',
//   size: '',
//   unit: '',
//   number: 0,
//   remark: '',
//   isAdd: true
// }

const getAppendantOption = async () => {
  const info = await getAppendantOptionApi()
  return info.content || []
}

const getList = async () => {
  const params: any = {
    doorNo: props.doorNo,
    householdId: props.householdId,
    size: 1000
  }
  tableDataLeft.value = []
  tableDataRight.value = []
  const res = await getAccessoryListApi(params)
  if (res && res.content && res.content.length) {
    tableData.value = res.content
    res.content.forEach((item, index) => {
      if (index <= res.content.length / 2) {
        tableDataLeft.value.push(item)
      } else {
        tableDataRight.value.push(item)
      }
    })
  } else {
    // 使用默认的配置
    const defaultList = await getAppendantOption()
    tableData.value = defaultList.map((item) => {
      const { id, ...ret } = item
      const newItem = {
        ...ret
      }
      newItem.doorNo = props.doorNo
      newItem.householdId = +props.householdId
      newItem.surveyId = id + ''
      newItem.number = 0
      newItem.remark = ''
      newItem.altitude = 0
      return newItem
    })
    tableData.value.forEach((item, index) => {
      if (index <= tableData.value.length / 2) {
        tableDataLeft.value.push(item)
      } else {
        tableDataRight.value.push(item)
      }
    })
  }
}

getList()

// const onAddRow = () => {
//   tableData.value.push(defaultRow)
// }

const onSave = () => {
  let data: any = [...tableDataLeft.value, ...tableDataRight.value]

  saveAccessoryListApi(data).then(() => {
    ElMessage.success('操作成功！')
    getList()
  })
}
</script>
