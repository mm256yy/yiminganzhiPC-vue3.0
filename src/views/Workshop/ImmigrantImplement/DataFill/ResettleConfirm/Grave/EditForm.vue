<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="500"
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
      label-width="155px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="坟墓与登记权属人关系" prop="relation">
        <div v-if="actionType === 'edit'">
          {{ dictFmt(form.relation, 307) }}
        </div>
        <ElSelect v-else clearable filterable v-model="form.relation" class="!w-full">
          <ElOption
            v-for="item in dictObj[307]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="材料" prop="materials">
        <div v-if="actionType === 'edit'">{{ dictFmt(form.materials, 295) }}</div>
        <ElSelect
          v-else
          clearable
          filterable
          placeholder="请选择"
          v-model="form.materials"
          class="!w-full"
        >
          <ElOption
            v-for="item in dictObj[295]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="穴位" prop="graveType">
        <div v-if="actionType === 'edit'">{{ dictFmt(form.graveType, 345) }}</div>
        <ElSelect
          v-else
          clearable
          filterable
          placeholder="请选择"
          v-model="form.graveType"
          class="!w-full"
        >
          <ElOption
            v-for="item in dictObj[345]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="数量" prop="number">
        <!-- <div v-if="actionType === 'edit'">{{ form.number }}</div>
        <ElInputNumber
          v-else
          :min="1"
          placeholder="请输入数量"
          v-model="form.number"
          class="!w-full"
        /> -->
        <div>1</div>
      </ElFormItem>

      <ElFormItem required label="处理方式" prop="handleWay">
        <ElSelect clearable filterable v-model="form.handleWay" class="!w-full">
          <ElOption
            v-for="item in dictObj[238]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="form.handleWay === '2'" label="安置公墓" prop="settingGrave">
        <ElSelect clearable filterable v-model="form.settingGrave" class="!w-full">
          <ElOption
            v-for="item in dictObj[377]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem v-else-if="form.handleWay === '1'" label="详细地址" prop="settingAddress">
        <ElInput v-model="form.settingAddress" placeholder="请输入" />
      </ElFormItem>

      <ElFormItem label="备注" prop="settingRemark">
        <ElInput type="textarea" v-model="form.settingRemark" placeholder="请输入" />
      </ElFormItem>
    </ElForm>

    <template #footer v-if="actionType !== 'view'">
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
  ElInputNumber
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import type { GraveDtoType } from '@/api/workshop/datafill/grave-types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {} from '@/api/workshop/population/service'
import { addGaveArrageApi, updateGaveArrageApi } from '@/api/putIntoEffect/gaveArrange'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])

const formRef = ref<FormInstance>()
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<GraveDtoType, 'id'> = {
  relation: '',
  marital: '',
  number: 1,
  graveType: '',
  settingRemark: '',
  settingGrave: '',
  handleWay: '',
  settingAddress: ''
}
const form = ref<Omit<GraveDtoType, 'id'>>(defaultValue)

watch(
  () => props.show,
  () => {
    form.value = {
      ...props.row
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const { required } = useValidator()
// 规则校验
const rules = reactive<FormRules>({
  relation: [required()],
  handleWay: [required()],
  materials: [required()],
  graveType: [required()]
  // number: [required()]
})

const dictFmt = (value, index) => {
  if (value && dictObj.value[index] && dictObj.value[index].length > 0) {
    const item = dictObj.value[index].find((item: any) => item?.value === value)
    return item ? item.label : value
  }
  return value
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: GraveDtoType) => {
  const { id, doorNo, projectId, status } = props.baseInfo
  data.number = 1
  const params = {
    projectId,
    status,
    registrantDoorNo: doorNo,
    registrantId: id
  }
  if (props.actionType === 'add') {
    await addGaveArrageApi({
      ...data,
      ...params
    })
  } else {
    await updateGaveArrageApi({
      ...data,
      registrantDoorNo: doorNo
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const data: any = {
        ...form.value
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less" scoped>
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
