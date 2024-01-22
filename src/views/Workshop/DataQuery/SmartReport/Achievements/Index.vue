<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 实物成果汇总表 </div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <div class="fylist">
        <ElTable
          :data="feeTableData"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          :border="true"
          height="650"
        >
          <ElTableColumn label="序号" align="center" prop="serNo" header-align="center" />
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
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { getsummaryApi } from '@/api/workshop/dataQuery/fruitWood-service'
import { WorkContentWrap } from '@/components/ContentWrap'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const titles = ['智能报表', '实物成果', '居民户', '实物成果汇总']
const feeTableData = ref<any[]>([]) // 费用补偿情况列表

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

// 获取费用补偿情况列表
const getRewardFeeList = () => {
  getsummaryApi({}).then((res: any) => {
    feeTableData.value = res
  })
}

// 数据导出
const onExport = () => {
  // const params = {
  //   exportType: '1',
  //   ...tableObject.params
  // }
  // const res = await exportReportApi(params)
  // let filename = res.headers
  // filename = filename['content-disposition']
  // filename = filename.split(';')[1].split('filename=')[1]
  // filename = decodeURIComponent(filename)
  // let elink = document.createElement('a')
  // document.body.appendChild(elink)
  // elink.style.display = 'none'
  // elink.download = filename
  // let blob = new Blob([res.data])
  // const URL = window.URL || window.webkitURL
  // elink.href = URL.createObjectURL(blob)
  // elink.click()
  // document.body.removeChild(elink)
  // URL.revokeObjectURL(elink.href)
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
