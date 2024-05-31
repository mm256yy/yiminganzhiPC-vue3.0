<template>
  <WorkContentWrap>
    <!-- 资格认定 -- 房屋产权 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onFilling">填报完成</ElButton>
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
        <template #ownersSituationName="{ row }">
          <div>
            {{ splitStr(row.ownersSituationName) }}
          </div>
        </template>
        <template #isCompliance="{ row }">
          <div>
            {{ row.isCompliance == '1' ? '是' : '否' }}
          </div>
        </template>
        <template #separateFlag="{ row }">
          <div>
            {{ row.separateFlag == '1' ? '是' : '否' }}
          </div>
        </template>
        <template #houseNature="{ row }">
          <div>
            {{
              row.houseNature
                ? dictObj[304].find((item: any) => item.value === row.houseNature).label
                : '-'
            }}
          </div>
        </template>
        <template #action="{ row }">
          <el-button type="primary" link @click="onViewRow(row)">详情</el-button>
          <el-button type="primary" link @click="onEditRow(row)">核定</el-button>
        </template>
      </Table>
    </div>
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
import { reactive, ref, computed } from 'vue'
import { ElButton, ElSpace, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { saveFillingCompleteApi } from '@/api/immigrantImplement/common-service'
import { getHouseListApi } from '@/api/workshop/datafill/house-service'
import { standardFormatDate } from '@/utils/index'
import EditForm from './EditForm.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  doorNo: string
  baseInfo: any
}
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型

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
  // {
  //   field: 'isCompliance',
  //   label: '是否合法',
  //   search: {
  //     show: false
  //   }
  // },
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
    field: 'landLegalArea',
    label: '合法面积（㎡）',
    search: {
      show: false
    }
  },
  {
    width: 150,
    field: 'landIllegalArea',
    label: '不合法面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'separateFlag',
    label: '是否分权',
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
    label: '房屋来源',
    search: {
      show: false
    }
  },
  // {
  //   field: 'demographicIdName',
  //   label: '房屋产权人',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'ownersSituationName',
  //   label: '共有人情况',
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
const emit = defineEmits(['updateData'])
const onFilling = () => {
  saveFillingCompleteApi({
    doorNo: props.doorNo,
    propertyStatus: '1'
  }).then((res: any) => {
    if (res) {
      ElMessage.success('操作成功')
      emit('updateData')
    }
  })
}
//截取字符串
const splitStr = (str) => str.slice(1, str.length - 1)
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
