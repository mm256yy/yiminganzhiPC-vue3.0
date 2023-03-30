<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '添加' : ''"
    :model-value="props.show"
    :width="609"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="变更名称" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入报告名称" />
      </ElFormItem>

      <ElFormItem label="变更时间" prop="changeTime">
        <ElDatePicker
          class="!w-350px"
          v-model="form.changeTime"
          type="date"
          placeholder="请选择变更时间"
        />
      </ElFormItem>

      <ElFormItem label="变更类型" prop="changeType">
        <ElSelect class="w-350px" v-model="form.changeType">
          <ElOption
            v-for="item in dictObj[359]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="变更描述" prop="content">
        <ElInput type="textarea" v-model="form.content" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch, computed } from 'vue'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElDatePicker,
  ElMessage
} from 'element-plus'
import { debounce } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import { ReportUpdateType } from '@/api/workshop/report/types'
import { addReportApi, updateReportApi } from '@/api/workshop/report/service'

interface PropsType {
  show: boolean
  actionType: string
  reportType: string
  row?: ReportUpdateType | null | undefined
}

const props = defineProps<PropsType>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const defaultValue: Omit<ReportUpdateType, 'id'> = {}
const form = ref<Omit<ReportUpdateType, 'id'>>(defaultValue)
const formRef = ref<FormInstance>()
const btnLoading = ref<boolean>(false)

const emit = defineEmits(['close'])

watch(
  () => props.show,
  () => {
    // 处理表单数据
    form.value = {
      ...props.row
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  changeDate: [required()],
  changeType: [required()]
})

// 提交表单 - 表单校验
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      submit({ ...form.value })
    }
  })
})

// 表单提交
const submit = async (data: any) => {
  const { actionType, reportType } = props
  const params = {
    ...data,
    projectId: +projectId,
    type: reportType
  }
  if (actionType === 'add') {
    await addReportApi({ ...params })
  } else {
    await updateReportApi({ ...params })
  }
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}
</script>

<style lang="less" scoped>
:deep(.el-textarea) {
  width: 350px !important;
}
</style>
