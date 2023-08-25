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
      <ElFormItem label="意见描述：" prop="content" required>
        <ElInput clearable type="textarea" :maxlength="20" v-model.trim="form.content" />
      </ElFormItem>
      <ElFormItem label="是否解决：" prop="status" required>
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
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  row?: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const defaultValue = {
  status: '',
  content: ''
}
const form = ref<any>(defaultValue)

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
const rules = reactive<FormRules>({
  status: [required()],
  content: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  if (props.actionType === 'add') {
    console.log(data, 'data', projectId)
  }
  ElMessage.success('操作成功！')
  onClose(true)
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
