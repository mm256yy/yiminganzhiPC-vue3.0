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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <!-- <ElFormItem label="新增原因" prop="name" v-if="actionType === 'add'">
        <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
      </ElFormItem> -->
      <ElFormItem label="安置区域" prop="relocationArea">
        <ElInput v-model="form.relocationArea" class="!w-full" placeholder="请输入安置区域" />
      </ElFormItem>
      <ElFormItem label="安置住址" prop="address">
        <ElInput v-model="form.address" class="!w-full" placeholder="请输入安置住址" />
      </ElFormItem>
      <ElFormItem label="户型/套型" prop="doorModel">
        <ElSelect clearable doorModel v-model="form.sex" class="!w-full">
          <ElOption
            v-for="item in dictObj[363]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="套装面积" prop="modelArea">
        <ElSelect clearable filterable v-model="form.modelArea" class="!w-full">
          <ElOption
            v-for="item in dictObj[318]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- <ElFormItem label="安置方式" prop="way">
        <ElSelect clearable filterable v-model="form.way" class="!w-full">
          <ElOption
            v-for="item in dictObj[307]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="建房形式" prop="type">
        <ElSelect clearable filterable v-model="form.type" class="!w-full">
          <ElOption
            v-for="item in dictObj[260]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem> -->

      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" placeholder="请输入" />
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
// import { getassetHouse, delassetHouse } from '@/api/putIntoEffect/landlordCheck'
import { addHaeeossstu, updateAssetHouse } from '@/api/putIntoEffect/landlordCheck'
// import { standardFormatDate } from '@/utils/index'
// import {  } from '@/api/putIntoEffect/populationCheck'
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
// const occupationOptions = ref<any>([]) // 职业选项
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
    await addHaeeossstu({
      ...data,
      doorNo: props.doorNo
    })
  } else {
    await updateAssetHouse({
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
  // getDictByName('职业').then((res: any) => {
  //   occupationOptions.value = res
  // })
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
