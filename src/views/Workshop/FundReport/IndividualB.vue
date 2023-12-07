<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">智能报表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">个体户</ElBreadcrumbItem>
    </ElBreadcrumb>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> 个体户报表 </div>
        <div></div>
      </div>
      <ElTable :data="tableData" v-loading="tableLoading" style="width: 100%">
        <ElTableColumn prop="name" label="名称" align="center" show-overflow-tooltip />
        <!--补偿费-->
        <ElTableColumn label="补偿费" header-align="center">
          <ElTableColumn header-align="center" label="房屋结构补偿费" align="center">
            <ElTableColumn prop="fwjgFee" label="应发" align="center" />
            <ElTableColumn prop="fwjgFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="房屋装修补偿费" align="center">
            <ElTableColumn prop="fwzxFee" label="应发" align="center" />
            <ElTableColumn prop="fwzxFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="附属物补偿费" align="center">
            <ElTableColumn prop="fswFee" label="应发" align="center" />
            <ElTableColumn prop="fswFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="零星果木补偿费" align="center">
            <ElTableColumn prop="lxgmFee" label="应发" align="center" />
            <ElTableColumn prop="lxgmFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="土地补偿费" align="center">
            <ElTableColumn prop="tdFee" label="应发" align="center" />
            <ElTableColumn prop="tdFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="建设用地补偿费" align="center">
            <ElTableColumn prop="jsydFee" label="应发" align="center" />
            <ElTableColumn prop="jsydFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="基础设施补偿费" align="center">
            <ElTableColumn prop="jcssFee" label="应发" align="center" />
            <ElTableColumn prop="jcssFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="设施、设备搬迁损失补偿费" align="center">
            <ElTableColumn prop="sbbqFee" label="应发" align="center" />
            <ElTableColumn prop="sbbqFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="固定设施、设备补偿费" align="center">
            <ElTableColumn prop="gdsbFee" label="应发" align="center" />
            <ElTableColumn prop="gdsbFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="其他补偿费" align="center">
            <ElTableColumn prop="qtFee" label="应发" align="center" />
            <ElTableColumn prop="qtFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="补偿费小计" align="center">
            <ElTableColumn prop="bcfSum" label="应发" align="center" />
            <ElTableColumn prop="bcfSumPay" label="已发" align="center" />
          </ElTableColumn>
        </ElTableColumn>
        <!--补助费-->
        <ElTableColumn label="补助费" header-align="center">
          <ElTableColumn header-align="center" label="搬迁补助费" align="center">
            <ElTableColumn prop="bqbzFee" label="应发" align="center" />
            <ElTableColumn prop="bqbzFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="其他补助费" align="center">
            <ElTableColumn prop="qtbzFee" label="应发" align="center" />
            <ElTableColumn prop="qtbzFeePay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="补助费小计" align="center">
            <ElTableColumn prop="bzfSum" label="应发" align="center" />
            <ElTableColumn prop="bzfSumPay" label="已发" align="center" />
          </ElTableColumn>
        </ElTableColumn>
        <!--奖励费-->
        <ElTableColumn label="奖励费" header-align="center">
          <ElTableColumn header-align="center" label="签约奖" align="center">
            <ElTableColumn prop="fyj" label="应发" align="center" />
            <ElTableColumn prop="fyjPay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="腾空奖" align="center">
            <ElTableColumn prop="tkj" label="应发" align="center" />
            <ElTableColumn prop="tkjPay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="其他奖励费" align="center">
            <ElTableColumn prop="qtj" label="应发" align="center" />
            <ElTableColumn prop="qtjPay" label="已发" align="center" />
          </ElTableColumn>
          <ElTableColumn header-align="center" label="奖励费小计" align="center">
            <ElTableColumn prop="jlfSum" label="应发" align="center" />
            <ElTableColumn prop="jlfSumPay" label="已发" align="center" />
          </ElTableColumn>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { getCardReportApi } from '@/api/fundReport/service'

const tableData = ref<any>([])
const tableLoading = ref<boolean>(false)

const requestCardReport = async () => {
  tableLoading.value = true
  try {
    // 个体户
    const type = '3'
    const result = await getCardReportApi(type)
    tableData.value = result
    tableLoading.value = false
  } catch {
    tableLoading.value = false
  }
}

onMounted(() => {
  requestCardReport()
})
</script>
