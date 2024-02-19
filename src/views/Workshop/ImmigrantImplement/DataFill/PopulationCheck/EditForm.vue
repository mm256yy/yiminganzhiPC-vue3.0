<template>
  <ElDialog
    :title="actionType === 'edit' ? '核定' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="1000"
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
      <ElRow v-if="actionType === 'add'">
        <ElCol :span="12">
          <ElFormItem label="新增原因" prop="addReason">
            <ElSelect clearable filterable v-model="form.addReason" class="!w-full">
              <ElOption
                v-for="item in dictObj[370]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="人口性质" prop="populationNature">
            <ElSelect clearable filterable v-model="form.populationNature" class="!w-full">
              <ElOption
                v-for="item in dictObj[263]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" />
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="备注" prop="checkRemark">
            <ElInput type="textarea" v-model="form.checkRemark" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" />
      </ElRow>

      <div v-if="form.addReason !== '3'">
        <!-- 分割线 -->
        <ElRow>
          <ElDivider />
        </ElRow>

        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="姓名" prop="name">
              <ElInput v-model="form.name" class="!w-full" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="性别" prop="sex">
              <ElSelect clearable filterable v-model="form.sex" class="!w-full">
                <ElOption
                  v-for="item in dictObj[292]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="身份证号" prop="card">
              <ElInput
                clearable
                filterable
                type="text"
                class="!w-full"
                v-model="form.card"
                placeholder="请输入"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="与户主关系" prop="relation">
              <ElSelect clearable filterable v-model="form.relation" class="!w-full">
                <ElOption
                  v-for="item in dictObj[307]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="婚姻状况" prop="marital">
              <ElSelect clearable filterable v-model="form.marital" class="!w-full">
                <ElOption
                  v-for="item in dictObj[260]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="户籍册类别" prop="censusType">
              <ElSelect clearable filterable v-model="form.censusType" class="!w-full">
                <ElOption
                  v-for="item in dictObj[249]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12" />
        </ElRow>

        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label">身份证照片</div>
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
                  <template #trigger v-if="actionType !== 'view'">
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
                  <template #trigger v-if="actionType !== 'view'">
                    <div class="card-img-box">
                      <img class="card-img" src="@/assets/imgs/card-back.png" alt="" />
                      <div class="card-txt"> 上传背面 </div>
                    </div>
                  </template>
                </ElUpload>
              </div>
            </div>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label">户口本照片</div>
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
            </div>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol :span="24">
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
          </ElCol>
        </ElRow>
      </div>
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
  ElMessage,
  ElMessageBox,
  ElRow,
  ElCol,
  ElDivider,
  ElUpload
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addDemographicApi,
  updateDemographicApi,
  getDictByName
} from '@/api/workshop/population/service'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: DemographicDtoType | null | undefined
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])

const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<DemographicDtoType, 'id'> = {
  addReason: '', // 新增原因
  name: '', // 姓名
  sex: '', // 性别
  card: '', // 身份证号
  relation: '', // 与户主关系
  marital: '', // 婚姻状况
  censusType: '', // 户籍册类别
  populationNature: '', // 人口性质
  checkRemark: '' // 备注
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

watch(
  () => props.show,
  () => {
    // 处理表单数据
    form.value = {
      ...props.row
    }
    cardFront.value = []
    cardEnd.value = []
    householdPic.value = []
    otherPic.value = []
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
const checkIdNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('身份证不能为空'))
  }
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
  console.log(rule)
}
// 规则校验
const rules = reactive<FormRules>({
  addReason: props.actionType === 'add' ? [required()] : [],
  name: [required()],
  sex: [required()],
  card: [
    {
      required: true,
      message: '身份证号码不能为空',
      trigger: 'blur'
    },
    {
      validator: checkIdNum,
      trigger: 'blur'
    }
  ],
  relation: [required()],
  marital: [required()],
  censusType: [required()],
  populationNature: [required()]
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
  const { id, projectId, status } = props.baseInfo
  const baseInfo = {
    householdId: id,
    projectId,
    status
  }
  if (props.actionType === 'add') {
    await addDemographicApi({
      ...data,
      doorNo: props.doorNo,
      ...baseInfo
    })
  } else {
    await updateDemographicApi({
      ...data,
      doorNo: props.doorNo,
      ...baseInfo
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (form.value.addReason !== '3') {
        if (!cardFront.value || !cardFront.value.length) {
          ElMessage.warning('请上传身份证正面照片')
          return
        } else if (!cardEnd.value || !cardEnd.value.length) {
          ElMessage.warning('请上传身份证背面照片')
          return
        } else if (!householdPic.value || !householdPic.value.length) {
          ElMessage.warning('请上传户口本照片')
          return
        }
      }

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

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label {
    display: inline-flex;
    width: 100px;
    height: 32px;
    padding: 0 12px 0 0;
    font-size: 14px;
    line-height: 32px;
    color: #606266;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;

    &::before {
      margin-right: 4px;
      color: #f56c6c;
      content: '*';
    }
  }
}

.upload {
  :deep(.el-upload) {
    display: none;
  }
}
</style>
