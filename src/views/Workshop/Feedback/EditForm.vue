<template>
  <ElDialog
    title="意见填写"
    :model-value="props.show"
    :width="575"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="right"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <ElFormItem label="意见描述：" prop="remark" required>
        <ElInput clearable type="textarea" :maxlength="20" v-model.trim="form.remark" />
      </ElFormItem>
      <ElFormItem v-if="currentUserId === props.readerId" label="是否解决：" prop="status" required>
        <el-radio-group v-model="form.status" class="ml-4">
          <el-radio label="1" size="large">已解决</el-radio>
          <el-radio label="2" size="large">未解决</el-radio>
        </el-radio-group>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElMessage,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import { ref, reactive, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { saveFeedbackMessageApi } from '@/api/workshop/feedback/service'
import { useAppStore } from '@/store/modules/app'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  feedbackId: number
  readerId: number
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const currentUserId = computed(() => {
  return appStore.getUserInfo ? appStore.getUserInfo.id : ''
})

const defaultValue = {
  status: '',
  remark: ''
}
const form = ref<any>(defaultValue)

// 规则校验
const rules = reactive<FormRules>({
  remark: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  const params = {
    ...data,
    feedbackId: props.feedbackId
  }
  saveFeedbackMessageApi(params).then((res) => {
    if (res) {
      ElMessage.success('操作成功！')
      onClose(true)
    }
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const data: any = {
        ...form.value
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less">
.policy-form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
