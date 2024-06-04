<template>
  <ElDialog
    title="查看详情"
    :model-value="props.show"
    :width="600"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      disabled
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="资金名称" prop="fundName">
        <ElInput v-model="form.fundName" disabled class="!w-350px" />
      </ElFormItem>

      <ElFormItem label="资金操作类型" prop="type">
        <ElSelect class="w-350px" v-model="form.type">
          <ElOption
            v-for="item in dictObj[387]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            disabled
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="资金金额" prop="amount">
        <ElSelect class="w-350px" v-model="form.amount">
          <ElInputNumber class="!w-350px" v-model="form.amount" disabled clearable />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="操作时间" prop="operationTime">
        <ElDatePicker
          clearable
          type="date"
          class="!w-350px"
          v-model="form.operationTime"
          disabled
        />
      </ElFormItem>

      <ElFormItem label="创建时间" prop="createDate">
        <ElDatePicker clearable type="date" class="!w-350px" v-model="form.createDate" disabled />
      </ElFormItem>

      <ElFormItem label="操作人" prop="operationUser">
        <ElInput class="!w-350px" v-model="form.operationUser" disabled />
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElDatePicker
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import { useDictStoreWithOut } from '@/store/modules/dict'

interface PropsType {
  show: any
  row?: LandlordDtoType | null | undefined
}
const dictStore = useDictStoreWithOut()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const formRef = ref<FormInstance>()

const dictObj = computed(() => dictStore.getDictObj)
const defaultValue: Omit<LandlordDtoType, 'id'> = {
  fundName: '',
  type: '',
  amount: 0,
  operationTime: '',
  createDate: '',
  operationUser: ''
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({})

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
}
</script>

<style lang="less">
.form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
