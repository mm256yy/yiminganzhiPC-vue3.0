<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑农户' : '新增农户'"
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
          <ElFormItem label="户主" prop="name" required>
            <ElInput clearable :maxlength="20" v-model="form.name" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="户号" prop="code" required>
            <ElInput clearable :maxlength="20" v-model="form.code" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem label="联系方式" prop="phone">
            <ElInput clearable type="text" class="!w-full" v-model="form.phone" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="区域类型" prop="locationType">
            <ElSelect class="w-full" v-model="form.locationType">
              <ElOption
                v-for="item in locationTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElFormItem class="w-full" label="自然村" prop="parentCode" required>
          <ElCascader
            class="!w-full"
            v-model="form.parentCode"
            :options="props.districtTree"
            :props="treeSelectDefaultProps"
            expandTrigger="hover"
          />
        </ElFormItem>
      </ElRow>
      <ElRow>
        <ElFormItem label="具体位置">
          <Map :point="position" @chose="onChosePosition" />
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
  ElCascader,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import { Map } from '@/components/Map'
import { useValidator } from '@/hooks/web/useValidator'
import type { LandlordDtoType } from '@/api/project/landlord/types'
import type { DistrictNodeType } from '@/api/district/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: LandlordDtoType | null | undefined
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

// 淹没区，建设区，影响区，重叠区
const locationTypes = [
  {
    label: '淹没区',
    value: 1
  },
  {
    label: '建设区',
    value: 2
  },
  {
    label: '影响区',
    value: 3
  },
  {
    label: '重叠区',
    value: 4
  }
]

const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  code: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 1
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)
const position: {
  latitude: number
  longitude: number
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = {
        ...val,
        parentCode: [val.areaCode, val.townCode, val.neighborhoodCommittee, val.villageId]
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
  phone: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = () => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
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
      if (!position.latitude || !position.longitude) {
        ElMessage.error('请选择位置')
        return
      }
      const data: any = {
        ...form.value,
        ...position,
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        neighborhoodCommittee: form.value.parentCode[2],
        villageId: form.value.parentCode[3]
      }
      delete data.parentCode
      emit('submit', data)
      position.latitude = 0
      position.longitude = 0
      position.address = ''
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
