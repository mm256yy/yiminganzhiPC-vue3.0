<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" :loading="loading" @click="onSave"
            >保存</ElButton
          >
        </ElSpace>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        :pagination="{
          total: tableObject.total
        }"
        highlightCurrentRow
        @register="register"
      >
        <template #facilitiesTypeText="{ row }">
          <ElInputNumber :min="0" v-model="row.number" :precision="row.number > 0 ? 2 : 0" />
        </template>
        <template #locationType="{ row }">
          <div>
            {{ getLocationText(row.locationType) }}
          </div>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace, ElInputNumber, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getResettlementListApi,
  saveResettlementListApi
} from '@/api/workshop/datafill/landInfo-service'
// import { DemographicDtoType } from '@/api/workshop/population/types'
// import { formatDate } from '@/utils/index'
import { locationTypes } from '@/views/Workshop/components/config'
interface PropsType {
  doorNo: string
  householdId
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getResettlementListApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  size: 9999
}

getList()
const getLocationText = (key: string) => {
  return locationTypes.find((item) => item.value === key)?.label
}
const schema = reactive<CrudSchema[]>([
  {
    field: 'facilitiesName',
    label: '地类(单位)',
    search: {
      show: false
    }
  },
  {
    field: 'facilitiesTypeText',
    label: '国有土地面积',
    search: {
      show: false
    }
  },
  {
    field: 'number',
    label: '集体土地面积',
    search: {
      show: false
    }
  },
  {
    field: 'unitText',
    label: '合计',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
let loading = ref(false)

const onSave = async () => {
  loading.value = true
  saveResettlementListApi(tableObject.tableList)
    .then(() => {
      loading.value = false
      ElMessage.success('保存成功！')
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<style lang="less" scoped>
:deep(.el-pagination) {
  display: none;
}
</style>
