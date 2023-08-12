<template>
  <WorkContentWrap>
    <!-- 资格认定 -- 房屋产权 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onFilling">填报完成</ElButton>
          <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton> -->
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
        <template #birthday="{ row }">
          <div>
            {{ standardFormatDate(row.birthday) }}
          </div>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">详情</el-button>
          <el-button type="primary" link @click="onEditRow(row)">核定</el-button>
          <!-- <el-button type="danger" link @click="onDelRow(row)">删除</el-button> -->
        </template>
      </Table>
    </div>
    <!-- <el-dialog title="删除房屋信息" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        <el-icon><InfoFilled /></el-icon>是否删除
        <span style="margin: 0 6px; font-weight: 600">{{ tableObject.currentRow?.name }}</span>
        的信息
      </div>
      <span style="position: absolute; top: 125px; left: 60px; color: red">*</span>
      <ElFormItem label="删除原因" prop="reason">
        <ElSelect clearable filterable v-model="reason" class="!w-full">
          <ElOption
            v-for="item in dictObj[368]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog> -->
    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :doorNo="props.doorNo"
      :baseInfo="baseInfo"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
// import { useIcon } from '@/hooks/web/useIcon'
// import { useDictStoreWithOut } from '@/store/modules/dict'
import { saveFillingCompleteApi } from '@/api/immigrantImplement/common-service'
import { getHouseListApi } from '@/api/workshop/datafill/house-service'
// import type { HouseDtoType } from '@/api/workshop/datafill/house-types'
// import { delHouseConfirmationApi } from '@/api/immigrantImplement/houseProperty/service'
// import { DelHouseDtoType } from '@/api/immigrantImplement/houseProperty/types'

import { standardFormatDate } from '@/utils/index'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)

const { register, tableObject, methods } = useTable({
  getListApi: getHouseListApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  status: props.baseInfo.status
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'houseNo',
    label: '房屋编号',
    search: {
      show: false
    }
  },
  {
    field: 'constructionTypeText',
    label: '房屋结构',
    search: {
      show: false
    }
  },
  {
    field: 'storeyNumber',
    label: '层数',
    search: {
      show: false
    }
  },

  {
    field: 'landArea',
    label: '建筑面积（㎡）',
    search: {
      show: false
    }
  },
  {
    width: 230,
    field: 'landNo',
    label: '集体土地使用权证',
    search: {
      show: false
    }
  },
  {
    width: 230,
    field: 'propertyNo',
    label: '房屋所有权证/不动产权权证',
    search: {
      show: false
    }
  },
  {
    field: 'houseNature',
    label: '房屋性质',
    search: {
      show: false
    }
  },
  {
    field: 'demographicIdText',
    label: '房屋产权人',
    search: {
      show: false
    }
  },
  {
    field: 'ownersSituation',
    label: '共有人情况',
    search: {
      show: false
    }
  },
  // {
  //   field: 'addReasonText',
  //   label: '新增原因',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'deleteReasonText',
  //   label: '删除原因',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 130,
    search: {
      show: false
    },
    form: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
// const dialogVisible = ref(false)
// const reason = ref()
// const onClose = () => {
//   reason.value = ''
//   dialogVisible.value = false
// }
// const onSubmit = () => {
//   if (!reason.value) {
//     ElMessage.warning('请选择删除原因')
//     return
//   }
//   const params: DelHouseDtoType = {
//     id: tableObject.currentRow?.id as number,
//     reason: reason.value
//   }
//   delHouseConfirmationApi(params).then(() => {
//     ElMessage.success('操作成功')
//     getList()
//   })
//   dialogVisible.value = false
// }
// const onDelRow = (row: HouseDtoType) => {
//   dialogVisible.value = true
//   tableObject.currentRow = row
// }

// const onAddRow = () => {
//   actionType.value = 'add'
//   tableObject.currentRow = null
//   dialog.value = true
// }

const onEditRow = (row: any) => {
  actionType.value = 'edit'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

const onViewRow = (row: any) => {
  actionType.value = 'view'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
}

// 填报完成
const onFilling = () => {
  saveFillingCompleteApi({
    doorNo: props.doorNo,
    propertyStatus: '1'
  }).then((res: any) => {
    if (res) {
      ElMessage.success('操作成功')
    }
  })
}
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}
</style>
