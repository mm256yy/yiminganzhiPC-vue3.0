<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑自然村' : '新增自然村'"
    :model-value="props.show"
    :width="660"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      label-position="left"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="村名" prop="name" required>
            <ElInput clearable :maxlength="20" v-model="form.name" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="编码" prop="code" required>
            <ElInput clearable :maxlength="20" v-model="form.code" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="行政区划" prop="parentCode" required>
            <ElTreeSelect
              class="!w-full"
              v-model="form.parentCode"
              :data="props.districtTree"
              node-key="code"
              :props="treeSelectDefaultProps"
              :default-expanded-keys="[form.parentCode]"
            />
          </ElFormItem>
        </ElCol>
        <!-- <ElCol :span="12">
          <ElFormItem label="地址" prop="address">
            <ElInput clearable type="text" class="!w-full" v-model="form.address" />
          </ElFormItem>
        </ElCol> -->
        <ElCol :span="12">
          <ElFormItem label="简介" prop="introduction">
            <ElInput type="textarea" clearable :maxlength="5000" v-model="form.introduction" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElFormItem label="具体位置">
          <Map
            :point="{
              longitude: form.longitude,
              latitude: form.latitude
            }"
            @chose="onChosePosition"
          />
          <div>{{ position.address }}</div>
        </ElFormItem>
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
  ElButton,
  ElTreeSelect,
  FormInstance,
  FormRules
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { Map } from '@/components/Map'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import type { VillageDtoType } from '@/api/project/village/types'
import type { DistrictNodeType } from '@/api/district/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: VillageDtoType | null | undefined
  districtTree: DistrictNodeType[]
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()

const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<VillageDtoType, 'id'> = {
  address: '',
  code: '',
  introduction: '',
  latitude: undefined,
  longitude: undefined,
  name: '',
  parentCode: ''
}
const form = ref<Omit<VillageDtoType, 'id'>>(defaultValue)
const position = reactive({
  latitude: '',
  longitude: '',
  address: ''
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
    } else {
      formRef.value?.resetFields()
      form.value = defaultValue
    }
    position.longitude = form.value.longitude
    position.latitude = form.value.latitude
    position.address = form.value.address
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
  parentCode: [required()]
})

// 关闭弹窗
const onClose = () => {
  emit('close')
}

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const data = {
        ...form.value,
        ...position
      }
      emit('submit', data)
    } else {
      return false
    }
  })
}, 600)

// const onGoToMap = () => {
//   // 备选 'http://jingweidu.757dy.com/'
//   window.open('https://api.map.baidu.com/lbsapi/getpoint/index.html')
// }
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
