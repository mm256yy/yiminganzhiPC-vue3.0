<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑居民户' : actionType === 'add' ? '新增居民户' : '查看详情'"
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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem class="w-full" label="自然村" prop="parentCode">
        <ElTreeSelect
          class="!w-full"
          v-model="form.parentCode"
          :data="props.districtTree"
          node-key="code"
          :props="treeSelectDefaultProps"
          :default-expanded-keys="[form.parentCode]"
        />
        <!-- <ElCascader
          class="!w-full"
          v-model="form.parentCode"
          :options="props.districtTree"
          :props="treeSelectDefaultProps"
          expandTrigger="hover"
        /> -->
      </ElFormItem>
      <ElFormItem label="户主姓名" prop="name">
        <ElInput v-model="form.name" placeholder="请输入户主姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="sex">
        <ElSelect clearable v-model="form.sex">
          <ElOption
            v-for="item in sexEnmus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="身份证号" prop="card">
        <ElInput
          clearable
          placeholder="请输入身份证号"
          type="text"
          class="!w-full"
          v-model="form.card"
        />
      </ElFormItem>

      <ElFormItem label="联系方式" prop="phone">
        <ElInput
          clearable
          placeholder="请输入联系方式"
          type="text"
          class="!w-full"
          v-model="form.phone"
        />
      </ElFormItem>

      <ElDivider border-style="dashed" />

      <ElFormItem label="财产户" prop="sex">
        <ElSelect clearable v-model="form.sex">
          <ElOption
            v-for="item in yesAndNoEnums"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="户籍册编号" prop="doorNo">
        <ElInput v-model="form.doorNo" placeholder="请输入户籍册编号" />
      </ElFormItem>

      <ElFormItem label="户籍所在地" prop="address">
        <ElInput v-model="form.address" placeholder="请输入户籍所在地" />
      </ElFormItem>

      <ElFormItem label="所在位置" prop="locationType">
        <ElSelect class="w-full" v-model="form.locationType">
          <ElOption
            v-for="item in locationTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />@/api/workshop/landlord/types
        </ElSelect>
      </ElFormItem>

      <MapFormItem :positon="position" @change="onChosePosition" />
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
  ElOption,
  ElSelect,
  ElMessage,
  ElTreeSelect,
  ElDivider
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { MapFormItem } from '@/components/Map'
import { useValidator } from '@/hooks/web/useValidator'
import { locationTypes, sexEnmus, yesAndNoEnums } from '../config'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import type { DistrictNodeType } from '@/api/district/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
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

const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  doorNo: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea'
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
        parentCode: [val.areaCode, val.townCode, val.villageCode, val.virutalVillageCode]
      }
    } else {
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
  doorNo: [required()],
  phone: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = () => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
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
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || ''
      }
      delete data.parentCode
      emit('submit', data)

      nextTick(() => {
        formRef.value?.resetFields()
        position.latitude = 0
        position.longitude = 0
        position.address = ''
      })
    } else {
      return false
    }
  })
}, 600)
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
