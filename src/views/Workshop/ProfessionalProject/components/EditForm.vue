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
        <ElSelect class="!w-350px" v-model="form.type">
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
      <ElFormItem label="所属区域" prop="parentCode">
        <ElTreeSelect
          class="!w-350px"
          v-model="form.parentCode"
          :data="props.districtTree"
          node-key="code"
          :props="treeSelectDefaultProps"
          :default-expanded-keys="[form.parentCode]"
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
      <ElFormItem label="高程" prop="altitude">
        <ElInput v-model="form.altitude" class="!w-350px" placeholder="请输入高程" />
      </ElFormItem>
      <ElFormItem label="长度（KM）" prop="size">
        <ElInput v-model="form.size" class="!w-350px" placeholder="请输入高程" />
      </ElFormItem>
      <ElFormItem label="施工单位" prop="constructionCompany">
        <ElInput v-model="form.constructionCompany" class="!w-350px" placeholder="请输入施工单位" />
      </ElFormItem>
      <ElFormItem label="经度" prop="longitude">
        <ElInput v-model="form.longitude" class="!w-350px" placeholder="请输入经度" />
      </ElFormItem>
      <ElFormItem label="纬度" prop="latitude">
        <ElInput v-model="form.latitude" class="!w-350px" placeholder="请输入纬度" />
      </ElFormItem>
      <ElFormItem label="简介" prop="introduction">
        <!-- 简介字段需与后端重新定义 -->
        <ElInput
          v-model="form.introduction"
          class="!w-350px"
          placeholder="请输入简介"
          type="textarea"
          maxlength="255"
          show-word-limit
        />
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
  ElMessage,
  ElTreeSelect
} from 'element-plus'
import { ref, reactive, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { editProfessionalProjectApi } from '@/api/professional/service'
import type { ProfessionalProjectDtoType } from '@/api/professional/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useAppStore } from '@/store/modules/app'
import type { DistrictNodeType } from '@/api/district/types'
const appStore = useAppStore()
const projectId = appStore.currentProjectId

interface PropsType {
  show: boolean
  actionType: string
  row?: ProfessionalProjectDtoType | null | undefined
  districtTree: DistrictNodeType[]
}
const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
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
  projectSchedule: '',
  parentCode: '',
  size: ''
}
const form = ref<Omit<ProfessionalProjectDtoType, 'id'>>(defaultValue)

watch(
  () => props.show,
  (val) => {
    btnLoading.value = false
    if (val) {
      if (props.actionType === 'edit') {
        form.value = { ...props.row }
      } else {
        form.value = { ...defaultValue }
      }
    }
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  code: [required()],
  type: [required()],
  address: [required()],
  parentCode: [required()]
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
