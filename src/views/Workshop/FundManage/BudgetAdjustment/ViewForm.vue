<template>
  <ElDialog
    title="查看详情"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">申请类型</div>
          <div class="content">付款申请</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">申请名称</div>
          <div class="content">专业项目合同款</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">申请人</div>
          <div class="content">王涛</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款说明</div>
          <div class="content">专业项目合同款说明</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">概算科目</div>
          <div class="content">概算内</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">资金科目</div>
          <div class="content">一级科目 二级科目 三级科目</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款对象类型</div>
          <div class="content">专业项目</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款类型</div>
          <div class="content">支付</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">申请总金额</div>
          <div class="content">100,019.20 元</div>
        </div>
      </ElCol>
    </ElRow>

    <div class="title-1">
      <span class="main-title">专业项目合同清单</span>
      申请总金额：<span class="num">100,019.20</span> 元 申请合同数：<span class="num">2</span> 个
    </div>

    <ElTable
      :data="tableData"
      :span-method="objectSpanMethod"
      style="width: 100%"
      class="mb-20"
      :border="true"
    >
      <ElTableColumn label="序号" align="center" width="80" type="index" header-align="center" />
      <ElTableColumn label="专项名称" align="center" prop="specialName" header-align="center" />
      <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
      <ElTableColumn label="合同编号" prop="contractNo" align="center" header-align="center" />
      <ElTableColumn label="合同乙方" prop="contractPartyB" align="center" header-align="center" />
      <ElTableColumn label="合同金额(万元)" prop="amount" align="center" header-align="center" />
      <ElTableColumn label="支付节点" prop="paymentNode" align="center" header-align="center" />
      <ElTableColumn label="申请金额" prop="applyAmount" align="center" header-align="center" />
    </ElTable>

    <ElRow>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">调整事项</div>
          <div class="content">概算内调整为概算外</div>
        </div>
      </ElCol>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">调整说明</div>
          <div class="content">合同变更</div>
        </div>
      </ElCol>
    </ElRow>

    <div class="title-2">审批流程</div>

    <div class="progress-wrapper">
      <div class="progress-list">
        <div class="progress-item" v-for="item in progressList" :key="item.name">
          <div class="left">
            <div class="icon-box">
              <div v-if="item.isAudit === '0'" class="disabled"></div>
              <img
                v-if="item.isAudit === '1'"
                src="@/assets/imgs/icon_finish.png"
                width="18"
                height="18"
              />
              <div v-if="item.isAudit === '2'" class="hollow"></div>
            </div>
            <div v-if="item.isAudit === '0' && item.type !== '5'" class="line disabled"></div>
            <div v-if="item.isAudit === '1' && item.type !== '5'" class="line"></div>
            <div v-if="item.isAudit === '2' && item.type !== '5'" class="line in-progress"></div>
            <div v-if="item.type === '5'" class="line none"></div>
          </div>
          <div class="right">
            <div class="content-box">
              <div class="content-1">
                <div class="name">{{ item.name }}</div>
              </div>
              <div class="time" v-if="item.isAudit === '1'">
                审核时间：{{ dayjs(item.auditDate).format('YYYY-MM-DD') }}
              </div>
              <div class="remark" v-if="item.isAudit === '1' && item.remark">
                审核意见: {{ item.remark }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElRow, ElCol, ElTable, ElTableColumn } from 'element-plus'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
// import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  show: any
  row?: LandlordDtoType | null | undefined
}
// const dictStore = useDictStoreWithOut()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const dataInfo = ref<any>()

const tableData = ref<any[]>([
  {
    id: 1,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 2,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 3,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 4,
    specialName: '通讯光缆',
    contractName: '安装合同',
    contractNo: '001',
    contractPartyB: 'B公司',
    amount: 400,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '25,000'
  }
])

const progressList = ref<any[]>([
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '主管领导审核',
    projectId: 53,
    status: 'implementation',
    type: '1',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: ''
  },
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '财务审核',
    projectId: 53,
    status: 'implementation',
    type: '2',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: '同意'
  },
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '分管领导审核',
    projectId: 53,
    status: 'implementation',
    type: '3',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: '同意'
  },
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '动迁科长审核',
    projectId: 53,
    status: 'implementation',
    type: '4',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: '同意'
  },
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '监督评估发起申请',
    projectId: 53,
    status: 'implementation',
    type: '5',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: ''
  }
])

// const dictObj = computed(() => dictStore.getDictObj)

watch(
  () => props.row,
  (val) => {
    if (val) {
      dataInfo.value = {
        ...val
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  console.log(row, column)
  console.log(rowIndex, columnIndex)
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 1) {
    if (rowIndex === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 关闭弹窗
const onClose = () => {
  emit('close')
}
</script>

<style lang="less">
.col-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .label {
    width: 100px;
    margin-right: 10px;
  }
}

.title-1 {
  display: flex;
  margin: 10px 0 20px 0;
  font-size: 14px;
  color: #333;
  align-items: center;

  .main-title {
    margin-right: 20px;
    font-size: 16px;
    font-weight: bold;
  }

  .num {
    font-weight: bold;
  }
}

.title-2 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.progress-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 100px;
  box-sizing: border-box;

  .progress-list {
    display: flex;
    flex-direction: column;

    .progress-item {
      display: flex;

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;

          .hollow {
            width: 18px;
            height: 18px;
            border: 1px solid #3e73ec;
            border-radius: 9px;
          }

          .disabled {
            width: 18px;
            height: 18px;
            background-color: #ebebeb;
            border-radius: 9px;
          }
        }

        .line {
          width: 2px;
          height: 124px;
          background-color: #3e73ec;

          &.in-progress {
            height: 74px;
          }

          &.disabled {
            height: 74px;
            background-color: #ebebeb;
          }

          &.none {
            height: 74px;
            background-color: #fff;
          }
        }
      }

      .right {
        width: 570px;
        padding-bottom: 16px;

        .content-box {
          width: 570px;
          padding: 21px 16px;
          border: 1px solid #ebebeb;
          border-radius: 4px;
          box-sizing: border-box;

          &.finish {
            background: #fafafa;
          }

          .content-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
              font-size: 16px;
              color: #171718;
            }
          }

          .time {
            margin-top: 9px;
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }

          .remark {
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
    }
  }
}
</style>
