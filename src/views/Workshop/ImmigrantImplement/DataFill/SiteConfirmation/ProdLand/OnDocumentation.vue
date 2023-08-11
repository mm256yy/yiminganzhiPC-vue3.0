<template>
  <ElDialog
    title="择地档案上传"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="110px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="区块：" prop="area">
            {{ form.area }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="摇号顺序号：" prop="houseNo">
            {{ form.area }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="择地顺序号：" prop="area">
            {{ form.area }}
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="摇号顺序凭证：">
            <div class="card-img-list">
              <ElUpload
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="false"
                :file-list="housePic"
                :headers="headers"
                :on-error="onError"
                :on-success="uploadFileChange1"
                :before-remove="beforeRemove"
                :on-remove="removeFile1"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/house.png" alt="" />
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="择地顺序凭证：">
            <div class="card-img-list">
              <ElUpload
                :on-error="onError"
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="false"
                :file-list="landPic"
                :headers="headers"
                :on-success="uploadFileChange2"
                :before-remove="beforeRemove"
                :on-remove="removeFile2"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/land.png" alt="" />
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <div class="col-wrapper">
            <div class="col-label">择地确认单：</div>
            <div class="card-img-list">
              <ElUpload
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="true"
                :file-list="homePic"
                :headers="headers"
                :on-success="uploadFileChange3"
                :before-remove="beforeRemove"
                :on-remove="removeFile3"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="card-img-box">
                    <div class="card-img-custom">
                      <Icon icon="ant-design:plus-outlined" :size="22" />
                    </div>
                    <div class="card-txt"> 点击上传 </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </div>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="其他附件：">
            <div class="card-img-list">
              <ElUpload
                action="/api/file/type"
                :data="{
                  type: 'archives'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.png,jpeg,.pdf"
                :multiple="true"
                :file-list="otherPic"
                :headers="headers"
                :on-success="uploadFileChange4"
                :before-remove="beforeRemove"
                :on-remove="removeFile4"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="card-img-box">
                    <div class="card-img-custom">
                      <Icon icon="ant-design:plus-outlined" :size="22" />
                    </div>
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
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
  ElButton,
  FormInstance,
  FormRules,
  ElUpload,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'

import { useAppStore } from '@/store/modules/app'
import { updateFwHouseApi } from '@/api/workshop/datafill/house-service'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'

interface PropsType {
  show: boolean
  doorNo: string
  dataInfo: any
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

const defaultValue: Omit<HouseDtoType, 'id'> = {
  housePic: '', // 房屋照片
  landPic: '', // 土地址
  homePic: '', // 房屋照片
  otherPic: '' // 其他附件
}
const form = ref<Omit<HouseDtoType, 'id'>>(defaultValue)
const housePic = ref<FileItemType[]>([])
const landPic = ref<FileItemType[]>([])
const homePic = ref<FileItemType[]>([])
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
      ...props.dataInfo
    }

    housePic.value = []
    landPic.value = []
    homePic.value = []
    otherPic.value = []

    try {
      if (form.value.housePic) {
        housePic.value = JSON.parse(form.value.housePic)
      }

      if (form.value.landPic) {
        landPic.value = JSON.parse(form.value.landPic)
      }

      if (form.value.homePic) {
        homePic.value = JSON.parse(form.value.homePic)
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
  addReason: [required()],
  houseNo: [required()],
  storeyNumber: [required()],
  landArea: [required()],
  constructionType: [required()],
  houseNature: [required()],
  demographicId: [required()],
  ownersSituation: [required()],
  isCompliance: [required()],
  landNo: [required()],
  propertyNo: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  const { status, projectId, id } = props.dataInfo
  await updateFwHouseApi({
    ...data,
    doorNo: props.doorNo,
    status,
    projectId,
    householdId: id
  })
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const data: any = {
        ...form.value,
        ownersSituation: form.value.ownersSituation.toString(),
        housePic: JSON.stringify(housePic.value || []),
        landPic: JSON.stringify(landPic.value || []),
        homePic: JSON.stringify(homePic.value || []),
        otherPic: JSON.stringify(otherPic.value || [])
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

  if (type === 'house') {
    housePic.value = list
  } else if (type === 'land') {
    landPic.value = list
  } else if (type === 'home') {
    homePic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}

const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
}

const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}

const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
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

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label {
    display: inline-flex;
    width: 110px;
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
  .el-upload--picture-card {
    display: none;
  }
}
</style>
