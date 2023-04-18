<template>
  <WorkContentWrap>
    <div> </div>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="saveIcon" type="primary" @click="onsave">保存</ElButton>
        </ElSpace>
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
            <span class="text">居民户基础信息:</span>
          </div>
          <div style="display: flex; align-items: center">
            <ElFormItem label="安置方式" prop="settingWay">
              <ElSelect clearable filterable v-model="form.settingWay" class="!w-250px">
                <ElOption
                  v-for="item in dictObj[321]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="建房形式" prop="buildingForm">
              <ElSelect clearable v-model="form.buildingForm" class="!w-250px">
                <ElOption
                  v-for="item in dictObj[310]"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
            <ElFormItem label="开户名" prop="accountName">
              <ElInput v-model="form.accountName" class="!w-250px" />
            </ElFormItem>
          </div>
          <div style="display: flex">
            <ElFormItem label="开户行" prop="bankName">
              <ElInput v-model="form.bankName" class="!w-250px" />
            </ElFormItem>
            <ElFormItem label="银行账户" prop="bankAccount">
              <ElInput v-model="form.bankAccount" class="!w-250px" />
            </ElFormItem>
            <ElFormItem label="备注" prop="accountRemark">
              <ElInput v-model="form.accountRemark" class="!w-250px" />
            </ElFormItem>
          </div>
          <div class="titleBox">
            <span class="text">搬迁安置人数统计：</span>
          </div>
          <div style="display: flex">
            <ElFormItem label="家庭总人数" prop="familyNum">
              <div class="!w-150px">{{ form.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农村移民">
              <div class="!w-150px">{{ form.ruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农村移民">
              <div class="!w-150px">{{ form.unruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="财产户" prop="hasPropertyAccount">
              <ElSelect class="!w-150px" clearable v-model="form.hasPropertyAccount">
                <ElOption
                  v-for="item in yesAndNoEnums"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
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
        </template>
      </Table>
    </div>
    <el-dialog title="删除搬迁安置信息" v-model="dialogVisible" width="500">
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
//
import { reactive, ref, computed, onMounted } from 'vue'
// ElMessageBox,
//
import {
  ElMessage,
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElForm
} from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'

import { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getassetHouse, delassetHouse } from '@/api/putIntoEffect/landlordCheck'
import { updateLandlordApi } from '@/api/workshop/landlord/service'
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

interface PropsType {
  doorNo: string
  baseInfo
}
const yesAndNoEnums = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]
const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const { register, tableObject, methods } = useTable({
  getListApi: getassetHouse,
  delListApi: delassetHouse
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}
// console.log(props.baseInfo, 'baseInfobaseInfo')

getList()
const form = ref<any>({})
onMounted(() => {
  form.value = props.baseInfo
})

const rules = ref()
const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'relocationArea',
    label: '安置区',
    search: {
      show: false
    }
  },
  {
    field: 'address',
    label: '安置住址',
    search: {
      show: false
    }
  },
  {
    field: 'doorModel',
    label: '户型/套型',
    search: {
      show: false
    }
  },

  {
    field: 'modelArea',
    label: '套型面积',
    search: {
      show: false
    }
  },
  // {
  //   width: 180,
  //   field: 'way',
  //   label: '安置方式',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'type',
  //   label: '建房形式',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'remake',
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
const onsave = () => {
  updateLandlordApi(form.value).then(() => {
    ElMessage.success('操作成功！')
  })
}
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
