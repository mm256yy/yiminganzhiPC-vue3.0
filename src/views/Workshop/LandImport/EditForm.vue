<template>
  <Dialog
    :model-value="props.show"
    title="编辑"
    :fullscreen="false"
    style="width: 1080px"
    :max-height="maxHeight"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :labelWidth="120" :rules="rules" />
    <template #footer>
      <ElButton type="primary" :loading="loading">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElButton } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'

import { useValidator } from '@/hooks/web/useValidator'
import { UserInfoType, ProjectUserType } from '@/api/sys/types'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'

interface Props {
  show: boolean
  row?: UserInfoType
}

interface ProjectUser extends ProjectUserType {
  roleIds?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const appStore = useAppStore()

const { required } = useValidator()
const maxHeight = ref(appStore.getIsSysAdmin ? 500 : 300)
const loading = ref(false)
const rules = {
  userName: [required()],
  nickName: [required()],
  sex: [required()]
  // enabled: [{ type: 'boolean', required: true }]
}

const schema = reactive<FormSchema[]>([
  //   { field: 'userName', label: '用户名', component: 'Input' },
  //   { field: 'nickName', label: '姓名', component: 'Input' },
  {
    field: 'sheetNumber',
    label: '图幅号',
    component: 'Input'
  },
  {
    field: 'landNumber',
    label: '地块编号',
    component: 'Input'
  },
  {
    field: 'area',
    label: '所在区域',
    component: 'Input'
  },
  {
    field: 'inundationRange',
    label: '淹没范围',
    component: 'Input'
  },

  {
    field: 'landName',
    label: '地名',
    component: 'Input'
  },

  {
    field: 'totalPrice',
    label: '权属单位',
    component: 'Input'
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    component: 'Input'
  },
  {
    field: 'landNature',
    label: '土地性质',
    component: 'Input'
  },
  {
    field: 'xzdw',
    label: '现状地物',
    component: 'Input'
  },
  {
    field: 'landLevel',
    label: '地类',
    component: 'Input'
  },
  {
    field: 'shapeArea',
    label: '面积(㎡)',
    component: 'Input'
  },
  {
    field: 'shapeLeng',
    label: '周长(米)',
    component: 'Input'
  },
  {
    field: 'avgElevat',
    label: '平均高程点',
    component: 'Input'
  },
  {
    field: 'minElevat',
    label: '最低高程点',
    component: 'Input'
  },
  {
    field: 'maxElevat',
    label: '最高高程点',
    component: 'Input'
  },
  {
    field: 'avgX',
    label: '平均经度',
    component: 'Input'
  },
  {
    field: 'minX',
    label: '最低经度',
    component: 'Input'
  },
  {
    field: 'maxX',
    label: '最高经度',
    component: 'Input'
  },
  {
    field: 'avgY',
    label: '平均纬度',
    component: 'Input'
  },
  {
    field: 'minY',
    label: '最低纬度',
    component: 'Input'
  },
  {
    field: 'maxY',
    label: '最高纬度',
    component: 'Input'
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input'
  }
])

const { register, elFormRef, methods } = useForm()
</script>
