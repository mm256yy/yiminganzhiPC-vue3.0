<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="fylist">
        <ElTable
          :data="feeTableData"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          :border="true"
        >
          <ElTableColumn label="序号" align="center" prop="serNo" header-align="center">
            <!-- <template #default="{ row }">
              <b>{{ getTypeStr(row.type) }}</b>
            </template> -->
          </ElTableColumn>
          <ElTableColumn label="项目" prop="proName" align="center" header-align="center" />
          <ElTableColumn label="单位" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.unit ? row.unit : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="水库枢纽工程区" prop="unit" align="center" header-align="center">
            <ElTableColumn
              label="水库淹没区"
              width="100"
              prop="inundatedArea"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                {{ row.inundatedArea ? row.inundatedArea : '——' }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="水库影响区"
              prop="influenceArea"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                {{ row.influenceArea ? row.influenceArea : '——' }}
              </template>
            </ElTableColumn>
            <ElTableColumn
              label="枢纽工程建设区"
              prop="buildArea"
              align="center"
              header-align="center"
            >
              <template #default="{ row }">
                {{ row.buildArea ? row.buildArea : '——' }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="小计" prop="subtotal" align="center" header-align="center">
              <template #default="{ row }">
                {{ row.subtotal ? row.subtotal : '——' }}
              </template>
            </ElTableColumn>
          </ElTableColumn>
          <ElTableColumn
            label="输水工程区"
            prop="waterProjectArea"
            align="center"
            header-align="center"
          >
            <template #default="{ row }">
              {{ row.waterProjectArea ? row.waterProjectArea : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="合计" prop="total" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.total ? row.total : '——' }}
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
// import { Table } from '@/components/Table'
// import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import { useTable } from '@/hooks/web/useTable'
// import { getCompensationCardList } from '@/api/immigrantImplement/createCard/service'
import { getsummaryApi } from '@/api/workshop/dataQuery/fruitWood-service'
import { WorkContentWrap } from '@/components/ContentWrap'
// import { SurveyStatusEnum } from '@/views/Workshop/components/config'
const feeTableData = ref<any[]>([
  // {
  //   doorNo: null,
  //   id: null,
  //   isUpdate: '0',
  //   isVerify: null,
  //   name: '房屋主体补偿费',
  //   number: null,
  //   price: 1000,
  //   projectId: 53,
  //   remark: null,
  //   status: null,
  //   totalPrice: 8,
  //   type: '1',
  //   uid: null,
  //   unit: null
  // },
  // {
  //   doorNo: null,
  //   id: null,
  //   isUpdate: '0',
  //   isVerify: null,
  //   name: '房屋主体补偿费',
  //   number: null,
  //   price: 1000,
  //   projectId: 53,
  //   remark: null,
  //   status: null,
  //   totalPrice: 8,
  //   type: '1',
  //   uid: null,
  //   unit: null
  // }
]) // 费用补偿情况列表

// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
//   console.log(row, column)
//   if (columnIndex === 0) {
//     if (rowIndex === 0) {
//       return {
//         rowspan: 10,
//         colspan: 1
//       }
//     } else if (rowIndex === 10) {
//       return {
//         rowspan: 17,
//         colspan: 1
//       }
//     } else if (rowIndex === 27) {
//       return {
//         rowspan: 7,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   } else if (columnIndex === 1) {
//     if (rowIndex === 17) {
//       return {
//         rowspan: 3,
//         colspan: 1
//       }
//     } else if (rowIndex === 18) {
//       return {
//         rowspan: 1,
//         colspan: 0
//       }
//     } else if (rowIndex === 19) {
//       return {
//         rowspan: 1,
//         colspan: 0
//       }
//     } else if (rowIndex === 20) {
//       return {
//         rowspan: 2,
//         colspan: 1
//       }
//     } else if (rowIndex === 21) {
//       return {
//         rowspan: 1,
//         colspan: 0
//       }
//     } else if (rowIndex === 22) {
//       return {
//         rowspan: 3,
//         colspan: 1
//       }
//     } else if (rowIndex === 23) {
//       return {
//         rowspan: 1,
//         colspan: 0
//       }
//     } else if (rowIndex === 24) {
//       return {
//         rowspan: 1,
//         colspan: 0
//       }
//     }
//   }
// }

// // 根据户号来做筛选
// tableObject.params = {
//   doorNo: jl1080433,
// //   status: props.baseInfo.status
// }

const tableRowClassName = ({ row }: any) => {
  if (
    row.proName &&
    (row.proName.includes('小计') || row.proName.includes('合计')) &&
    row.proName !== '其他费用/专项费小计'
  ) {
    return 'gray-row'
  } else {
    return ''
  }
}
// const { allSchemas } = useCrudSchemas(schema)

// const formRef = ref<FormInstance>()
// const form = ref<any>({ ...props.baseInfo })

// 获取费用补偿情况列表
const getRewardFeeList = () => {
  getsummaryApi({}).then((res: any) => {
    feeTableData.value = res
  })
}

/**
 * 获取金额类型
 * @param type 类型 1 补偿, 2 补助, 3 奖励, 4 其他
 */
// const getTypeStr = (type: string) => {
//   switch (type) {
//     case '1':
//       return '补偿费'
//       break
//     case '2':
//       return '补助费'
//       break
//     case '3':
//       return '奖励费'
//       break
//     case '4':
//       return '其他费用'
//       break
//     default:
//       return ''
//   }
// }

/**
 * 计算补偿金额
 * 补偿金额 = 数量 * 单价
 * @param row 当前行数据
 */
// const computedTotalPrice = (row: any) => {
//   if (row.totalPrice) {
//     return Number(row.totalPrice)
//   } else {
//     if (row.number && row.price) {
//       return Number(row.number) * Number(row.price)
//     } else {
//       return 0
//     }
//   }
// }

/**
 * 获取奖励小计
 * @param row 当前行信息
 */
// const getSummaries = (row: any) => {
//   let sums = 0
//   let sumIndex = 0
//   feeTableData.value.forEach((column, index) => {
//     if (column.name === row.name) {
//       sumIndex = index
//     }
//   })
//   const arr = feeTableData.value.filter((item, index) => item && index !== sumIndex)
//   sums = arr.reduce((totalPrice, currentItem) => {
//     return totalPrice + computedTotalPrice(currentItem)
//   }, 0)
//   return sums
// }

onMounted(() => {
  getRewardFeeList()
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
