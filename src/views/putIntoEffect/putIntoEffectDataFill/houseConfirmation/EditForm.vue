<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="600"
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
      label-width="190px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="添加原因" prop="name" v-if="actionType === 'add'">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="房屋编号" prop="name">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="层数" prop="sex">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入">
          <template #append> 层 </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="建筑面积" prop="relation">
        <!-- <ElSelect clearable filterable v-model="form.relation" class="!w-full">
          <ElOption
            v-for="item in dictObj[307]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect> -->
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入">
          <template #append>
            m<span style="position: absolute; top: -4px; right: 12px; font-size: 1px">2</span>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="房屋结构" prop="card">
        <ElSelect clearable filterable v-model="form.relation" class="!w-full">
          <ElOption
            v-for="item in dictObj[307]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="集体土地使用权证" prop="relation">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="房屋所有权证/不动产权权证" prop="marital">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="房屋性质" prop="marital">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="房屋产权人" prop="marital">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="共有人情况" prop="marital">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem>
    </ElForm>

    <template #footer v-if="actionType !== 'view'">
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
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
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
// import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addDemographicApi,
  updateDemographicApi,
  getDictByName
} from '@/api/workshop/population/service'
// import { standardFormatDate } from '@/utils/index'
// import {  } from '@/api/putIntoEffect/landlordCheck'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: DemographicDtoType | null | undefined
  doorNo: string
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
// const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<DemographicDtoType, 'id'> = {
  relation: '',
  name: '',
  card: '',
  sex: '',
  birthday: '',
  nation: '',
  populationType: '',
  censusRegister: '',
  education: '',
  marital: '',
  censusType: '',
  occupation: '',
  company: '',
  insuranceType: '',
  populationSort: ''
}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
const occupationOptions = ref<any>([]) // 职业选项
// const placeholderList = ref<string[]>([])
const cardFront = ref<FileItemType[]>([])
const cardEnd = ref<FileItemType[]>([])
const householdPic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
console.log(headers)

//处理表单不同状态下的placeholder
// watch(
//   () => props.actionType,
//   (newValue) => {
//     // if (newValue == 'view') {
//     //   placeholderList.value = ['', '', '', '', '', ' ']
//     // } else {
//     //   placeholderList.value = [
//     //     '请输入姓名',
//     //     '请输入身份证号',
//     //     '请选择日期',
//     //     '请输入工作单位',
//     //     '请输入户籍所在地',
//     //     '请选择'
//     //   ]
//     // }
//   },
//   //可选immediate: true马上执行
//   { deep: true, immediate: true }
// )

watch(
  () => props.show,
  () => {
    // if (val) {
    //   // 处理表单数据
    form.value = {
      ...props.row
    }
    // } else {
    //   form.value = { ...defaultValue }
    cardFront.value = []
    cardEnd.value = []
    householdPic.value = []
    otherPic.value = []
    // }
    try {
      if (form.value.cardPic) {
        const pics = JSON.parse(form.value.cardPic)
        cardFront.value = pics.slice(0, 1)
        cardEnd.value = pics.slice(1)
      }

      if (form.value.householdPic) {
        householdPic.value = JSON.parse(form.value.householdPic)
      }

      if (form.value.otherPic) {
        otherPic.value = JSON.parse(form.value.otherPic)
      }
    } catch (error) {
      console.log(error)
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
  name: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    cardFront.value = []
    formRef.value?.resetFields()
  })
}

const submit = async (data: DemographicDtoType) => {
  if (props.actionType === 'add') {
    await addDemographicApi({
      ...data,
      doorNo: props.doorNo
    })
  } else {
    await updateDemographicApi({
      ...data,
      doorNo: props.doorNo
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      // form.value.birthday = standardFormatDate(form.value.birthday)
      const data: any = {
        ...form.value,
        occupation: form.value.occupation ? JSON.stringify(form.value.occupation) : '',
        insuranceType: form.value.insuranceType ? form.value.insuranceType.toString() : '',
        cardPic: JSON.stringify(cardFront.value.concat(cardEnd.value)),
        householdPic: JSON.stringify(householdPic.value),
        otherPic: JSON.stringify(otherPic.value)
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)

// 获取职业列表
const getOccupationOptions = () => {
  getDictByName('职业').then((res: any) => {
    occupationOptions.value = res
  })
}

onMounted(() => {
  getOccupationOptions()
})
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
