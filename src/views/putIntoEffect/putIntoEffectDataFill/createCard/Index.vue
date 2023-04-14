<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="title"> 家庭基本情况列表</div>
        <!-- <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
        </ElSpace> -->
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
        <!-- <template #action="{ row }">
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
            :delete="row.relation == 1 ? false : true"
          />
        </template> -->
      </Table>
      <div class="flex items-center justify-between pb-12px mt-20px">
        <div class="title"> 费用补偿情况列表</div>
      </div>
      <div class="pb-12px mt-20px">
        <div class="title"> 备注</div>
        <div class="text">1. 补偿费、异地搬迁补助费、奖励费等拨付至甲方指定银行</div>
        <div class="text mt-20px"
          >2. 搬迁补助费、过渡资金补助费、其他补助费、临时安置补助费拨付至乙方指定银行。</div
        >
        <div class="text mt-20px"
          >3.
          临时安置补助费首次发放时间为乙方腾空被拆迁房屋并办理交付手续之日起十五日内，每半年发放一次，截止时间为安置房选房的当月。</div
        >
      </div>
    </div>
    <el-dialog title="删除人员信息" v-model="dialogVisible" width="500">
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
import { ElButton, ElDialog, ElFormItem, ElInput } from 'element-plus'
import { Table } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
// import { useIcon } from '@/hooks/web/useIcon'
import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/population/service'
// import { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'
// import {  } from '@/api/putIntoEffect/landlordCheck'
interface PropsType {
  doorNo: string
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
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
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'relationText',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },

  {
    field: 'censusTypeText',
    label: '户籍册类别',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'maritalText',
    label: '婚姻状况',
    search: {
      show: false
    }
  },
  {
    field: 'maritalText',
    label: '人口性质',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '新增原因',
    search: {
      show: false
    }
  }

  // {
  //   field: 'action',
  //   label: '操作',
  //   fixed: 'right',
  //   width: 130,
  //   search: {
  //     show: false
  //   },
  //   form: {
  //     show: false
  //   }
  // }
])

const { allSchemas } = useCrudSchemas(schema)
const dialogVisible = ref(false)
const cause = ref()
// const multipleV = ref()
const onClose = () => {
  cause.value = ''
  dialogVisible.value = false
}
const onSubmit = () => {
  dialogVisible.value = false
}
// const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
//   dialogVisible.value = true
//   tableObject.currentRow = row
//   multipleV.value = multiple
//   // const { delList, getSelections } = methods
//   // const selections = await getSelections()
//   // await delList(
//   //   multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
//   //   multiple
//   // )
//   // ElMessage.success('删除成功')
//   // getList()
// }

// const onAddRow = () => {
//   actionType.value = 'add'
//   tableObject.currentRow = null
//   dialog.value = true
// }

// const onEditRow = (row: DemographicDtoType) => {
//   actionType.value = 'edit'
//   tableObject.currentRow = {
//     ...row,
//     occupation: row.occupation ? JSON.parse(row.occupation) : '',
//     insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
//   }
//   dialog.value = true
// }

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
  }
}

// const onViewRow = (row: DemographicDtoType) => {
//   actionType.value = 'view'
//   tableObject.currentRow = {
//     ...row,
//     occupation: row.occupation ? JSON.parse(row.occupation) : '',
//     insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
//   }
//   dialog.value = true
// }
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.title {
  margin: 5px 0;
  font-family: PingFang SC-Bold, PingFang SC;
  font-size: 16px;
  font-weight: bold;
  color: #171718;
}

.text {
  font-family: PingFang SC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}
</style>
