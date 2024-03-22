<!-- 企业建卡 -->
<template>
   
  <WorkContentWrap>
       
    <div class="table-wrap !py-12px !mt-0px">
           
      <div class="flex items-center justify-between pb-12px">
                <div class="title"> 个体工商户账户信息111</div>      
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
                       
            <ElFormItem label="迁前厂址" prop="beforeAddress">
                            <ElInput v-model="form.beforeAddress" placeholder="请输入" />          
               
            </ElFormItem>
                     
          </ElCol>
                   
          <ElCol :span="6">
                       
            <ElFormItem label="安置厂址" prop="afterAddress">
                            <ElInput v-model="form.afterAddress" placeholder="请输入" />            
            </ElFormItem>
                     
          </ElCol>
                   
          <ElCol :span="6">
                       
            <ElFormItem label="企业总人数" prop="peopleNumber">
                            <ElInput v-model="form.peopleNumber" placeholder="请输入" />            
            </ElFormItem>
                     
          </ElCol>
                   
          <ElCol :span="6">
                       
            <ElFormItem label="开户名" prop="bankAccount">
                            <ElInput v-model="form.accountName" placeholder="请输入" />            
            </ElFormItem>
                     
          </ElCol>
                   
          <ElCol :span="6">
                       
            <ElFormItem label="开户行" prop="bankAccount">
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

           
      <div class="flex items-center justify-between pb-12px">
                <div class="title"> 工商、税务登记信息</div>      
      </div>
           
      <!-- <Table
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
      </Table> -->
           
      <div class="table-wrap">
               
        <div class="row-cont">
                   
          <div class="row">
                        <span class="label">营业执照编号：</span>            
            <span class="value">无</span>          
          </div>

                   
          <div class="row">
                        <span class="label">税务登记编号：</span>            
            <span class="value">{{ formList?.taxLicenceNo || '无' }}</span>          
          </div>
                 
        </div>
               
        <div class="row-cont">
                   
          <div class="row">
                        <span class="label">注册资金（万元）：</span>            
            <span class="value">{{ formList?.registeredAmount || '无' }}</span>          
          </div>

                   
          <div class="row">
                        <span class="label">登记注册类型：</span>            
            <span class="value">{{ formList?.registerTypeText || '无' }}</span>          
          </div>
                   
          <div class="row">
                        <span class="label">成立日期：</span>            
            <span class="value">{{
              formList?.establishDate
                ? dayjs(formList.establishDate).format('YYYY-MM-DD HH:mm:ss')
                : '-'
            }}</span>
                     
          </div>
                 
        </div>
               
        <div class="row">
                    <span class="label">经营范围：</span>          
          <span class="value">{{ formList?.natureBusiness || '无' }}</span>        
        </div>
             
      </div>
           
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
        <div class="text mt-20px"> 2. 补助费拨付至乙方指定银行。 </div>        
        <!-- <div class="text mt-20px">
          3.临时安置补助费首次发放时间为乙方腾空被拆迁房屋并办理交付手续之日起十五日内，每半年发放一次，截止时间为安置房选房的当月。
        </div> -->
             
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
  ElMessage
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
import ConfirmReward from '@/views/Workshop/ImmigrantImplement/DataFill/EntCardEstablishment/ConfirmReward.vue' // 引入奖励费确认组件
// import ConfirmReward from './ConfirmReward.vue'
import { onMounted } from 'vue'

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
  //   if (rowIndex === 0) {
  //     return {
  //       rowspan: 10,
  //       colspan: 1
  //     }
  //   } else if (rowIndex === 10) {
  //     return {
  //       rowspan: 17,
  //       colspan: 1
  //     }
  //   } else if (rowIndex === 27) {
  //     return {
  //       rowspan: 7,
  //       colspan: 1
  //     }
  //   } else {
  //     return {
  //       rowspan: 0,
  //       colspan: 0
  //     }
  //   }
  // }

  if (columnIndex === 0) {
    // 如果与上一个分组名称相同，被合并
    if (rowIndex !== 0 && row.type === feeTableData.value[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 0
      }
    } // 统计新的分组所占行数
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
// const getSummar = (param: any) => {
//   const { columns, data } = param
//   const sums: any = []
//   columns.forEach((column: any, index: any) => {
//     // 设置第一列想显示的字
//     if (index === 0) {
//       sums[index] = '合计'
//       return
//     }
//     const values = data.map((item) => Number(item[column.property]))
//     if (index == 5) {
//       sums[index] = `${values.reduce((prev, curr) => {
//         const value = Number(curr)
//         if (!Number.isNaN(value)) {
//           return prev + curr
//         } else {
//           return prev
//         }
//       }, 0)}`
//     } else {
//       sums[index] = '——'
//     }
//   })
//   return sums
// }
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
      break // case '4': //   return '其他费用' //   break
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
  const incentivefeeArr = [
    '签订动迁安置协议',
    '房屋腾空奖励',
    '签订安置村对接协议',
    '启动建房奖励',
    '完成建房奖励',
    '搬迁入住奖励',
    '随迁人口补助费奖励',
    '应迁未迁人口补助奖励',
    '其他奖励费'
  ]
  if (row.name !== '奖励费小计') {
    arr = feeTableData.value.filter((item, index) => item && index !== sumIndex)
  } else {
    arr = feeTableData.value.filter((item) => incentivefeeArr.includes(item.name))
  }

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
</style>
