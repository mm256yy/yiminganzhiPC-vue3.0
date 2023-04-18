<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
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
          <TableEditColumn
            :view-type="'link'"
            :icons="[
              {
                icon: '',
                tooltip: '详情',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
            :row="row"
            @edit="onEditRow(row)"
            @delete="onDelRow"
          />
          <!-- :delete="row.relation == 1 ? false : true" -->
        </template>
      </Table>
    </div>
    <el-dialog title="删除房屋信息" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        <img src="./i.png" alt="" />是否删除
        <span style="margin: 0 6px; font-weight: 600">{{ tableObject.currentRow?.name }}</span>
        的信息
      </div>
      <span style="position: absolute; top: 125px; left: 60px; color: red">*</span>
      <ElFormItem label="删除原因" prop="name">
        <ElInput v-model="cause" class="!w-full" placeholder="请输入" type="textarea" row="3" />
      </ElFormItem>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>
    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :doorNo="props.doorNo"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace, ElDialog, ElFormItem, ElInput } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getHouseListApi, delHouseByIdApi } from '@/api/workshop/datafill/house-service'
// import { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'
// import {  } from '@/api/putIntoEffect/landlordCheck'
interface PropsType {
  doorNo: string
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getHouseListApi,
  delListApi: delHouseByIdApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
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
    field: 'demographicId',
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
  {
    field: 'addReason',
    label: '新增原因',
    search: {
      show: false
    }
  },
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
const dialogVisible = ref(false)
const cause = ref()
const multipleV = ref()
const onClose = () => {
  cause.value = ''
  dialogVisible.value = false
}
const onSubmit = () => {
  dialogVisible.value = false
}
const onDelRow = async (row: any, multiple: boolean) => {
  // dialogVisible.value = true
  tableObject.currentRow = row
  multipleV.value = multiple
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
  // ElMessage.success('删除成功')
  // getList()
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

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
