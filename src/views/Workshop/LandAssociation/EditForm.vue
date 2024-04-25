<template>
  <Dialog
    :model-value="props.show"
    title="关联绑定"
    :fullscreen="false"
    style="width: 780px"
    :max-height="400"
    @close="onClose"
  >
    <ElForm ref="formRef" :model="form" label-width="120px" :rules="rules">
      <ElFormItem label="土地编号:">
        {{ props.row.join(',') }}
      </ElFormItem>
      <ElFormItem label="户名:">
        <ElSelectV2
          v-model="form.peasantHouseholdIdOne"
          style="width: 390px"
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
          :options="options"
          :loading="loading"
          placeholder="请输入户名"
        />
      </ElFormItem>
      <ElFormItem>
        <ElCheckbox
          v-model="form.chek"
          label="没有查询到户名，使用以下信息新增户名，只征地不搬迁才可以新增户名"
          size="large"
        />
      </ElFormItem>
      <ElFormItem label="户主:" v-if="form.chek" prop="peasantHouseholdIdTwo">
        <ElInput
          style="width: 390px"
          v-model="form.peasantHouseholdIdTwo"
          placeholder="请输入户主"
        />
      </ElFormItem>
      <ElFormItem label="类别:" v-if="form.chek" prop="type">
        <ElSelect style="width: 390px" v-model="form.type" placeholder="请选择类别">
          <ElOption
            v-for="item in dictObj[418]"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="身份证号:" v-if="form.chek && form.type == 'PeasantHousehold'" prop="card">
        <ElInput style="width: 390px" v-model="form.card" placeholder="请输入身份证号" />
      </ElFormItem>
      <ElFormItem label="所属区域:" v-if="form.chek" prop="code">
        <ElTreeSelect
          ref="treeRef"
          v-model="form.code"
          :data="districtTree"
          placeholder="请选择所属区域"
          nodeKey="code"
          @node-click="nodeclick"
          :props="{
            value: 'code',
            label: 'name'
          }"
          style="width: 390px"
        />
      </ElFormItem>
      <ElFormItem label="联系方式:" v-if="form.chek" prop="phone">
        <ElInput style="width: 390px" v-model="form.phone" placeholder="请输入联系方式" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton type="primary" @click="onSubmit">绑定</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElSelectV2,
  ElCheckbox,
  ElInput,
  ElSelect,
  ElOption,
  ElTreeSelect
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { getGetUserMap, postRelateUser } from '@/api/fundManage/landimport'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDistrictTreeApi } from '@/api/district'
import { useValidator } from '@/hooks/web/useValidator'
import { validateIdNo, checkTel } from '@/utils/index'
interface Props {
  show: boolean
  row: any
  id: any
  data: any
}
let formRef = ref()
const props = defineProps<Props>()
const emit = defineEmits(['close', 'getField'])
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const loading = ref(false)
const maxHeight = ref(appStore.getIsSysAdmin ? 800 : 800)
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
let options: any = ref([])
let onClose = () => {
  emit('close')
}
let form: any = ref({})
let remoteMethod = async (m) => {
  console.log(m)
  if (m !== '') {
    options.value = []
    loading.value = true
    let data = await getGetUserMap({ blurry: m, projectId })
    console.log(data)
    for (let i in data) {
      options.value.push({
        label: data[i],
        value: i
      })
    }
    loading.value = false
    console.log(data)
  } else {
    options.value = []
  }
}
let districtTree = ref()
const getdistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  console.log(list)

  districtTree.value = list || []
  return list || []
}
let onSubmit = () => {
  console.log(form.value)
  if (!formRef.value) return
  formRef.value.validate((valid, fields) => {
    if (valid) {
      callback()
    } else {
      console.log('error submit!', fields)
    }
  })
}
let postRelateUsers = async (e) => {
  let data = await postRelateUser(e)
  emit('getField', data)
}
let treeRef = ref()
let callback = () => {
  if (!form.value.chek) {
    postRelateUsers({
      peasantHouseholdId: form.value.peasantHouseholdIdOne,
      ids: props.id.join(','),
      projectId
    })
  } else {
    postRelateUsers({
      rightHolder: form.value.peasantHouseholdIdTwo,
      ids: props.id.join(','),
      ...form.value,
      projectId
    })
  }
}
let nodeclick = (node, treeNode) => {
  console.log(node, treeNode)
  form.value[getParamsKey(node.districtType)] = node.code
  if (getParamsKey(node.districtType) == 'areaCode') {
    form.value.cityCode = node.parentCode
  }
}
const getParamsKey = (key: string) => {
  const map = {
    Country: 'areaCode',
    Township: 'townCode',
    Village: 'villageCode', // 行政村 code
    NaturalVillage: 'virutalVillageCode' // 自然村 code
  }
  return map[key]
}
const { required } = useValidator()
const rules = {
  peasantHouseholdIdTwo: [required()],
  type: [required()],
  code: [required()],
  card: [{ validator: validateIdNo, trigger: 'blur' }, required()],
  phone: [{ validator: checkTel, trigger: 'blur' }, required()]
}
watch(
  () => props.row,
  (val) => {
    if (val) {
      getdistrictTree()
      form.value.peasantHouseholdIdOne = ''
      form.value.peasantHouseholdIdTwo = props.data[0].rightHolder
    }
  }
)
</script>
