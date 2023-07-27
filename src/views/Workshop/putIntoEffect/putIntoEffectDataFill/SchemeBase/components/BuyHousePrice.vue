<template>
  <div class="buy-house-wrap">
    <el-table :data="tableData" :summary-method="getSummaries" show-summary>
      <!--   :span-method="spanMethod" -->
      <el-table-column align="center" prop="index" label="排序" width="60" />
      <el-table-column align="center" prop="area" label="户型" width="60" />
      <el-table-column align="center" prop="number" label="数量" width="60" />

      <el-table-column align="center" prop="" label="综合成本价部分">
        <el-table-column align="center" prop="area" label="面积(㎡)" width="83" />
        <el-table-column align="center" prop="costPrice" label="单价(元)" width="103" />
        <el-table-column align="center" prop="totalPrice" label="金额(元)" width="103" />
      </el-table-column>

      <el-table-column align="center" prop="" label="市场优惠价部分">
        <el-table-column align="center" prop="area" label="面积(㎡)" width="83" />
        <el-table-column align="center" prop="marketCostPrice" label="单价(元)" width="103" />
        <el-table-column align="center" prop="marketTotalPrice" label="金额(元)" width="103" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

const tableData = ref([
  {
    index: 1,
    number: 1,
    area: 100,
    costPrice: 1500,
    totalPrice: 150000,
    marketCostPrice: 2000,
    marketTotalPrice: 200000
  },
  {
    index: 2,
    number: 1,
    area: 50,
    costPrice: 1500,
    totalPrice: 75000,
    marketCostPrice: 2000,
    marketTotalPrice: 100000
  }
])

// 合并单元格
// const spanMethod = ({ row, rowIndex, columnIndex }) => {
//   if (columnIndex === 0) {
//     // 如果与上一个分组名称相同，被合并
//     if (rowIndex !== 0 && row.type === tableData.value[rowIndex - 1].type) {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//     // 统计新的分组所占行数
//     let index = rowIndex + 1
//     let rowspan = 1
//     while (index < tableData.value.length) {
//       if (row.type === tableData.value[index].type) {
//         rowspan++
//         index++
//       } else {
//         break
//       }
//     }
//     return {
//       rowspan: rowspan,
//       colspan: 1
//     }
//   }
// }
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })

  return sums
}
</script>

<style lang="less" scoped>
.buy-house-wrap {
  width: 752px;
  margin: 0 auto;
}
</style>
