<!-- 只征地不搬迁建卡 -->
<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="title"> 只征地不搬迁类账户信息 </div>
      </div>
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="100px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElRow>
          <ElCol :span="6">
            <ElFormItem label="开户名" prop="accountName">
              <ElInput v-model="form.accountName" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="开户行" prop="bankName">
              <ElInput v-model="form.bankName" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="银行账户" prop="bankAccount">
              <ElInput v-model="form.bankAccount" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElButton type="primary" @click="onDocumentation">归档</ElButton>
            <ElButton type="primary" @click="onPrint">打印报表</ElButton>
            <ElButton type="primary" @click="onSubmit(formRef)">保存</ElButton>
          </ElCol>
        </ElRow>
      </ElForm>
      <div class="flex items-center justify-between pb-12px mt-20px">
        <div class="title"> 费用补偿情况列表</div>
        <ElSpace>
          <ElButton type="primary" @click="confirmReward">奖励费确认</ElButton>
        </ElSpace>
      </div>
      <div class="fylist">
        <ElTable
          :data="feeTableData"
          :span-method="objectSpanMethod"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          :border="true"
          show-summary
          :summary-method="getSummar"
        >
          <ElTableColumn label="类型" align="center" prop="type" header-align="center">
            <template #default="{ row }">
              <b>{{ getTypeStr(row.type) }}</b>
            </template>
          </ElTableColumn>
          <ElTableColumn label="指标名称" prop="name" align="center" header-align="center" />
          <ElTableColumn label="单位" width="100" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.unit ? row.unit : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="数量" prop="number" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.number }}</div>
              <div v-if="row.isUpdate !== '1'"> —— </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="补偿单价" prop="price" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.price }}</div>
              <div v-if="row.isUpdate !== '1'"> —— </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="补偿金额"
            width="100"
            prop="totalPrice"
            align="center"
            header-align="center"
          >
            <template #default="{ row }">
              <div v-if="row.isUpdate === '0'">{{ row.totalPrice }}</div>
              <div v-else-if="row.isUpdate === '1' && row.name !== '奖励费小计'">{{
                computedTotalPrice(row)
              }}</div>
              <div v-else-if="row.isUpdate === '1' && row.name === '奖励费小计'">
                {{ getSummaries(row) }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.remark }}</div>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <div class="pb-12px mt-20px">
        <div class="title"> 备注</div>
        <div class="text">1. 补偿费、奖励费等拨付至甲方指定银行</div>
      </div>
    </div>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="close('documentation')" />

    <!-- 奖励费确认 -->
    <ConfirmReward
      :show="rewardConfirmDialog"
      :door-no="props.doorNo"
      @close="close('rewardConfirm')"
      :id="2"
    />
    <!-- style="
        position: fixed;
        left: -1500px;
        display: flex;
        width: 340mm;
        padding: 10px 10px 0px 10px;
      " -->
    <div
      id="print"
      class="printStyle"
      :style="{ display: feeTableData.length > 0 ? 'block' : 'none' }"
    >
      <div style="width: 50%; padding-right: 10px">
        <h1 style="font-size: 24px; text-align: center">只征地不搬迁补偿登记卡</h1>
        <div
          style="
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin: 20px 0 20px 0;
          "
        >
          <div style="width: 33%">
            <span style="font-weight: bold">使用权人:</span>
            <span style="margin-left: 5px">{{ baseInfo.name }}</span>
          </div>
          <div style="width: 33%">
            <span style="font-weight: bold">户号:</span>
            <span style="margin-left: 5px">{{ baseInfo.showDoorNo }}</span>
          </div>
          <div style="width: 33%">
            <span style="font-weight: bold">权属单位:</span>
            <span style="margin-left: 5px">{{ baseInfo.underlyingCompany }}</span>
          </div>
        </div>
        <ElDescriptions class="margin-top" :column="2" border>
          <ElDescriptionsItem label="开户名：" label-class-name="my-label" class-name="my-content">
            {{ form.accountName }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="开户行：" label-class-name="my-label" class-name="my-content"
            >{{ form.bankName }}
          </ElDescriptionsItem>
          <ElDescriptionsItem
            label="银行账号："
            label-class-name="my-label"
            class-name="my-content"
          >
            {{ form.bankAccount }}
          </ElDescriptionsItem>
        </ElDescriptions>
        <h2 style="margin: 20px; font-size: 18px; text-align: center">生产安置情况</h2>
        <el-table
          :data="tableObject.tableList"
          style="width: 100%"
          header-cell-class-name="table-headers"
          cell-class-name="table-cellss"
          border
        >
          <el-table-column
            :prop="item.field"
            :label="item.label"
            v-for="item in allSchemass"
            :key="item.field"
          />
        </el-table>
        <div style="display: flex; width: 100%; height: 55%; align-items: center">
          <div style="padding-left: 20px">制发单位（盖章）：</div>
        </div>
      </div>
      <div style="width: 50%; padding-left: 10px">
        <ElTable
          :data="feeTableData"
          :span-method="objectSpanMethod"
          style="width: 100%"
          header-cell-class-name="table-headers"
          cell-class-name="table-cellss"
          show-summary
          :summary-method="getSummariese"
          border
          :row-style="{ height: '27px' }"
        >
          <ElTableColumn label="类型" align="center" prop="type" header-align="center">
            <template #default="{ row }">
              <b>{{ getTypeStr(row.type) }}</b>
            </template>
          </ElTableColumn>
          <ElTableColumn label="指标名称" prop="name" align="center" header-align="center" />
          <ElTableColumn label="单位" width="60" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.unit ? row.unit : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="数量" width="60" prop="number" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">
                {{ row.number }}
              </div>
              <div v-if="row.isUpdate !== '1'">——</div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="补偿单价" prop="price" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">
                {{ row.price }}
              </div>
              <div v-if="row.isUpdate !== '1'">——</div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="补偿金额" prop="totalPrice" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '0'">{{ row.totalPrice }}</div>
              <div v-else-if="row.isUpdate === '1' && row.name !== '奖励费小计'">
                {{ computedTotalPrice(row) }}
              </div>
              <div v-else-if="row.isUpdate === '1' && row.name === '奖励费小计'">
                {{ getSummaries(row) }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">
                {{ row.remark }}
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
        <div style="padding: 5px; font-size: 8px">移民户主：</div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  ElTable,
  ElTableColumn,
  FormInstance,
  ElForm,
  ElFormItem,
  FormRules,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElMessage,
  ElDescriptions,
  ElDescriptionsItem
} from 'element-plus'
import { debounce } from 'lodash-es'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { standardFormatDate } from '@/utils/index'
import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/population/service'
import {
  updatePeasantHouseholdInfo,
  getCompensationCardList,
  getcompanyList
} from '@/api/immigrantImplement/createCard/service'
import dayjs from 'dayjs'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件
import ConfirmReward from '@/views/Workshop/ImmigrantImplement/DataFill/CompensationCard/ConfirmReward.vue' // 引入奖励费确认组件
// import ConfirmReward from './ConfirmReward.vue'
import { onMounted } from 'vue'
import { htmlToPdf } from '@/utils/ptf'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref<boolean>(false)
const rewardConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods

const feeTableData = ref<any[]>([]) // 费用补偿情况列表

const objectSpanMethod = ({ row, rowIndex, columnIndex }: any) => {
  // console.log(row, column)
  // if (columnIndex === 0) {
  //   if (rowIndex === 0) {
  //     return {
  //       rowspan: 10,
  //       colspan: 1
  //     }
  //   } else if (rowIndex === 10) {
  //     return {
  //       rowspan: 17,
  //       colspan: 1
  //     }
  //   } else if (rowIndex === 27) {
  //     return {
  //       rowspan: 7,
  //       colspan: 1
  //     }
  //   } else {
  //     return {
  //       rowspan: 0,
  //       colspan: 0
  //     }
  //   }
  // }

  if (columnIndex === 0) {
    // 如果与上一个分组名称相同，被合并
    if (rowIndex !== 0 && row.type === feeTableData.value[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    // 统计新的分组所占行数
    let index = rowIndex + 1
    let rowspan = 1
    while (index < feeTableData.value.length) {
      if (row.type === feeTableData.value[index].type) {
        rowspan++
        index++
      } else {
        break
      }
    }
    return {
      rowspan: rowspan,
      colspan: 1
    }
  }
}
// 做合计动作
const getSummar = (param: any) => {
  const { columns, data } = param
  const sums: any = []
  columns.forEach((column: any, index: any) => {
    // 设置第一列想显示的字
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item) => {
      return { num: Number(item[column.property]), key: item.name }
    })
    console.log(values, '测试叠加数据')
    if (index == 5) {
      console.log(param, values)

      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr.num)
        if (!Number.isNaN(value) && !curr.key.includes('小计')) {
          return prev + curr.num
        } else {
          return prev
        }
      }, 0)
    } else {
      sums[index] = '——'
    }
  })
  return sums
}
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
    field: 'populationNatureText',
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
    field: 'addReasonText',
    label: '新增原因',
    search: {
      show: false
    }
  }
])

const tableRowClassName = ({ row }: any) => {
  if (
    row.name &&
    (row.name.includes('小计') || row.name.includes('合计')) &&
    row.name !== '其他费用/专项费小计'
  ) {
    return 'gray-row'
  } else {
    return ''
  }
}
const { allSchemas } = useCrudSchemas(schema)

const formRef = ref<FormInstance>()
const form = ref<any>({ ...props.baseInfo })
const rules = reactive<FormRules>({
  beforeAddress: [{ required: true, message: '请输入开户名', trigger: 'blur' }]
})

// 获取费用补偿情况列表
const getRewardFeeList = () => {
  getCompensationCardList(props.doorNo).then((res: any) => {
    feeTableData.value = res
  })
}

/**
 * 获取金额类型
 * @param type 类型 1 补偿, 2 补助, 3 奖励, 4 其他
 */
const getTypeStr = (type: string) => {
  switch (type) {
    case '1':
      return '补偿费'
      break
    case '2':
      return '补助费'
      break
    case '3':
      return '奖励费'
      break
    // case '4':
    //   return '其他费用'
    //   break
    default:
      return ''
  }
}

/**
 * 计算补偿金额
 * 补偿金额 = 数量 * 单价
 * @param row 当前行数据
 */
const computedTotalPrice = (row: any) => {
  if (row.totalPrice) {
    return Number(row.totalPrice)
  } else {
    if (row.number && row.price) {
      return Number(row.number) * Number(row.price)
    } else {
      return 0
    }
  }
}

/**
 * 获取奖励小计
 * @param row 当前行信息
 */
const getSummaries = (row: any) => {
  let sums = 0
  let sumIndex = 0
  feeTableData.value.forEach((column, index) => {
    if (column.name === row.name) {
      sumIndex = index
    }
  })
  let arr: any[] = []
  const incentivefeeArr = ['签约奖', '腾空奖', '其他奖励费', '奖励费小计']
  if (row.name !== '奖励费小计') {
    arr = feeTableData.value.filter((item, index) => item && index !== sumIndex)
  } else {
    arr = feeTableData.value.filter((item) => incentivefeeArr.includes(item.name))
  }
  console.log(arr, 'arr是什么？')
  sums = arr.reduce((totalPrice, currentItem) => {
    return totalPrice + computedTotalPrice(currentItem)
  }, 0)
  return sums
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

// 打印报表
const onPrint = () => {
  console.log('打印报表')
  htmlToPdf('#print', '只征地不搬迁补偿登记卡')
}

// 奖励费确认
const confirmReward = () => {
  rewardConfirmDialog.value = true
}

// 关闭弹窗
const close = (type: string) => {
  if (type === 'documentation') {
    dialog.value = false
  } else if (type === 'rewardConfirm') {
    rewardConfirmDialog.value = false
    getRewardFeeList()
  }
}

// 表单提交
const submit = (data: any) => {
  updatePeasantHouseholdInfo(data).then((res: any) => {
    if (res) {
      ElMessage.success('操作成功')
      emit('updateData')
    }
  })
}

// 保存
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const data: any = {
        ...form.value
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)
const formList = ref<any>({})
let allSchemass = allSchemas.tableColumns.filter((item: any) => {
  return item.label !== '序号'
})
const getSummariese = (param) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item) => {
      return { num: Number(item[column.property]), key: item.name }
    })
    if (index == 5) {
      console.log(param, values)

      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr.num)
        if (!Number.isNaN(value) && !curr.key.includes('小计')) {
          return prev + curr.num
        } else {
          return prev
        }
      }, 0)
    } else {
      sums[index] = '/'
    }
  })

  return sums
}
onMounted(() => {
  getRewardFeeList()
  getcompanyList({ size: 10, page: 0, status: 'review', doorNo: props.baseInfo.doorNo }).then(
    (res: any) => {
      if (res) {
        formList.value = res.content[0]
        console.log(res.content[0], 'bbq')
      }
    }
  )
  console.log(form)
})
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

.fylist {
  el-pagination {
    display: none !important;
  }
}

.text {
  font-family: PingFang SC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

.row-cont {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

:deep(.fylist .gray-row .el-table__cell) {
  background: #ebebeb;
}

:deep(.fylist .el-table .name-row) {
  border-right: none;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(18) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(21) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(23) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table--border::before) {
  background: #fff;
}

:deep(.fylist .el-table__border-left-patch) {
  width: 0;
}

:deep(.fylist .el-table--border::after) {
  background: #fff;
}

:deep(.fylist .el-table--border .el-table__inner-wrapper::after) {
  background: #fff;
}

:deep(.el-descriptions) {
  --el-descriptions-table-border: 1px solid black;

  .el-descriptions__body {
    .el-descriptions__table {
      // border-color: #171718;
      tbody {
        tr {
          .my-label {
            font-weight: bold;
            background: none;
          }
        }
      }
    }
  }
}

#print {
  :deep(.table-headers) {
    font-size: 8px;
    font-weight: bold;
    background: none;
  }

  :deep(.table-cellss) {
    .cell {
      font-size: 7px;
      background: none;
    }
  }

  .el-table {
    --el-table-border-color: black;
    --el-table-border: 1px solid black;
  }

  :deep(.el-table__footer) {
    tbody {
      tr {
        td {
          font-size: 7px;
          font-weight: bold;
          background: none;
        }
      }
    }
  }

  :deep(.el-table .el-table__cell) {
    padding: 0px;
  }
}
</style>
