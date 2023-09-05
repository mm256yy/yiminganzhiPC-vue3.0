<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">概算填报</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="search-form-wrap">
      <ElForm
        class="form"
        ref="formRef"
        :model="searchForm"
        label-width="80px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="项目名称" prop="projectName">
              <ElInput v-model="searchForm.projectName" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="项目编号" prop="projectNum">
              <ElInput v-model="searchForm.projectNum" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem>
              <ElButton type="primary" @click="search">
                <Icon icon="ep:search" class="mr-5px" /> 查询
              </ElButton>
              <ElButton @click="reset">
                <Icon icon="ep:refresh-right" class="mr-5px" /> 重置
              </ElButton>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>

    <div class="table-wrap">
      <div class="btn-wrap">
        <ElButton v-if="!showAdjustedInvestment" type="primary" @click="addInvest('1')">
          添加调估投资
        </ElButton>
        <ElButton v-if="!showAdjustingInvestment" type="primary" @click="addInvest('2')">
          添加调概投资
        </ElButton>
        <ElButton type="primary" @click="save">保存</ElButton>
      </div>

      <ElTable :data="tableData" row-key="id" style="width: 100%" class="mt-5" border>
        <ElTableColumn label="序号" width="80" align="center" type="index" header-align="center" />
        <ElTableColumn label="项目名称" align="center" prop="projectName" header-align="center" />
        <ElTableColumn label="项目编码" prop="projectNum" align="center" header-align="center" />
        <ElTableColumn
          label="概算投资"
          width="230"
          prop="estimatedInvestment"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.estimatedInvestment" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-if="showAdjustedInvestment"
          label="调估投资"
          width="230"
          prop="adjustedInvestment"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.adjustedInvestment" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-if="showAdjustingInvestment"
          label="调概投资"
          width="230"
          prop="adjustingInvestment"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.adjustingInvestment" />
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElForm,
  ElFormItem,
  FormInstance,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElInputNumber,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'

const searchForm = ref<any>({
  projectName: '',
  projectNum: ''
})

const formRef = ref<FormInstance>()
const rules = ref<any>({})
const showAdjustedInvestment = ref<boolean>(false) // 展示添加的调估投资
const showAdjustingInvestment = ref<boolean>(false) // 展示添加的调概投资

const tableData = ref<any[]>([
  {
    id: 1,
    projectName: '农村部分1',
    projectNum: '001',
    estimatedInvestment: null,
    adjustedInvestment: null,
    adjustingInvestment: null,
    children: [
      {
        id: 11,
        projectName: '土地补偿费和安置补偿费1',
        projectNum: '0001',
        estimatedInvestment: null,
        adjustedInvestment: null,
        adjustingInvestment: null,
        children: [
          {
            id: 111,
            projectName: '征收集体土地补偿费和安置补助费1',
            projectNum: '00001',
            estimatedInvestment: null,
            adjustedInvestment: null,
            adjustingInvestment: null
          }
        ]
      }
    ]
  },
  {
    id: 2,
    projectName: '农村部分2',
    projectNum: '002',
    estimatedInvestment: null,
    adjustedInvestment: null,
    adjustingInvestment: null,
    children: [
      {
        id: 21,
        projectName: '土地补偿费和安置补偿费2',
        projectNum: '0002',
        estimatedInvestment: null,
        adjustedInvestment: null,
        adjustingInvestment: null,
        children: [
          {
            id: 221,
            projectName: '征收集体土地补偿费和安置补助费2',
            projectNum: '00002',
            estimatedInvestment: null,
            adjustedInvestment: null,
            adjustingInvestment: null
          }
        ]
      }
    ]
  }
])

// 搜素
const search = () => {}

// 重置
const reset = () => {
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

/**
 * 添加调估投资/添加调概投资
 * @param type 类型 1 调估投资 2 调概投资
 */
const addInvest = (type: string) => {
  if (type === '1') {
    showAdjustedInvestment.value = true
  } else {
    showAdjustingInvestment.value = true
  }
}

// 保存
const save = () => {}
</script>

<style lang="less" scoped>
.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: right;
}
</style>
