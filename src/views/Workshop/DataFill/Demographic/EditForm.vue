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
          <ElFormItem label="出生年月" prop="birthday">
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
          <ElFormItem label="户籍类别" prop="censusType">
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
            <ElSelect
              clearable
              filterable
              v-model="form.occupation"
              class="!w-full"
              :placeholder="placeholderList[5]"
            >
              <ElOption
                v-for="item in dictObj[305]"
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
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="8">
          <ElFormItem label="人口类别" prop="category">
            <ElSelect
              clearable
              filterable
              v-model="form.category"
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

      <ElRow :gutter="30">
        <ElCol :span="9">
          <ElFormItem label="身份证照片">
            <div class="flex items-center">
              <ElUpload
                :class="[cardFront.length > 0 ? 'upload' : '']"
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
              >
                <template #trigger v-if="cardFront.length === 0">
                  <div class="relative w-148px h-148px">
                    <img class="block w-148px h-148px" src="@/assets/imgs/card-front.png" alt="" />
                    <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]">
                      点击上传正面
                    </div>
                  </div>
                </template>
                <template #trigge v-else></template>
              </ElUpload>
              <ElUpload
                class="ml-8px"
                :class="[cardEnd.length > 0 ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
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
                <template #trigger>
                  <div class="relative w-148px h-148px">
                    <img class="block w-148px h-148px" src="@/assets/imgs/card-back.png" alt="" />
                    <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]">
                      点击上传反面
                    </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="15">
          <ElFormItem label="户口本照片">
            <ElUpload
              :class="[householdPic.length > 0 ? 'upload' : '']"
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :disabled="actionType === 'view'"
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
              <template #trigger>
                <div class="relative w-148px h-148px">
                  <img class="block w-148px h-148px" src="@/assets/imgs/household.png" alt="" />
                  <div class="absolute bottom-26px left-46px text-[var(--el-color-primary)]">
                    点击上传
                  </div>
                </div>
              </template>
            </ElUpload>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="其他附件">
        <ElUpload
          action="/api/file/type"
          :data="{
            type: 'image'
          }"
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
          <template #trigger>
            <div class="relative w-148px h-148px">
              <div class="flex items-center justify-center w-148px h-148px">
                <Icon icon="ant-design:plus-outlined" :size="22" />
              </div>
              <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]">
                点击上传附件
              </div>
            </div>
          </template>
        </ElUpload>
      </ElFormItem>

      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" />
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
  ElUpload,
  ElDatePicker,
  ElDivider,
  ElRow,
  ElCol,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
// import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { addDemographicApi, updateDemographicApi } from '@/api/workshop/population/service'
// import { standardFormatDate } from '@/utils/index'

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
  category: ''
}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
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
  formEl?.validate((valid) => {
    if (valid) {
      // form.value.birthday = standardFormatDate(form.value.birthday)
      const data: any = {
        ...form.value,
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
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
