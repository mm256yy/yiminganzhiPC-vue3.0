<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑自然村' : '新增自然村'"
    :model-value="props.show"
    :width="575"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
    destroy-on-close
  >
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="right"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <ElFormItem label="所属区域" prop="parentCode" required>
        <ElTreeSelect
          class="!w-full"
          v-model="form.parentCode"
          :data="props.districtTree"
          node-key="code"
          :props="treeSelectDefaultProps"
          :default-expanded-keys="[form.parentCode]"
        />
      </ElFormItem>
      <ElFormItem label="自然村名称" prop="name" required>
        <ElInput clearable :maxlength="20" v-model="form.name" />
      </ElFormItem>

      <MapFormItem
        v-if="!props.hideMap"
        :required="false"
        :positon="position"
        @change="onChosePosition"
      />
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
  ElTreeSelect,
  FormInstance,
  FormRules,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { MapFormItem } from '@/components/Map'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { addVillageApi, updateVillageApi } from '@/api/workshop/village/service'
import type { VillageDtoType } from '@/api/workshop/village/types'
import type { DistrictNodeType } from '@/api/district/types'

interface PropsType {
  show: boolean
  hideMap?: boolean
  actionType: 'add' | 'edit'
  row?: VillageDtoType | null | undefined
  districtTree: DistrictNodeType[]
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<VillageDtoType, 'id'> = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: ''
}
const form = ref<Omit<VillageDtoType, 'id'>>(defaultValue)
const position = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
      position.latitude = form.value.latitude
      position.longitude = form.value.longitude
      position.address = form.value.address
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
  parentCode: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    position.latitude = 0
    position.longitude = 0
    position.address = ''
  })
}

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

const submit = async (data: VillageDtoType) => {
  if (props.actionType === 'add') {
    await addVillageApi({
      ...data,
      projectId
    })
  } else {
    await updateVillageApi({
      ...data,
      projectId
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      if (!props.hideMap && (!position || !position.longitude)) {
        return ElMessage.error('请点击地图选择经纬度')
      }
      const data: any = {
        ...form.value,
        ...position
      }
      submit(data)
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
