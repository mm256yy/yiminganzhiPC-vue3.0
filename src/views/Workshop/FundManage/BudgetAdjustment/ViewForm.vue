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
          <div class="label">申请类型:</div>
          <div class="content">{{ form.applyType }}</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">申请名称:</div>
          <div class="content">{{ form.applyUserName }}</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">申请人:</div>
          <div class="content">{{ form.applyUserName }}</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款说明:</div>
          <div class="content">{{ form.remark }}</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">概算科目:</div>
          <div class="content">{{ form.type }}</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">资金科目:</div>
          <div class="content">{{ form.funSubjectId }}</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款对象类型:</div>
          <div class="content">{{ form.paymentTypeTxt }}</div>
        </div>
      </ElCol>
      <ElCol :span="12">
        <div class="col-wrap">
          <div class="label">付款类型:</div>
          <div class="content">{{ form.payType }}</div>
        </div>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">申请总金额:</div>
          <div class="content">{{ form.amount }} 元</div>
        </div>
      </ElCol>
    </ElRow>

    <div class="title-1">
      <span class="main-title">专业项目合同清单:</span>
      申请总金额：{{ parmasList.amount }}<span class="num"></span> 元 申请合同数：<span
        class="num"
        >{{
          parmasList.professionalContractList ? parmasList.professionalContractList.length : 0
        }}</span
      >
      个
    </div>

    <ElTable
      :data="parmasList.professionalContractList"
      style="width: 100%"
      class="mb-20"
      :border="true"
      v-if="form.paymentType == 1"
    >
      <ElTableColumn label="序号" align="center" width="80" type="index" header-align="center" />
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
      <ElTableColumn
        label="支付节点"
        prop="paymentNode"
        align="center"
        header-align="center"
        width="200"
      >
        <template #default="{ row }">
          <div v-for="(item, index) in row.paymentNode" :key="index">{{ item }}</div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="申请金额" prop="amount" align="center" header-align="center" />
    </ElTable>

    <ElRow>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">调整事项:</div>
          <div class="content">{{ form.remark }}</div>
        </div>
      </ElCol>
      <ElCol :span="24">
        <div class="col-wrap">
          <div class="label">调整说明:</div>
          <div class="content">{{ form.type }}</div>
        </div>
      </ElCol>
    </ElRow>

    <div
      v-if="
        parmasList.funPaymentRequestFlowNodeList &&
        parmasList.funPaymentRequestFlowNodeList.length > 0
      "
    >
      <div class="title-2">审批流程</div>

      <div class="progress-wrapper">
        <div class="progress-list">
          <div
            class="progress-item"
            v-for="(item, index) in parmasList.funPaymentRequestFlowNodeList"
            :key="index"
          >
            <div class="left">
              <div class="icon-box">
                <div class="disabled"></div>
                <img
                  v-if="item.status == 1"
                  src="@/assets/imgs/icon_finish.png"
                  width="18"
                  height="18"
                />
              </div>
              <div
                class="line"
                v-if="index == parmasList.funPaymentRequestFlowNodeList.length - 1"
                style="background: white"
              ></div>
              <div class="line" v-else></div>
            </div>
            <div class="right">
              <div class="content-box">
                <div class="content-1">
                  <div class="name">{{ item.auditor }}</div>
                </div>
                <!-- <div class="time" v-if="item.isAudit === '1' && item.type == '0'"> 待审核 </div> -->
                <div class="time">
                  审核时间：{{ dayjs(item.createdDate).format('YYYY-MM-DD') }}
                </div>
                <div class="remark"> 审核意见: {{ item.status == 1 ? '通过' : '驳回' }} </div>
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

interface PropsType {
  show: any
  row?: LandlordDtoType | null | undefined
  parmasList: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const form = ref<any>({})

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = { ...(val as {}) }
      // position.longitude = form.value.longitude
      // position.latitude = form.value.latitude
      // position.address = form.value.address
    }
  },
  {
    immediate: true,
    deep: true
  }
)

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
//   } else if (columnIndex === 2) {
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
//   } else if (columnIndex === 3) {
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
//   } else if (columnIndex === 4) {
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
//   } else if (columnIndex === 5) {
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
