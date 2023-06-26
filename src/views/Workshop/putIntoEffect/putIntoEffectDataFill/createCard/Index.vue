<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="title"> 家庭基本情况列表</div>
        <!-- <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
        </ElSpace> -->
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
        <!-- <template #action="{ row }">
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
        </template> -->
      </Table>
      <div class="flex items-center justify-between pb-12px mt-20px">
        <div class="title"> 费用补偿情况列表</div>
      </div>
      <div class="fylist">
        <ElTable
          :data="fyTableObject"
          :span-method="objectSpanMethod"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          :border="true"
        >
          <ElTableColumn label="类型" align="center" prop="type" header-align="center">
            <template #default="scope">
              <b>{{ scope.row.type }}</b>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="指标名称"
            class-name="name-row"
            align="left"
            :width="200"
            prop="name"
            header-align="right"
          >
            <template #default="scope">
              <b
                v-if="
                  scope.row.name &&
                  (scope.row.name.includes('小计') || scope.row.name.includes('合计')) &&
                  scope.row.name !== '其他费用/专项费小计'
                "
              >
                {{ scope.row.name }}
              </b>
              <div v-else>
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="" align="center" prop="subname" header-align="center" />
          <ElTableColumn label="单位" align="center" prop="unit" header-align="center" />
          <ElTableColumn label="数量" align="center" prop="num" header-align="center" />
          <ElTableColumn label="补偿单价" align="center" prop="price" header-align="center" />
          <ElTableColumn label="补偿金额（元）" align="center" prop="money" header-align="center" />
          <ElTableColumn label="备注" align="left" prop="center" header-align="center" />
        </ElTable>
      </div>
      <div class="pb-12px mt-20px">
        <div class="title"> 备注</div>
        <div class="text">1. 补偿费、异地搬迁补助费、奖励费等拨付至甲方指定银行</div>
        <div class="text mt-20px">
          2. 搬迁补助费、过渡资金补助费、其他补助费、临时安置补助费拨付至乙方指定银行。
        </div>
        <div class="text mt-20px">
          3.临时安置补助费首次发放时间为乙方腾空被拆迁房屋并办理交付手续之日起十五日内，每半年发放一次，截止时间为安置房选房的当月。
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/population/service'
import { standardFormatDate } from '@/utils/index'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods
const fyTableObject = [
  {
    type: '补偿费',
    name: '房屋主体补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '136435',
    remark: ''
  },
  {
    type: '补偿费',
    name: '房屋装修补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '21882',
    remark: ''
  },
  {
    type: '补偿费',
    name: '附属物补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '2918',
    remark: ''
  },
  {
    type: '补偿费',
    name: '零星果木补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '补偿费',
    name: '地上青苗及附着物补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '65210',
    remark: ''
  },
  {
    type: '补偿费',
    name: '土地补偿费（到户）',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '补偿费',
    name: '坟墓迁移补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '补偿费',
    name: '农副业设施设备补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '补偿费',
    name: '其他补偿费',
    unit: '——',
    num: '——',
    price: '——',
    money: '7837.5',
    remark: ''
  },
  {
    type: '补偿费',
    name: '补偿小计',
    unit: '',
    num: '',
    price: '',
    money: '234282.5',
    remark: ''
  },
  {
    type: '奖励费',
    name: '建房补助费',
    unit: '项',
    num: '1',
    price: '29205.6',
    money: '29205.6',
    remark: ''
  },
  {
    type: '奖励费',
    name: '搬迁补助费',
    unit: '项',
    num: '1',
    price: '24000',
    money: '24000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '过渡期补助费',
    unit: '项',
    num: '1',
    price: '28800',
    money: '28800',
    remark: ''
  },
  {
    type: '奖励费',
    name: '临时安置补助费',
    unit: '项',
    num: '1',
    price: '45405.6',
    money: '45405.6',
    remark: ''
  },
  {
    type: '奖励费',
    name: '分散安置移民基础设施费',
    unit: '项',
    num: '1',
    price: '0',
    money: '0',
    remark: ''
  },
  {
    type: '奖励费',
    name: '其他补助费',
    unit: '——',
    num: '1',
    price: '0',
    money: '0',
    remark: ''
  },
  {
    type: '奖励费',
    name: '补助费小计',
    unit: '',
    num: '',
    price: '',
    money: '127411.2',
    remark: ''
  },
  {
    type: '奖励费',
    name: '签约奖',
    subname: '网格签约奖',
    unit: '项',
    num: '0',
    price: '0',
    money: '0',
    remark: ''
  },
  {
    type: '奖励费',
    name: '签约奖',
    subname: '按时签约奖',
    unit: '项',
    num: '1',
    price: '48000',
    money: '48000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '签约奖',
    subname: '其他签约奖',
    unit: '项',
    num: '1',
    price: '33000',
    money: '33000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '腾空奖',
    subname: '房屋提前腾空奖',
    unit: '项',
    num: '1',
    price: '21000',
    money: '21000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '腾空奖',
    subname: '青苗提前腾空奖',
    unit: '项',
    num: '0',
    price: '0',
    money: '0',
    remark: ''
  },
  {
    type: '奖励费',
    name: '建房奖',
    subname: '启动建房奖励',
    unit: '项',
    num: '1',
    price: '18000',
    money: '18000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '建房奖',
    subname: '完成建房奖励',
    unit: '项',
    num: '1',
    price: '18000',
    money: '18000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '建房奖',
    subname: '搬迁入住奖励',
    unit: '项',
    num: '1',
    price: '12000',
    money: '12000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '其他奖励费',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '6000',
    remark: ''
  },
  {
    type: '奖励费',
    name: '奖励费小计',
    subname: '',
    unit: '',
    num: '',
    price: '',
    money: '156000',
    remark: ''
  },
  {
    type: '其他费用',
    name: '集体资产处理款',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '其他费用',
    name: '生态公益林补偿金',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '其他费用',
    name: '工商企业补偿补助费',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '其他费用',
    name: '其他',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '0',
    remark: ''
  },
  {
    type: '其他费用',
    name: '其他费用/专项费小计',
    subname: '',
    unit: '',
    num: '',
    price: '',
    money: '0',
    remark: ''
  },
  {
    type: '其他费用',
    name: '合计',
    subname: '',
    unit: '',
    num: '',
    price: '',
    money: '517693.7',
    remark: ''
  },
  {
    type: '其他费用',
    name: '估算安置房价格',
    subname: '',
    unit: '——',
    num: '——',
    price: '——',
    money: '',
    remark: ''
  }
]

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  console.log(row, column)
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 10,
        colspan: 1
      }
    } else if (rowIndex === 10) {
      return {
        rowspan: 17,
        colspan: 1
      }
    } else if (rowIndex === 27) {
      return {
        rowspan: 7,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 1) {
    if (rowIndex === 17) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 18) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 19) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 20) {
      return {
        rowspan: 2,
        colspan: 1
      }
    } else if (rowIndex === 21) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 22) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 23) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 24) {
      return {
        rowspan: 1,
        colspan: 0
      }
    }
  }
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
    field: 'addReason',
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
    console.log('1111111')
    return 'gray-row'
  } else {
    return ''
  }
}
const { allSchemas } = useCrudSchemas(schema)
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
