<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <ElButton type="primary" @click="onExport">导出</ElButton>
    </div>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="change-list">
        <ElTable
          :data="feeTableData"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          height="650"
          :border="true"
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
          <ElTableColumn label="实物复核合计" prop="total" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.reviewTotal ? row.reviewTotal : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="差额" prop="differenceValue" align="center" header-align="center" />
        </ElTable>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElTable, ElTableColumn } from 'element-plus'
import {
  getPhysicalChangesBaseListApi,
  getChangeExport
} from '@/api/workshop/dataQuery/outcomeChange-service'
import { WorkContentWrap } from '@/components/ContentWrap'

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

// 获取基础列表
const getRewardFeeList = () => {
  getPhysicalChangesBaseListApi().then((res: any) => {
    feeTableData.value = res
  })
}

// 导出
const onExport = async () => {
  const res = await getChangeExport({ type: '0' })
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}

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

.search-form-wrap {
  display: flex;
  justify-content: space-between;
}

.title {
  margin: 5px 0;
  font-family: PingFang SC-Bold, PingFang SC;
  font-size: 16px;
  font-weight: bold;
  color: #171718;
}

.change-list {
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

:deep(.change-list .gray-row .el-table__cell) {
  background: #ebebeb;
}

:deep(.change-list .el-table .name-row) {
  border-right: none;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(18) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(21) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table__body .el-table__row:nth-child(23) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.change-list .el-table--border::before) {
  background: #fff;
}

:deep(.change-list .el-table__border-left-patch) {
  width: 0;
}

:deep(.change-list .el-table--border::after) {
  background: #fff;
}

:deep(.change-list .el-table--border .el-table__inner-wrapper::after) {
  background: #fff;
}
</style>
