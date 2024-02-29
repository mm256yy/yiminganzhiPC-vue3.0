<template>
  <Dialog
    :model-value="props.show"
    title="编辑"
    :fullscreen="false"
    style="width: 1080px"
    :max-height="maxHeight"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :labelWidth="120" :rules="rules">
      <template #landLevel>
        <ElCascader v-model="landLevel" :options="landTypeOptions" />
      </template>
    </Form>
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSubmit">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, unref } from 'vue'
import { ElButton, ElCascader } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import { UserInfoType, ProjectUserType } from '@/api/sys/types'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { getDistrictTreeApi } from '@/api/district'
import { getDictByName } from '@/api/workshop/population/service'
import { postLandEstimate } from '@/api/fundManage/fundPayment-service'
interface Props {
  show: boolean
  row: any
}

const dictStore = useDictStoreWithOut()

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()
const maxHeight = ref(appStore.getIsSysAdmin ? 500 : 300)
const loading = ref(false)
const rules = {
  rightHolder: [required()],
  landNature: [required()],
  shapeArea: [required()]
  // enabled: [{ type: 'boolean', required: true }]
}
const getdistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  schema.value[5].componentProps.data = list || []
  return list || []
}
let landTypeOptions = ref()
let landLevel = ref()
const getLandTypeOptions = () => {
  getDictByName('土地类型').then((res: any) => {
    landTypeOptions.value = res
    landTypeOptions.value.forEach((item: any) => {
      item.id = item.value
      if (item.children) {
        item.children.forEach((key: any) => {
          key.id = item.value + '-' + key.value
        })
      }
    })
    console.log('土地类型', landTypeOptions.value)
  })
}
const schema: any = ref<FormSchema[]>([
  //   { field: 'userName', label: '用户名', component: 'Input' },
  //   { field: 'nickName', label: '姓名', component: 'Input' },
  {
    field: 'sheetNumber',
    label: '图幅号',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'landNumber',
    label: '地块编号',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'area',
    label: '所在区域',
    component: 'Select',
    componentProps: {
      options: dictObj.value[326]
    }
  },
  {
    field: 'inundationRange',
    label: '淹没范围',
    component: 'Select',
    componentProps: {
      options: dictObj.value[346]
    }
  },

  {
    field: 'landName',
    label: '地名',
    component: 'Input'
  },

  {
    field: 'totalPrice',
    label: '权属单位',
    component: 'TreeSelect',
    componentProps: {
      data: [],
      nodeKey: 'code',
      props: {
        value: 'code',
        label: 'name'
      },
      showCheckbox: true,
      checkStrictly: true,
      checkOnClickNode: true
    }
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    component: 'Input'
  },
  {
    field: 'landNature',
    label: '土地性质',
    component: 'Select',
    componentProps: {
      options: dictObj.value[222]
    }
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
let onClose = () => {
  emit('close')
}
let onSubmit = async () => {
  const formRef = unref(elFormRef)
  const user = (await methods.getFormData()) || {}
  user.landLevelOne = landLevel.value[0]
  user.landLevelTwo = landLevel.value[1]
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      postLandEstimate(user).then((res) => {
        console.log(res)

        onClose()
      })
    }
  })
}
watch(
  () => props.show,
  (val) => {
    if (val) {
      methods.setValues(props.row)
      landLevel.value = [props.row.landLevelOne, props.row.landLevelTwo]
      getdistrictTree()
      getLandTypeOptions()
    }
  }
)
</script>
