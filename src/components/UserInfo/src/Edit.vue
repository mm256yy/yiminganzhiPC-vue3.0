<template>
  <ElDialog
    title="修改密码"
    :model-value="props.show"
    :width="600"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="150px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="旧密码:" required prop="oldPass">
        <ElInput type="password" v-model="form.oldPass" />
      </ElFormItem>
      <ElFormItem label="新密码:" required prop="newPass">
        <ElInput type="password" v-model="form.newPass" />
      </ElFormItem>
      <ElFormItem label="确认新密码:" required prop="confirmNewPass">
        <ElInput type="password" v-model="form.confirmNewPass" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认修改</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import {
  ElDialog,
  ElButton,
  ElFormItem,
  ElInput,
  ElForm,
  ElMessage,
  FormRules,
  FormInstance
} from 'element-plus'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { modifyPasswordApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'

const { required } = useValidator()
const appStore = useAppStore()
const form = ref<any>({})
interface PropsType {
  show: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const formRef = ref<FormInstance>()
// 规则校验
const rules = reactive<FormRules>({
  oldPass: [required()],
  newPass: [required()],
  confirmNewPass: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  const result = await modifyPasswordApi(data)
  console.log('POL-User', result)

  ElMessage.success('修改成功！')
  emit('close', true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const userInfo = appStore.getUserInfo

      let params: any = {
        userName: userInfo?.userName,
        oldPass: form.value.oldPass,
        newPass: form.value.newPass
      }
      submit(params)
    }
  })
})
</script>

<style lang="less"></style>
