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
      <ElFormItem label="旧密码:" required prop="remark">
        <ElInput type="password" v-model="form.remark" />
      </ElFormItem>
      <ElFormItem label="新密码:" required prop="remark">
        <ElInput type="password" v-model="form.remark" />
      </ElFormItem>
      <ElFormItem label="确认密码:" required prop="remark">
        <ElInput type="password" v-model="form.remark" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef, 1)">确认修改</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElDialog, ElButton, ElFormItem, ElInput, ElForm, ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
const form = ref<any>({})
interface PropsType {
  show: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  //   nextTick(() => {
  //     formRef.value?.resetFields()
  //   })
}

const submit = async (data: any) => {
  //   if (props.actionType === 'add') {
  //     data.projectId = appStore.getCurrentProjectId
  //     await addFunPayApi(data)
  //   } else {
  //     await updateFunPayApi(data)
  //   }
  ElMessage.success('修改成功！')
  emit('close', flag)
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      let params: any = {
        ...form.value
      }
      params.status = status
      submit(params)
    }
  })
})
</script>

<style lang="less"></style>
