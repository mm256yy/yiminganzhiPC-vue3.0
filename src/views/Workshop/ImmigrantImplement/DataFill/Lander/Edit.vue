<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 540px"
    :max-height="maxHeight"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :labelWidth="120" :rules="rules" :isCol="false">
      <template #card>
        <ElInput v-model="card" style="width: 100%" placeholder="请选择" @change="change" />

        <!-- {{ filterWay(row).filter((item) => item.value === row.settingWay)[0].label }} -->
      </template>
      <template #settingWay>
        <ElSelect style="width: 100%" v-model="settingWay" placeholder="请选择" @change="changes">
          <ElOption
            v-for="item in filterWayArr"
            :key="`${item.value}${row.id}`"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </ElSelect>

        <!-- {{ filterWay(row).filter((item) => item.value === row.settingWay)[0].label }} -->
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
import { ElButton, ElCascader, ElSelect, ElOption, ElFormItem, ElInput } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { validateIdNo, analyzeIDCard } from '@/utils/index'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
// import { AddProduceListApi } from '@/api/immigrantImplement/resettleConfirm/produce-service'
interface Props {
  show: boolean
  row: any
  title: any
}

const dictStore = useDictStoreWithOut()
let settingWay = ref('')
let card = ref('')
const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const dictObj = computed(() => dictStore.getDictObj)
const { required } = useValidator()
const maxHeight = ref(appStore.getIsSysAdmin ? 500 : 300)
const loading = ref(false)
const rules = {
  name: [required()],
  relation: [required()],
  card: [{ validator: validateIdNo, trigger: 'blur' }, required()],
  settingWay: [required()]

  // enabled: [{ type: 'boolean', required: true }]
}
const schema: any = ref<FormSchema[]>([
  //   { field: 'userName', label: '用户名', component: 'Input' },
  //   { field: 'nickName', label: '姓名', component: 'Input' },
  {
    field: 'name',
    label: '姓名',
    component: 'Input'
  },
  {
    field: 'relation',
    label: '与户主关系',
    component: 'Select',
    componentProps: {
      options: dictObj.value[307],
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'card',
    label: '身份证号',
    component: 'Input'
  },
  {
    field: 'phone',
    label: '联系方式',
    component: 'Input'
  },
  {
    field: 'settingWay',
    label: '生产安置方式'
  }
])

const { register, elFormRef, methods } = useForm()
let onClose = () => {
  emit('close')
}
let onSubmit = async () => {
  const formRef = unref(elFormRef)
  const user = (await methods.getFormData()) || {}
  // user.settingWay = settingWay.value
  // user.card = card.value
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      if (props.title == '添加生产安置人口') {
        emit('save', user)
      } else {
        emit('save', user, 1)
      }
    }
  })
}
/**
 * 安置方式过滤
 */
const filterWay = (data) => {
  const arr = cloneDeep(dictObj.value[375]).map((item) => {
    // 农村移民的 其他性质
    item.disabled = false
    const notFarmer = data.populationNature !== '1'
    if (notFarmer && item.value === '1') {
      item.disabled = true
    }
    if (item.value === '1' && data.isProductionLand != '1') {
      item.disabled = true
    }
    data.age = analyzeIDCard(data.card)
    console.log(data)

    if (data.age < 14 && item.value !== '3' && item.value != '1') {
      item.disabled = true
    }
    return item
  })
  return arr
}
let change = async (e) => {
  filterWayArr.value = filterWay({ card: e })
  methods.setValues({ card: card.value })
  // user.card = card.value
}
let changes = async (e) => {
  console.log(e)
  methods.setValues({ settingWay: '1' })
  // const user = (await methods.getFormData()) || {}
  // user.settingWay = settingWay.value
  methods.setValues({ settingWay: settingWay.value })
  // console.log(user)
}
let filterWayArr: any = ref([])
watch(
  () => props.show,
  (val) => {
    if (val) {
      methods.setValues(props.row)
      settingWay.value = props.row?.settingWay
      card.value = props.row?.card
      filterWayArr.value = filterWay(props.row)
    }
  }
)
</script>
