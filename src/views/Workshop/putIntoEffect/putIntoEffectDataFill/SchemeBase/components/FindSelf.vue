<template>
  <div class="homestead-wrap" :style="{ width: props.viewType === 'default' ? '100%' : '752px' }">
    <el-table
      :data="tableData"
      :span-method="spanMethod"
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column
        prop="title"
        label="类别"
        :width="props.viewType === 'default' ? 153 : 100"
      />
      <el-table-column
        prop="subProject"
        label="项目"
        :width="props.viewType === 'default' ? 264 : 197"
      />
      <el-table-column prop="unit" label="单位" :width="props.viewType === 'default' ? 110 : 62" />
      <el-table-column
        prop="number"
        label="数量"
        :width="props.viewType === 'default' ? 264 : 131"
      />
      <el-table-column
        prop="costPrice"
        label="单价"
        :width="props.viewType === 'default' ? 264 : 131"
      />
      <el-table-column
        prop="totalPrice"
        label="金额"
        :width="props.viewType === 'default' ? 260 : 131"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { selfResettleData } from './config'

interface PropsType {
  viewType: 'pup' | 'default'
}

const props = defineProps<PropsType>()
const tableData = ref(selfResettleData)

// 合并单元格
const spanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    // 如果与上一个分组名称相同，被合并
    if (rowIndex !== 0 && row.type === tableData.value[rowIndex - 1].type) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
    // 统计新的分组所占行数
    let index = rowIndex + 1
    let rowspan = 1
    while (index < tableData.value.length) {
      if (row.type === tableData.value[index].type) {
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
      sums[index] = `$ ${values.reduce((prev, curr) => {
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
.homestead-wrap {
  margin: 0 auto;
}

.common-form-item {
  display: flex;
  align-items: center;
  padding: 22px 0;
  margin: 0 auto;
  border-bottom: 1px dotted #ebebeb;

  .common-label {
    width: 140px;
    font-size: 14px;
    line-height: 32px;
    color: #131313;
    text-align: right;
  }

  .common-value {
    flex: 1;
    font-size: 14px;
    color: #131313;
  }
}
</style>
