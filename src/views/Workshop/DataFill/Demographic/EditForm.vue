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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="与户主关系" prop="relation">
            <ElSelect
              clearable
              filterable
              v-model="form.relation"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[307]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="姓名" prop="name">
            <ElInput v-model="form.name" :placeholder="placeholderList[0]" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="身份证号" prop="card">
            <ElInput
              clearable
              filterable
              :placeholder="placeholderList[1]"
              type="text"
              class="!w-full"
              v-model="form.card"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="性别" prop="sex">
            <ElSelect
              clearable
              filterable
              v-model="form.sex"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[292]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="出生日期" prop="birthday">
            <ElDatePicker
              v-model="form.birthday"
              type="month"
              :placeholder="placeholderList[2]"
              class="!w-full"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="民族" prop="nation">
            <ElSelect
              clearable
              filterable
              v-model="form.nation"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[278]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="人口类型" prop="populationType">
            <ElSelect
              clearable
              filterable
              v-model="form.populationType"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[244]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="户籍所在地" prop="censusRegister">
            <ElInput
              clearable
              filterable
              :placeholder="placeholderList[4]"
              type="text"
              class="!w-full"
              v-model="form.censusRegister"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="文化程度" prop="education">
            <ElSelect
              clearable
              filterable
              v-model="form.education"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[272]"
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
          <ElFormItem label="婚姻状况" prop="marital">
            <ElSelect
              clearable
              filterable
              v-model="form.marital"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[260]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="户籍册类别" prop="censusType">
            <ElSelect
              clearable
              filterable
              v-model="form.censusType"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[249]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="8">
          <ElFormItem label="职业" prop="occupation">
            <ElCascader v-model="form.occupation" :options="occupationOptions" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="工作单位" prop="company">
            <ElInput
              clearable
              filterable
              :placeholder="placeholderList[3]"
              type="text"
              class="!w-full"
              v-model="form.company"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="参保情况" prop="insuranceType">
            <ElSelect
              clearable
              filterable
              multiple
              v-model="form.insuranceType"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[306]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="人口类别" prop="populationSort">
            <ElSelect
              clearable
              filterable
              v-model="form.populationSort"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[274]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="身份证照片">
            <div class="card-img-list">
              <ElUpload
                :class="[cardFront.length > 0 || actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :disabled="actionType === 'view'"
                :limit="1"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="cardFront"
                :headers="headers"
                :on-success="uploadFileChange1"
                :before-remove="beforeRemove"
                :on-remove="removeFile1"
                :on-preview="imgPreview"
                :on-error="onError"
              >
                <template #trigger v-if="cardFront.length === 0 && actionType !== 'view'">
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/card-front.png" alt="" />
                    <div class="card-txt"> 上传正面 </div>
                  </div>
                </template>
                <template #trigge v-else></template>
              </ElUpload>
              <ElUpload
                class="ml-8px"
                :class="[cardEnd.length > 0 || actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :on-error="onError"
                :disabled="actionType === 'view'"
                :limit="1"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="cardEnd"
                :headers="headers"
                :on-success="uploadFileChange2"
                :before-remove="beforeRemove"
                :on-remove="removeFile2"
                :on-preview="imgPreview"
              >
                <template #trigger v-if="cardEnd.length === 0 && actionType !== 'view'">
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/card-back.png" alt="" />
                    <div class="card-txt"> 上传背面 </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="户口本照片">
            <div class="card-img-list">
              <ElUpload
                :on-error="onError"
                :class="[actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :limit="1"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="householdPic"
                :headers="headers"
                :on-success="uploadFileChange3"
                :before-remove="beforeRemove"
                :on-remove="removeFile3"
                :on-preview="imgPreview"
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

      <ElFormItem label="其他附件">
        <div class="card-img-list">
          <ElUpload
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            :on-error="onError"
            :class="[actionType === 'view' ? 'upload' : '']"
            :disabled="actionType === 'view'"
            :list-type="'picture-card'"
            accept=".jpg,.jpeg,.png"
            :multiple="true"
            :file-list="otherPic"
            :headers="headers"
            :on-success="uploadFileChange4"
            :before-remove="beforeRemove"
            :on-remove="removeFile4"
            :on-preview="imgPreview"
          >
            <template #trigger v-if="actionType !== 'view'">
              <div class="card-img-box">
                <div class="card-img-custom">
                  <Icon icon="ant-design:plus-outlined" :size="22" />
                </div>
                <div class="card-txt"> 点击上传 </div>
              </div>
            </template>
          </ElUpload>
        </div>
      </ElFormItem>

      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" />
      </ElFormItem>

      <ElFormItem
        v-if="actionType === 'add' && surveyStatus === SurveyStatusEnum.Review"
        label="新增原因"
        prop="addReason"
      >
        <ElInput type="textarea" v-model="form.addReason" />
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
  ElCascader,
  ElUpload,
  ElDatePicker,
  ElDivider,
  ElRow,
  ElCol,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
// import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addDemographicApi,
  updateDemographicApi,
  getDictByName
} from '@/api/workshop/population/service'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: DemographicDtoType | null | undefined
  doorNo: string
  surveyStatus: SurveyStatusEnum
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
const placeholderList = ref<string[]>([])
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

//处理表单不同状态下的placeholder
watch(
  () => props.actionType,
  (newValue) => {
    if (newValue == 'view') {
      placeholderList.value = ['', '', '', '', '', ' ']
    } else {
      placeholderList.value = [
        '请输入姓名',
        '请输入身份证号',
        '请选择日期',
        '请输入工作单位',
        '请输入户籍所在地',
        '请选择'
      ]
    }
  },
  //可选immediate: true马上执行
  { deep: true, immediate: true }
)

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

// 规则校验
const rules = reactive<FormRules>({
  addReason: [{ required: true, message: '请输入新增原因', trigger: 'blur' }]
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
    householdPic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
}
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-front')
}
const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-end')
}
const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'householdPic')
}
const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-front')
}
const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-end')
}
const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'householdPic')
}
const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
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
