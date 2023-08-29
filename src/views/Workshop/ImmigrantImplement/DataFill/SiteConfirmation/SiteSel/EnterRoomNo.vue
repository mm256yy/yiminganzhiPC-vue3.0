<template>
  <ElDialog
    title="录入房号"
    :model-value="props.show"
    :width="500"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="幢号-室号：" props="roomNo">
            <ElSelect clearable filterable placeholder="请选择" v-model="form.roomNo">
              <ElOption
                v-for="item in roomNoOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
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
  ElButton,
  FormInstance,
  FormRules,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import {
  getHouseConfigApi,
  saveImmigrantChooseHouseApi
} from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { onMounted } from 'vue'

interface PropsType {
  show: boolean
  row: any
  baseInfo: any
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const form = ref<any>({})
const roomNoOptions = ref<any[]>([])

watch(
  () => props.show,
  () => {
    // 处理表单数据
    form.value = props.row
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({})

// 获取幢号-室号选项列表
const getRoomNoList = async () => {
  const { settleAddress } = props.row
  const res: any = await getHouseConfigApi(props.baseInfo.projectId, 2, settleAddress)
  roomNoOptions.value = res.content
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  saveImmigrantChooseHouseApi(data).then(() => {
    ElMessage.success('操作成功！')
  })
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      submit(form.value)
    } else {
      return false
    }
  })
}, 600)

onMounted(() => {
  getRoomNoList()
})
</script>
