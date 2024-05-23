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
          <ElFormItem label="设施（设备）名称" prop="facilitiesName">
            <ElInput v-model="form.facilitiesName" placeholder="设施（设备）名称" class="!w-full" />
            <!-- <ElSelect
              clearable
              filterable
              v-model="form.facilitiesName"
              class="!w-full"
              placeholder="请选择设施类别"
            >
              <ElOption
                v-for="item in dictObj[235]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> -->
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="设施（设备）类别" prop="facilitiesType">
            <ElSelect
              clearable
              filterable
              v-model="form.facilitiesType"
              class="!w-full"
              placeholder="请选择设施（设备）类别"
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
          <ElFormItem label="主管单位" prop="competentUnit">
            <ElInput v-model="form.competentUnit" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8" v-if="actionType != 'add'">
          <ElFormItem label="设施（设备）编码" prop="facilitiesCode">
            <ElInput
              v-model="form.facilitiesCode"
              placeholder="请输入设施编码"
              class="!w-full"
              disabled
            />
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
          <ElFormItem label="所在位置" prop="locationType">
            <ElSelect v-model="form.locationType" @change="(val) => onChangeLocationType(val)">
              <ElOption
                v-for="item in dictObj[326]"
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
          <ElFormItem label="职工人数" prop="workersNum">
            <ElInputNumber :min="0" v-model="form.workersNum" /> <span>人</span>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="高程" prop="altitude">
            <ElInputNumber :min="0" v-model="form.altitude" :precision="2" />
            <!-- <
              clearable
              filterable
              placeholder="请输入高程"
              type="text"
              class="!w-full"
              v-model="form.altitude"
            /> -->
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
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="设施（设备）照片" required>
            <div class="card-img-list">
              <ElUpload
                :on-error="onError"
                :class="[actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="facilitiesPic"
                :headers="headers"
                :on-success="uploadFileChange3"
                :before-remove="beforeRemove"
                :on-remove="removeFile3"
                :on-preview="imgPreview"
                :on-change="onchange"
              >
                <template #trigger v-if="actionType !== 'view'">
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/household.png" alt="" />
                    <div class="card-txt"> 点击上传 </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
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
  ElMessage,
  ElUpload,
  ElMessageBox
} from 'element-plus'
// import { locationTypes } from '@/views/Workshop/components/config'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addFacilitiesListApi,
  updateFacilitiesApi
} from '@/api/workshop/datafill/immigrantFacilities-service'
import { setlocationType } from '@/utils/index'

// import { standardFormatDate } from '@/utils/index'
const { required } = useValidator()
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
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)
const facilitiesPic = ref<FileItemType[]>([])

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
  competentUnit: '',
  workersNum: '',
  altitude: '',
  inundationRang: '',
  remark: '',
  specificLocation: ''
}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
const placeholderList = ref<string[]>([])
const cardFront = ref<FileItemType[]>([])
const cardEnd = ref<FileItemType[]>([])
const householdPic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
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
      if (form.value.facilitiesPic) {
        facilitiesPic.value = JSON.parse(form.value.facilitiesPic)
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
const rules = reactive<FormRules>({
  facilitiesName: [required()],
  facilitiesType: [required()],
  // facilitiesCode: [required()],
  number: [required()],
  unit: [required()],
  locationType: [required()],
  inundationRang: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    cardFront.value = []
    formRef.value?.resetFields()
    facilitiesPic.value = []
  })
}

const submit = async (data: DemographicDtoType) => {
  if (props.actionType === 'add') {
    await addFacilitiesListApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  } else {
    await updateFacilitiesApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}
const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'householdPic')
}
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}
// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 处理函数
const handleFileList = (fileList: UploadFiles, type: string) => {
  let list: FileItemType[] = []
  if (fileList && fileList.length) {
    list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: (fileItem.response as any)?.data || fileItem.url
        }
      })
  }
  if (type === 'card-front') {
    cardFront.value = list
  } else if (type === 'card-end') {
    cardEnd.value = list
  } else if (type === 'householdPic') {
    facilitiesPic.value = list
  } else if (type === 'other') {
    facilitiesPic.value = list
  }
}
let onchange = (file, fileList) => {
  let fileName = file.name
  let uid = file.uid
  let pos = fileName.lastIndexOf('.')
  let lastName = fileName.substring(pos, fileName.length)
  if (
    lastName.toLowerCase() !== '.jpg' &&
    lastName.toLowerCase() !== '.jpeg' &&
    lastName.toLowerCase() !== '.png'
  ) {
    ElMessage.error('文件必须为.jpg,.jpeg,.png类型')
    // this.resetCompressData()
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].uid == uid) {
        fileList.splice(i, 1)
      }
    }
    return
  }
}
// 提交表单
const onSubmit = debounce((formEl) => {
  console.log(facilitiesPic.value.length, '上传的照片123')
  if (!facilitiesPic.value.length) {
    ElMessage.error('请上传设施（设备）照片')
    return
  }
  formEl?.validate((valid) => {
    if (valid) {
      // form.value.birthday = standardFormatDate(form.value.birthday)
      const data: any = {
        ...form.value,
        // cardPic: JSON.stringify(cardFront.value.concat(cardEnd.value)),
        // householdPic: JSON.stringify(householdPic.value),
        // otherPic: JSON.stringify(otherPic.value)
        facilitiesPic: JSON.stringify(facilitiesPic.value || [])
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
let onChangeLocationType = (e) => {
  form.value.inundationRang = setlocationType(e)
}
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
