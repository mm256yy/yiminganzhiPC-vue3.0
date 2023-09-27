<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : '新增'"
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
      <ElFormItem label="专项名称" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入专项名称" />
      </ElFormItem>
      <ElFormItem label="专项编码" prop="code">
        <ElInput v-model="form.code" class="!w-350px" placeholder="请输入专项编码" />
      </ElFormItem>
      <ElFormItem label="专项类别" prop="type">
        <ElSelect class="w-350px" v-model="form.type">
          <ElOption
            v-for="item in dictObj[342]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="权属单位名称" prop="underlyingCompany">
        <ElInput
          v-model="form.underlyingCompany"
          class="!w-350px"
          placeholder="请输入权属单位名称"
        />
      </ElFormItem>
      <ElFormItem label="地址" prop="address">
        <ElInput v-model="form.address" class="!w-350px" placeholder="请输入地址" />
      </ElFormItem>
      <ElFormItem label="所在位置" prop="locationType">
        <ElSelect class="w-350px" v-model="form.locationType">
          <ElOption
            v-for="item in dictObj[326]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="责任单位" prop="responsibilityCompany">
        <ElInput
          v-model="form.responsibilityCompany"
          class="!w-350px"
          placeholder="请输入责任单位"
        />
      </ElFormItem>
      <ElFormItem label="设计单位" prop="designCompany">
        <ElInput v-model="form.designCompany" class="!w-350px" placeholder="请输入设计单位" />
      </ElFormItem>
      <ElFormItem label="监理单位" prop="supervisionCompany">
        <ElInput v-model="form.supervisionCompany" class="!w-350px" placeholder="请输入监理单位" />
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
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElMessage
} from 'element-plus'
import { ref, reactive, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { editProfessionalProjectApi } from '@/api/professional/service'
import type { ProfessionalProjectDtoType } from '@/api/professional/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const projectId = appStore.currentProjectId

interface PropsType {
  show: boolean
  actionType: string
  row?: ProfessionalProjectDtoType | null | undefined
}

const dictStore = useDictStoreWithOut()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const { required } = useValidator()
const formRef = ref<FormInstance>()

const dictObj = computed(() => dictStore.getDictObj)

const btnLoading = ref(false)
const defaultValue = {
  projectId,
  status: 'implementation',
  locationType: 'SubmergedArea',
  uid: '',
  name: '',
  code: '',
  type: '',
  underlyingCompany: '',
  address: '',
  responsibilityCompany: '',
  designCompany: '',
  supervisionCompany: '',
  projectSchedule: ''
}
const form = ref<Omit<ProfessionalProjectDtoType, 'id'>>(defaultValue)

watch(
  () => props.actionType,
  (val) => {
    btnLoading.value = false
    if (val !== 'add') {
      // 处理行政区划
      form.value = { ...props.row }
    } else {
      form.value = { ...defaultValue }
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
  code: [required()],
  type: [required()],
  address: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  formRef.value?.resetFields()
  form.value = { ...defaultValue }
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      const data: any = {
        ...form.value
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)

// 表单提交
const submit = async (data: ProfessionalProjectDtoType) => {
  const params = {
    ...data
  }
  await editProfessionalProjectApi(params)
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
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
