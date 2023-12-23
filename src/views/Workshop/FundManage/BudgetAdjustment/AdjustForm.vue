<template>
  <ElDialog
    title="概算科目调整"
    :model-value="props.show"
    :width="500"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="概算科目调整" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="2">概算内调为概算外</el-radio>
          <el-radio label="1">概算外调为概算内</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="调整说明" prop="gsRemark">
        <ElInput
          v-model="form.gsRemark"
          :rows="4"
          type="textarea"
          class="!w-350px"
          placeholder="请输入"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElMessage
} from 'element-plus'
import { ref, reactive, nextTick, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { updateAdjustmentApi } from '@/api/fundManage/budgetAdjustment-service'
import type { AdjustmentType } from '@/api/fundManage/budgetAdjustment-types'

interface PropsType {
  show: any
  landlordIds: number[]
  statusType: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const btnLoading = ref(false)

const defaultValue = {
  ids: props.landlordIds.toString(),
  type: '',
  gsRemark: ''
}

const form = ref<Omit<AdjustmentType, 'id'>>(defaultValue)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  doorNo: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      const data: any = {
        ...form.value,
        ids: props.landlordIds.toString()
      }

      submit(data)
    } else {
      return false
    }
  })
}, 600)

const submit = async (data: AdjustmentType) => {
  if (props.statusType != 2) {
    await updateAdjustmentApi({
      ...data,
      projectId
    })
    btnLoading.value = false
    ElMessage.success('操作成功！')
  } else {
    btnLoading.value = false
    ElMessage.error('待审核状态不能调整概算')
  }
  onClose(true)
}
watch(
  () => props.landlordIds,
  () => {
    console.log(props.landlordIds)
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
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
