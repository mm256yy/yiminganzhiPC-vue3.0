<template>
  <ElDialog
    title="付款对象选择"
    :model-value="props.show"
    :width="1700"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <div v-if="props.type == true">
      <ElButton @click="addDemo" type="primary" style="float: right; margin-bottom: 10px"
        >添加</ElButton
      >
      <ElTable :data="tableDatas" style="width: 100%" class="mb-20" :border="true" row-key="id">
        <ElTableColumn
          label="序号"
          align="center"
          width="80"
          type="index"
          header-align="center"
          prop="index"
        />
        <ElTableColumn label="支付对象" align="center" prop="payObject" header-align="center">
          <template #default="{ row }">
            <ElSelect class="w-350px" v-model="row.payObject">
              <ElOption
                v-for="item in dictObj[393]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="申请金额" prop="contractName" align="center" header-align="center">
          <!-- <ElInputNumber class="!w-200px" /> -->
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.contractName" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="操作"
          prop="contractName"
          align="center"
          header-align="center"
          width="80"
        >
          <template #default="{ row }">
            <ElButton @click="delDemo(row)" type="primary" style="float: right; margin-bottom: 10px"
              >删除</ElButton
            >
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- <div>
        <div>序号</div>
        <div>序号</div>
        <div>序号</div>
        <div>序号</div>
      </div> -->

      <div>合计金额:{{ amountPrice }}元</div>
    </div>
    <!-- <div class="search-form-wrap">
      <ElForm
        class="form"
        ref="formRef"
        :model="searchForm"
        label-width="80px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElRow>
          <ElCol :span="4">
            <ElFormItem label="项目名称" prop="name">
              <ElInput v-model="searchForm.name" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="项目编号" prop="code">
              <ElInput v-model="searchForm.code" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="16">
            <div>
              <ElButton type="primary" @click="onSearch">
                <Icon icon="ep:search" class="mr-5px" /> 查询
              </ElButton>
              <ElButton @click="onReset">
                <Icon icon="ep:refresh-right" class="mr-5px" /> 重置
              </ElButton>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
    </div> -->
    <ElTable
      :data="tableData"
      style="width: 100%"
      class="mb-20"
      :border="true"
      v-if="props.type == false"
    >
      <ElTableColumn label="序号" align="center" width="50" type="index" header-align="center" />
      <ElTableColumn label="专项名称" align="center" prop="projectName" header-align="center" />
      <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
      <ElTableColumn label="合同编号" prop="contractCode" align="center" header-align="center" />
      <ElTableColumn label="合同乙方" prop="contractPartyB" align="center" header-align="center" />
      <ElTableColumn
        label="合同金额(万元)"
        prop="contractAmount"
        align="center"
        header-align="center"
      />
      <ElTableColumn label="支付节点" prop="paymentNode" align="center" header-align="center">
        <template #default="{ row }">
          <ElCheckboxGroup v-model="check" @change="checkList(row)">
            <ElCheckbox
              :label="formatDate(item.paymentDate) + ' ' + '金额:' + item.amount + '元'"
              v-for="(item, index) in row.nodeDtoList"
              :key="index"
              v-model="checkType"
            />
          </ElCheckboxGroup>
        </template>
      </ElTableColumn>
      <ElTableColumn label="申请金额" align="center" header-align="center">
        <template #default="{ row }">
          <ElInputNumber class="!w-200px" style="width: 50px" v-model="row.amount" />
        </template>
      </ElTableColumn>
    </ElTable>

    <template #footer>
      <ElButton @click="onClose(false)">取消</ElButton>
      <ElButton type="primary" @click="addSubmit(false)">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElDialog,
  ElButton,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElMessage,
  ElCheckboxGroup,
  ElCheckbox
} from 'element-plus'
// import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { SurveyStatusEnum } from '@/views/Workshop/components/config'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getPaymentApplicationPpsList } from '@/api/fundManage/paymentApplication-service'
import { formatDate } from '@/utils/index'
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
interface PropsType {
  show: any
  type: any
}
// const formRef = ref<any>()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict', 'objlist', 'tableList'])
// const payObject = ref()
// 关闭弹窗
const onClose = (flag: boolean) => {
  emit('close', flag)
}
const addSubmit = (flag: boolean) => {
  emit('objlist', tableDatas.value)
  emit('tableList', tableObj.value)
  emit('close', flag)
}
const dataId = ref<number>(0)
const amountPrice = ref<number>(0)
//删除
// const del = () => {
//   console.log('删除')
// }
const check = ref<any>()
const checkType = ref<boolean>()
const tableData = ref<any[]>([])
const tableObj = ref<any[]>([]) //付款对象集合
const checkList = (row: any) => {
  console.log(row.amount, '123123')
  tableObj.value.push({
    projectName: row.projectName,
    contractName: row.contractName,
    contractCode: row.contractCode,
    contractAmount: row.contractAmount,
    paymentNode: check,
    amount: row.amount
  })
  console.log(tableObj.value, '测试传递的数据')
}
const tableDatas = ref<any[]>([])
const addDemo = () => {
  const d = {
    index: dataId.value++,
    payObject: '',
    contractName: ''
  }
  tableDatas.value.push(d)
  amountPrice.value = tableDatas.value.reduce((c, item) => c + item.contractName * 1, 0)
}
const delDemo = (row: any) => {
  tableDatas.value.splice(row.index, 1)
  ElMessage.success('删除成功！')
}
// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
//   console.log(row, column)
//   console.log(rowIndex, columnIndex)
//   if (columnIndex === 0) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 4,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   } else if (columnIndex === 7) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 3,
//         colspan: 1
//       }
//     } else if (rowIndex === 3) {
//       return {
//         rowspan: 1,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   }
// }
// const objectSpanMethods = ({ row, column, rowIndex, columnIndex }: any) => {
//   console.log(row, column)
//   console.log(rowIndex, columnIndex)
//   if (columnIndex === 0) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 4,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   } else if (columnIndex === 1) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 4,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   }
// }
// const schema = reactive<CrudSchema[]>([
//   {
//     field: 'blurry',
//     label: '区域',
//     search: {
//       show: true,
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入网格员名称'
//       }
//     },
//     table: {
//       show: false
//     }
//   },
//   {
//     field: 'blurry',
//     label: '关键字',
//     search: {
//       show: true,
//       component: 'Input',
//       componentProps: {
//         placeholder: '请输入网格员名称'
//       }
//     },
//     table: {
//       show: false
//     }
//   },

//   // table字段 分割
//   {
//     field: 'index',
//     type: 'index',
//     label: '序号',
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'nickName',
//     label: '网格员',
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'phone',
//     label: '网格员手机号',
//     width: 180,
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'peasantHouseholdNumber',
//     label: '负责居民户数',
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'companyNumber',
//     label: '负责企业',
//     width: 190,
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'individualHouseholdNumber',
//     label: '负责个体户',
//     search: {
//       show: false
//     }
//   },
//   {
//     field: 'villageNumber',
//     label: '负责村集体',
//     search: {
//       show: false
//     }
//   }
// ])

// const { allSchemas } = useCrudSchemas(schema)

const findRecursion = (data, code, callback) => {
  if (!data || !Array.isArray(data)) return null
  data.forEach((item, index, arr) => {
    if (item.code === code) {
      return callback(item, index, arr)
    }
    if (item.children) {
      return findRecursion(item.children, code, callback)
    }
  })
}
const ppsList = () => {
  getPaymentApplicationPpsList({ keywords: '1' }).then((res: any) => {
    if (res) {
      tableData.value = res
      console.log(tableData.value, '付款对象数据')
    }
  })
}
onMounted(() => {
  ppsList()
})
// const getParamsKey = (key: string) => {
//   const map = {
//     Country: 'areaCode',
//     Township: 'townCode',
//     Village: 'villageCode', // 行政村 code
//     NaturalVillage: 'virutalVillageCode' // 自然村 code
//   }
//   return map[key]
// }

// const onSearch = (data) => {
//   // 处理参数
//   let params = {
//     ...data
//   }
//   console.log(params, '测试数据')
//   if (!data.implementFillStatus) {
//     Reflect.deleteProperty(params, 'implementFillStatus')
//   }

//   // 需要重置一次params
//   tableObject.params = {
//     projectId
//   }
//   if (!params.hasPropertyAccount) {
//     delete params.hasPropertyAccount
//   }
//   if (!params.fillStatus) {
//     delete params.fillStatus
//   }
//   if (params.code) {
//     // 拿到对应的参数key
//     findRecursion(villageTree.value, params.code, (item) => {
//       if (item) {
//         params[getParamsKey(item.districtType)] = params.code
//       }
//       params.type = 'Village'
//       params.status = SurveyStatusEnum.Implementation
//       setSearchParams({ ...params })
//     })
//   } else {
//     params.type = 'Village'
//     params.status = SurveyStatusEnum.Implementation
//     setSearchParams({ ...params })
//   }
// }
</script>

<style lang="less">
.el-checkbox:last-of-type {
  margin-right: 30px;
}

.filling-btn {
  display: flex;
  width: 80px;
  height: 28px;
  font-size: 14px;
  color: var(--el-color-primary);
  cursor: pointer;
  background: #e9f3ff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}

.red {
  color: #ff3939;
}

.status {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;

  &.status-err {
    background-color: #ff3939;
  }

  &.status-suc {
    background-color: #0cc029;
  }
}
</style>
