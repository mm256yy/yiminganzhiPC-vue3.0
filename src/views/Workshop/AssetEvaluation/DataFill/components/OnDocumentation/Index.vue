<template>
  <ElDialog
    title="档案上传"
    :model-value="props.show"
    :width="800"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="150px"
      :label-position="'right'"
      :rules="rules"
    >
      <template
        v-if="role === RoleCodeType.assessor || role === RoleCodeType.other || role === 'tester'"
      >
        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required"> 房屋评估报告： </div>
              <div class="card-img-list">
                <ElUpload
                  :list-type="'picture-card'"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  accept=".jpg,.png,jpeg,.pdf"
                  :multiple="false"
                  :file-list="houseEstimatePic"
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
            </div>
          </ElCol>
        </ElRow>

        <ElRow v-if="type === 'Enterprise' || type === 'IndividualB'">
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label"> 设施设备评估报告： </div>
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
                  :file-list="devicePic"
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
                      <div class="card-txt">点击上传</div>
                    </div>
                  </template>
                </ElUpload>
              </div>
            </div>
          </ElCol>
        </ElRow>

        <ElRow v-if="type === 'VillageInfoC'">
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required"> 农村小型专项设施评估报告： </div>
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
                  :file-list="specialPic"
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
            </div>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label"> 其他档案 </div>
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
                  :on-success="uploadFileChange5"
                  :before-remove="beforeRemove"
                  :on-remove="removeFile5"
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
            </div>
          </ElCol>
        </ElRow>
      </template>

      <template v-if="role === RoleCodeType.assessorland || role === RoleCodeType.other">
        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required"> 土地评估报告： </div>
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
                  :file-list="landEstimatePic"
                  :headers="headers"
                  :on-success="uploadFileChange2"
                  :before-remove="beforeRemove"
                  :on-remove="removeFile2"
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
            </div>
          </ElCol>
        </ElRow>
      </template>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img
        class="block w-full"
        v-if="imgUrl.indexOf('pdf') == -1"
        :src="imgUrl"
        alt="Preview Image"
      />
      <iframe id="inlineFrameExample" v-else title="Inline Frame Example" :src="imgUrl"> </iframe>
    </el-dialog>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElButton,
  FormInstance,
  FormRules,
  ElUpload,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { getDocumentationApi, saveDocumentationApi } from '@/api/AssetEvaluation/service'

interface PropsType {
  show: boolean
  doorNo: string
  type: string
}

interface FileItemType {
  name: string
  url: string
}

// 角色代码为字典值
enum RoleCodeType {
  assessor = 'assessor', // 房屋
  assessorland = 'assessorland', // 土地
  other = 'other',
  tester = 'tester'
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const currentProjectId = appStore.currentProjectId

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const houseEstimatePic = ref<FileItemType[]>([]) // 房屋评估报告文件列表
const landEstimatePic = ref<FileItemType[]>([]) // 土地评估报告列表
const devicePic = ref<FileItemType[]>([]) // 设施设备评估报告列表
const specialPic = ref<FileItemType[]>([]) // 农村小型专项设施评估报告列表
const otherPic = ref<FileItemType[]>([])
const role = ref<RoleCodeType>(RoleCodeType.assessor) // 角色代码 assessor 房屋评估的 assessorland 土地评估的
const userInfo = computed(() => appStore.getUserInfo)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

/**
 * 判断角色
 */
const getRole = () => {
  if (userInfo.value) {
    const project = userInfo.value.projectUsers.find((x: any) => x.projectId === currentProjectId)
    const role =
      project && project.roles && project.roles.length
        ? (project.roles[0].code as RoleCodeType)
        : RoleCodeType.other
    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return RoleCodeType.other
}

const initData = () => {
  getDocumentationApi(props.doorNo).then((res: any) => {
    if (res) {
      form.value = { ...res }
      if (form.value.houseEstimatePic) {
        houseEstimatePic.value = JSON.parse(form.value.houseEstimatePic)
      }

      if (form.value.landEstimatePic) {
        landEstimatePic.value = JSON.parse(form.value.landEstimatePic)
      }

      if (form.value.devicePic) {
        devicePic.value = JSON.parse(form.value.devicePic)
      }
      if (form.value.otherPic) {
        otherPic.value = JSON.parse(form.value.otherPic)
      }
      if (form.value.specialPic) {
        specialPic.value = JSON.parse(form.value.specialPic)
      }
    }
  })
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  saveDocumentationApi(data).then(() => {
    ElMessage.success('操作成功！')
  })
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  const { type } = props
  formEl?.validate((valid: any) => {
    if (valid) {
      let params: any = {
        ...form.value,
        doorNo: props.doorNo
      }
      // 房屋 或 其他
      if (role.value === RoleCodeType.assessor || role.value === RoleCodeType.other) {
        if (!houseEstimatePic.value.length) {
          ElMessage.error('请上传房屋评估报告')
          return
        } else if (type === 'VillageInfoC' && !specialPic.value.length) {
          ElMessage.error('请上传农村小型专项设施评估报告')
          return
        } else {
          params.houseEstimatePic = JSON.stringify(houseEstimatePic.value || [])
          params.devicePic = JSON.stringify(devicePic.value || [])
          params.specialPic = JSON.stringify(specialPic.value || [])
          params.otherPic = JSON.stringify(otherPic.value || [])
        }
      }
      // 土地 或者 其他
      if (role.value === RoleCodeType.assessorland || role.value === RoleCodeType.other) {
        if (!landEstimatePic.value.length) {
          ElMessage.error('请上传土地评估报告')
          return
        }
        params.landEstimatePic = JSON.stringify(landEstimatePic.value || [])
      }
      submit(params)
    } else {
      return false
    }
  })
})

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

  if (type === 'houseEstimate') {
    houseEstimatePic.value = list
  } else if (type === 'landEstimate') {
    landEstimatePic.value = list
  } else if (type === 'device') {
    devicePic.value = list
  } else if (type === 'special') {
    specialPic.value = list
  } else if (type === 'otherPic') {
    otherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseEstimate')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'landEstimate')
}

const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'device')
}

const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'special')
}
const uploadFileChange5 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'otherPic')
}
// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseEstimate')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'landEstimate')
}

const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'device')
}

const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'special')
}
const removeFile5 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'otherPic')
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
  console.log(uploadFile.url?.indexOf('pdf'))

  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}

onMounted(() => {
  role.value = getRole()
  console.log('role-T', role.value)
  initData()
})
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
    display: inline-flex;
    width: 150px;
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

  .col-label {
    display: inline-flex;
    width: 150px;
    height: 32px;
    padding: 0 12px 0 0;
    font-size: 14px;
    line-height: 32px;
    color: #606266;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;
  }
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}

#inlineFrameExample {
  width: 100%;
  height: 700px;
}
</style>
