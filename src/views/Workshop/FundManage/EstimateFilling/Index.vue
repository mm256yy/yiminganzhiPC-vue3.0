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
            <ElFormItem label="项目名称" prop="name">
              <ElInput v-model="searchForm.name" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="项目编号" prop="code">
              <ElInput v-model="searchForm.code" class="!w-250px" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <div class="btn-wrap">
              <ElButton type="primary" @click="onSearch">
                <Icon icon="ep:search" class="mr-5px" /> 查询
              </ElButton>
              <ElButton @click="onReset">
                <Icon icon="ep:refresh-right" class="mr-5px" /> 重置
              </ElButton>
            </div>
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
        <ElButton type="primary" :loading="loading" @click="save">保存</ElButton>
      </div>

      <ElTable :data="tableData" row-key="id" style="width: 100%" class="mt-5" border>
        <ElTableColumn label="序号" width="80" align="center" type="index" header-align="center" />
        <ElTableColumn label="项目名称" align="center" prop="name" header-align="center" />
        <ElTableColumn label="项目编码" prop="code" align="center" header-align="center" />
        <ElTableColumn
          label="概算投资"
          width="230"
          prop="gsInvest"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.gsInvest" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-if="showAdjustedInvestment"
          label="调估投资"
          width="230"
          prop="guInvest"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.guInvest" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-if="showAdjustingInvestment"
          label="调概投资"
          width="230"
          prop="gaiInvest"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber class="!w-200px" v-model="row.gaiInvest" />
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
  ElTableColumn,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { updateInvestListApi } from '@/api/fundManage/estimateFilling-service'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import { onMounted } from 'vue'

const searchForm = ref<any>({
  name: '',
  code: ''
})

const formRef = ref<FormInstance>()
const rules = ref<any>({})
const tableData = ref<any[]>([]) // 列表数据
const showAdjustedInvestment = ref<boolean>(false) // 展示添加的调估投资
const showAdjustingInvestment = ref<boolean>(false) // 展示添加的调概投资
const loading = ref<boolean>(false)

// 初始化页面列表获取
const initData = () => {
  if (!searchForm.value.name) {
    delete searchForm.value.name
  }
  if (!searchForm.value.code) {
    delete searchForm.value.code
  }
  getFundSubjectListApi(searchForm.value).then((res: any) => {
    if (res) {
      tableData.value = res.content
    }
  })
}

// 搜素
const onSearch = () => {
  initData()
}

// 重置
const onReset = () => {
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
const save = async () => {
  await updateInvestListApi(tableData.value)
    .then(() => {
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
  ElMessage.success('操作成功！')
  initData()
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: right;
}
</style>
