<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">资金池</ElBreadcrumbItem>
    </ElBreadcrumb>

    <!-- 统计信息 -->
    <div class="statistics-wrap">
      <div class="item">
        <div class="title">入账总金额(元)</div>
        <div class="content">121,000</div>
      </div>
      <div class="item center">
        <div class="item-1">
          <div class="title">出账总金额(元)</div>
          <div class="content">1,100</div>
        </div>
        <div class="item-2">
          <div>拨付总额 <span class="red">800</span> 元</div>
          <div>支付总额 <span class="red">300</span> 元</div>
        </div>
      </div>
      <div class="item">
        <div class="title">资金池余额(元)</div>
        <div class="content">2,000</div>
      </div>
    </div>

    <!-- 搜素 -->
    <div class="search-form-wrap">
      <ElForm
        class="form"
        label-width="100px"
        ref="formRef"
        :model="form"
        :label-position="'right'"
      >
        <ElFormItem label="资金操作类型" prop="type">
          <ElSelect class="w-200px" v-model="form.type">
            <ElOption
              v-for="item in dictObj[387]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="资金操作名称" prop="type">
          <ElInput class="!w-200px" v-model="form.name" placeholder="请输入" />
        </ElFormItem>
        <ElFormItem label="操作时间" prop="operationTime">
          <el-date-picker
            class="!w-200px"
            v-model="form.operationTime"
            type="date"
            placeholder="请选择"
          />
        </ElFormItem>
        <ElFormItem label="操作金额" prop="">
          <ElInput class="!w-100px" v-model="form.minAmount" type="number" placeholder="请输入" />
          &nbsp;-&nbsp;
          <ElInput class="!w-100px" v-model="form.maxAmount" type="number" placeholder="请输入" />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="search">
            <Icon icon="ep:search" class="mr-5px" /> 查询
          </ElButton>
          <ElButton @click="reset"> <Icon icon="ep:refresh-right" class="mr-5px" /> 重置 </ElButton>
        </ElFormItem>
      </ElForm>
    </div>

    <div class="table-wrap">
      <div class="row">
        <div class="col left">
          <div class="icon-box">
            <image class="icon" src="@/assets/imgs/icon_capital.png" mode="scaleToFill" />
          </div>
          <div class="data-box">
            <span class="green">10</span> 笔 <span class="green">10,000</span> 元
          </div>
        </div>
        <div class="col right">
          <ElButton type="primary" @click="onExport">
            <Icon icon="fluent:arrow-export-up-24-regular" class="mr-5px" /> 导出
          </ElButton>
        </div>
      </div>

      <ElTable />
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElInput,
  ElTable
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
// import { useIcon } from '@/hooks/web/useIcon'
import { useDictStoreWithOut } from '@/store/modules/dict'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const form = ref<any>({})

// 查询
const search = () => {}

// 重置
const reset = () => {}

// 导出
const onExport = () => {}
</script>

<style lang="less" scoped>
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}
</style>
