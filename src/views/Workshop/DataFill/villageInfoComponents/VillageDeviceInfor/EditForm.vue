<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="1140"
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
      label-width="140px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="设施名称" prop="facilitiesName">
            <ElInput v-model="form.facilitiesName" placeholder="设施名称" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="设施类别" prop="facilitiesType">
            <ElSelect
              clearable
              filterable
              v-model="form.facilitiesType"
              class="!w-full"
              placeholder="请选择设施类别"
            >
              <ElOption
                v-for="item in dictObj[236]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="所在位置" prop="locationType">
            <ElSelect v-model="form.locationType">
              <ElOption
                v-for="item in locationTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="设施编码" prop="facilitiesCode">
            <ElInput v-model="form.facilitiesCode" placeholder="请输入设施编码" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="数量" prop="number">
            <ElInputNumber :min="0" v-model="form.number" :precision="2" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="单位" prop="unit">
            <ElSelect
              clearable
              filterable
              v-model="form.unit"
              class="!w-full"
              placeholder="请选择单位"
            >
              <ElOption
                v-for="item in dictObj[268]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <!-- <ElDivider border-style="dashed" /> -->

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="建成年月" prop="completedTime">
            <ElDatePicker
              v-model="form.completedTime"
              type="month"
              :placeholder="placeholderList[2]"
              class="!w-full"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="规模" prop="scopes">
            <ElInput
              clearable
              filterable
              placeholder="请输入规模"
              type="text"
              class="!w-full"
              v-model="form.scopes"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="效益" prop="benefit">
            <ElInput
              clearable
              filterable
              placeholder="请输入效益"
              type="text"
              class="!w-full"
              v-model="form.benefit"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="固定资产原值(万元)" prop="cost">
            <ElInputNumber :min="0" v-model="form.cost" :precision="2" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="固定资产净值(万元)" prop="netBal">
            <ElInputNumber :min="0" v-model="form.netBal" :precision="2" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="固定资产净值(万元)" prop="originalInvest">
            <ElInputNumber :min="0" v-model="form.originalInvest" :precision="2" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="职工人数" prop="workersNum">
            <ElInputNumber :min="0" v-model="form.workersNum" /> <span>人</span>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="高程" prop="altitude">
            <ElInput
              clearable
              filterable
              placeholder="请输入高程"
              type="text"
              class="!w-full"
              v-model="form.altitude"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="淹没范围" prop="inundationRang">
            <ElSelect
              clearable
              filterable
              v-model="form.inundationRang"
              class="!w-full"
              placeholder="清输入淹没范围"
            >
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="具体位置" prop="specificLocation">
            <ElInput type="textarea" v-model="form.specificLocation" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" style="width: 400px" />
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
  ElDatePicker,
  ElInputNumber,
  ElRow,
  ElCol,
  ElMessage
} from 'element-plus'
import { locationTypes } from '@/views/Workshop/components/config'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
// import type { UploadFile, UploadFiles } from 'element-plus'
// import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
// import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  saveFruitwoodListApi,
  updateApi
} from '@/api/workshop/datafill/immigrantFacilities-service'
// import { standardFormatDate } from '@/utils/index'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: any | null | undefined
  doorNo: string
  householdId
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
// const { required } = useValidator()
const formRef = ref<FormInstance>()
// const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<DemographicDtoType, 'id'> = {
  doorNo: '',
  householdId: props.householdId,
  facilitiesName: '',
  facilitiesType: '',
  locationType: '',
  facilitiesCode: '',
  number: '',
  unit: '',
  completedTime: '',
  scopes: '',
  benefit: '',
  cost: '',
  netBal: '',
  originalInvest: '',
  workersNum: '',
  altitude: '',
  inundationRang: '',
  remark: ''
}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
const placeholderList = ref<string[]>([])
const cardFront = ref<FileItemType[]>([])
const cardEnd = ref<FileItemType[]>([])
const householdPic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
// const imgUrl = ref<string>('')
// const dialogVisible = ref<boolean>(false)

// const headers = {
//   'Project-Id': appStore.getCurrentProjectId,
//   Authorization: appStore.getToken
// }

//处理表单不同状态下的placeholder
watch(
  () => props.actionType,
  (newValue) => {
    if (newValue == 'view') {
    } else {
    }
  },
  //可选immediate: true马上执行
  { deep: true, immediate: true }
)

watch(
  () => props.row,
  (val) => {
    form.value = {
      ...val
    }
    // if (val) {
    //   // 处理表单数据
    //   form.value = {
    //     ...val
    //   }
    // } else {
    //   form.value = { ...defaultValue }
    //   cardFront.value = []
    //   cardEnd.value = []
    //   householdPic.value = []
    //   otherPic.value = []
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

// 规则校验
const rules = reactive<FormRules>({})

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
    await saveFruitwoodListApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  } else {
    await updateApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      // form.value.birthday = standardFormatDate(form.value.birthday)
      const data: any = {
        ...form.value
        // cardPic: JSON.stringify(cardFront.value.concat(cardEnd.value)),
        // householdPic: JSON.stringify(householdPic.value),
        // otherPic: JSON.stringify(otherPic.value)
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)

// 处理函数
// const handleFileList = (fileList: UploadFiles, type: string) => {
//   let list: FileItemType[] = []
//   if (fileList && fileList.length) {
//     list = fileList
//       .filter((fileItem) => fileItem.status === 'success')
//       .map((fileItem) => {
//         return {
//           name: fileItem.name,
//           url: (fileItem.response as any)?.data || fileItem.url
//         }
//       })
//   }
//   if (type === 'card-front') {
//     cardFront.value = list
//   } else if (type === 'card-end') {
//     cardEnd.value = list
//   } else if (type === 'householdPic') {
//     householdPic.value = list
//   } else if (type === 'other') {
//     otherPic.value = list
//   }
// }

// // 文件上传
// const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'card-front')
// }
// const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'card-end')
// }
// const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'householdPic')
// }
// const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'other')
// }

// // 文件移除
// const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'card-front')
// }
// const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'card-end')
// }
// const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'householdPic')
// }
// const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
//   handleFileList(fileList, 'other')
// }

// // 移除之前
// const beforeRemove = (uploadFile: UploadFile) => {
//   return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
//     () => true,
//     () => false
//   )
// }
// // 预览
// const imgPreview = (uploadFile: UploadFile) => {
//   imgUrl.value = uploadFile.url!
//   dialogVisible.value = true
// }
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
