<template>
  <WorkContentWrap>
    <div> </div>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <!-- <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">保存</ElButton>
        </ElSpace> -->
      </div>
      <div class="formBox">
        <ElForm
          :disabled="actionType === 'view'"
          class="form"
          ref="formRef"
          :model="form"
          label-width="100px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">生产安置人数统计：</span>
          </div>
          <div style="display: flex">
            <ElFormItem label="家庭总人数" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农村移民" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.ruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农村移民" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.unruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农业随迁" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.farmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农业随迁" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.unfarmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
          <div style="display: flex">
            <ElFormItem label="增计人口" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.addPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="其他人口" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.otherPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="安置总人数" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
        </ElForm>
      </div>

      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow" style="margin-top: 17px"
            >添加</ElButton
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
        <template #birthday="{ row }">
          <div>
            {{ standardFormatDate(row.birthday) }}
          </div>
        </template>
        <template #action="{ row }">
          <!-- :delete="row.relation == 1 ? false : true" -->
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
            :delete="true"
          />
        </template>
      </Table>
    </div>
    <el-dialog title="删除生产安置信息" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        <el-icon><InfoFilled /></el-icon>是否删除
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
      :baseInfo="baseInfo"
      @close="onFormPupClose"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
// , computed
import { reactive, ref } from 'vue'
import {
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElInput,
  // ElSelect,
  // ElOption,
  ElForm
} from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getProduceListApi, delProduceApi } from '@/api/putIntoEffect/produce'
import { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// const dictStore = useDictStoreWithOut()

// const dictObj = computed(() => dictStore.getDictObj)
// import {  } from '@/api/putIntoEffect/landlordCheck'
interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getProduceListApi,
  delListApi: delProduceApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  projectId: props.baseInfo.projectId,
  status: props.baseInfo.status
}

getList()
const form = ref<any>({})
const rules = ref<any>({})
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
    field: 'populationNatureText',
    label: '人口性质',
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
    field: 'settingWayText',
    label: '安置方式',
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

const onClose = () => {
  cause.value = ''
  dialogVisible.value = false
}
const onSubmit = () => {
  dialogVisible.value = false
}
const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: DemographicDtoType) => {
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

const onViewRow = (row: DemographicDtoType) => {
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

.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }
}
</style>
