<template>
  <ElDialog
    title="摇号顺序号录入"
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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="摇号顺序号" prop="lotterySequence">
            <ElInput v-model="form.lotterySequence" class="!w-full" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
      </ElRow>
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
  ElRow,
  ElCol,
  ElMessage
} from 'element-plus'
import { ref, reactive, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'

interface PropsType {
  show: boolean
  dataInfo: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()

const form = ref<any>({
  lotterySequence: ''
})

const { required } = useValidator()
// 规则校验
const rules = reactive<FormRules>({
  lotterySequence: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  // const { status, projectId, id } = props.dataInfo
  // await addFwHouseApi({
  //   ...data,
  //   status,
  //   projectId,
  //   householdId: id
  // })
  console.log('data:', data)
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
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
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
