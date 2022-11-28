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
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="公开时间" prop="publicityTime" required>
            <ElDatePicker class="w-full" v-model="form.publicityTime" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="发布机构" prop="issuingAgency" required>
            <ElSelect class="w-full" v-model="form.issuingAgency">
              <ElOption
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="有效性" prop="status" required>
            <ElSelect class="w-full" v-model="form.status">
              <ElOption
                v-for="item in validOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
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
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          accept=".pdf"
        >
          <Icon :size="30" icon="ant-design:cloud-upload-outlined" />
          <div class="el-upload__text"> 拖入文件或者 <em>点击上传</em> </div>
          <template #tip>
            <div class="el-upload__tip"> 支持pdf文件 </div>
          </template>
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
  ElInputNumber
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import type { PolicyDtoType } from '@/api/project/policy/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  row?: PolicyDtoType | null
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const types = ref([
  {
    label: '测试',
    value: 1
  }
])

const validOptions = ref([
  {
    label: '有效',
    value: '1'
  },
  {
    label: '无效',
    value: '0'
  }
])

const defaultValue: Omit<PolicyDtoType, 'id' | 'projectId'> = {
  title: '',
  docNo: '',
  enclosure: '',
  sortNum: 1,
  type: '',
  publicityTime: '',
  status: '1',
  issuingAgency: '',
  keyWord: ''
}
const form = ref<Omit<PolicyDtoType, 'id' | 'projectId'>>(defaultValue)

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
  title: [required()],
  docNo: [required()],
  type: [required()],
  publicityTime: [required()],
  issuingAgency: [required()]
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
