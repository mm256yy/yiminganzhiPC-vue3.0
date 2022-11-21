<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑角色' : '新增角色'"
    :model-value="props.show"
    :width="660"
    @close="onClose"
    alignCenter
    appendToBody
  >
    <ElForm ref="formRef" label-position="left" :model="form" label-width="80px" :rules="rules">
      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="角色名称" prop="name" required>
            <ElInput :maxlength="20" :minlength="2" v-model.trim="form.name" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="角色代码" prop="code">
            <ElInput :maxlength="20" v-model.trim="form.code" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem required label="指定项目" prop="projectId">
            <ElSelect v-model="form.projectId">
              <ElOption
                v-for="item in projectStore.getProjects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="角色描述" prop="remark">
            <ElInput :maxLength="100" type="textarea" :rows="2" v-model.trim="form.remark" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label-width="100px" label="是否保留角色" prop="reserve">
            <ElRadioGroup v-model="form.reserve">
              <ElRadioButton :label="true">是</ElRadioButton>
              <ElRadioButton :label="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  FormInstance,
  FormRules
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useProjectStoreWithOut } from '@/store/modules/project'
import type { IRole } from '@/api/sys/role/types'

interface Props {
  show: boolean
  actionType: 'add' | 'edit'
  row?: IRole | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'submit'])
const projectStore = useProjectStoreWithOut()
const { required } = useValidator()
const formRef = ref<FormInstance>()

const defaultValue: Omit<IRole, 'id'> = {
  name: '',
  reserve: false,
  projectId: projectStore.getProjects[0].value,
  remark: '',
  code: ''
}
const form = ref<Omit<IRole, 'id'>>(defaultValue)

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...form.value,
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
  name: [required()],
  projectId: [required()],
  code: [
    {
      pattern: /^[0-9a-zA-Z_]+$/,
      message: '支持字母数字下划线'
    }
  ]
})

// 关闭弹窗
const onClose = () => {
  formRef.value?.resetFields()
  emit('close')
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
    } else {
      return false
    }
  })
}, 600)
</script>
