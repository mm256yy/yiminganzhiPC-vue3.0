<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑政策法规' : '新增政策法规'"
    :model-value="props.show"
    :width="660"
    @close="onClose"
    alignCenter
    appendToBody
  >
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="left"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="标题" prop="title" required>
            <ElInput :maxlength="300" v-model.trim="form.title" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="文号" prop="docNo" required>
            <ElInput :maxlength="100" v-model.trim="form.docNo" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="类型" prop="type" required>
            <ElSelect class="w-full" v-model="form.type">
              <ElOption
                v-for="item in policyTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="公开时间" prop="publicityTime" required>
            <ElDatePicker class="w-full" v-model="form.publicityTime" value-format="YYYY-MM-DD" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="发布机构" prop="issuingAgency" required>
            <ElInput :maxlength="100" v-model.trim="form.issuingAgency" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="有效性" prop="status" required>
            <ElRadioGroup class="w-full" v-model="form.status">
              <ElRadioButton v-for="item in validOptions" :key="item.value" :label="item.value">{{
                item.label
              }}</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="关联项目" prop="projectId">
            <ElSelect class="w-full" v-model="form.projectId">
              <ElOption
                v-for="item in props.projects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="关键字" prop="keyWord">
            <ElInput type="textarea" class="!w-full" v-model="form.keyWord" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="排序" prop="sortNum">
            <ElInputNumber class="!w-full" v-model="form.sortNum" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="附件上传" prop="enclosure">
        <ElUpload
          class="w-full"
          drag
          action="/api/file"
          multiple
          accept=".pdf"
          :file-list="form.fileList"
          :headers="headers"
          :on-change="uploadFileChange"
          :before-remove="beforeRemove"
          :on-remove="removeFile"
        >
          <Icon :size="30" icon="ant-design:cloud-upload-outlined" />
          <div class="el-upload__text"> 拖入文件或者 <em>点击上传</em> 支持pdf文件 </div>
        </ElUpload>
      </ElFormItem>
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
  ElButton,
  ElOption,
  FormInstance,
  FormRules,
  ElSelect,
  ElDatePicker,
  ElUpload,
  ElInputNumber,
  ElMessageBox,
  ElRadioGroup,
  ElRadioButton
} from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import type { UploadFile, UploadFiles } from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { validOptions, policyTypes } from '../config'
import { useValidator } from '@/hooks/web/useValidator'
import type { PolicyDtoType } from '@/api/project/policy/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  projects: Array<{
    label: string
    value: number
  }>
  row?: PolicyDtoType | null
}
const appStore = useAppStore()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const headers = ref({
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
})

const defaultValue: Omit<PolicyDtoType, 'id'> = {
  title: '',
  docNo: '',
  enclosure: '',
  sortNum: 999,
  type: '',
  projectId: 0,
  publicityTime: '',
  status: '1',
  issuingAgency: '',
  keyWord: '',
  fileList: []
}
const form = ref<Omit<PolicyDtoType, 'id'>>(defaultValue)

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
  title: [required()],
  docNo: [required()],
  type: [required()],
  projectId: [required()],
  enclosure: [required()],
  publicityTime: [required()],
  issuingAgency: [required()]
})

// 处理函数
const handleFileList = (fileList: UploadFiles) => {
  if (fileList && fileList.length) {
    const list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url || (fileItem.response as string)
        }
      })
    form.value.enclosure = JSON.stringify(list)
  }
}
// 文件上传
const uploadFileChange = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const { fileList, ...data } = form.value
      emit('submit', data)
      nextTick(() => {
        formRef.value?.resetFields()
      })
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
