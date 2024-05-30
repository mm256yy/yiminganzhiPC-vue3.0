<template>
  <WorkContentWrap>
    <!-- 居民户信息 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="saveIcon"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <div class="formBox">
        <ElForm
          class="form"
          ref="formRef"
          :model="form"
          label-width="120px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">居民户信息补全</span>
          </div>
          <ElRow>
            <ElCol :span="12">
              <ElFormItem label="联系方式(户主)：" required>
                <ElInput v-model="position.phone" placeholder="请输入" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <!-- <MapFormItem :required="false" :positon="position" @change="onChosePosition" /> -->
              <ElFormItem label="宅基地总面积(㎡)：" label-width="150px" required>
                <ElInput v-model="position.homesteadArea" placeholder="请输入" />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="12">
              <div class="col-wrapper">
                <div class="col-label">户主照片：</div>
                <div class="card-img-list">
                  <ElUpload
                    action="/api/file/type"
                    :data="{
                      type: 'archives'
                    }"
                    :on-error="onError"
                    :list-type="'picture-card'"
                    accept=".jpg,.jpeg,.png,.pdf"
                    :multiple="true"
                    :file-list="householdPic"
                    :headers="headers"
                    :on-success="uploadFileChange1"
                    :before-remove="beforeRemove"
                    :on-remove="removeFile1"
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
            <ElCol :span="12">
              <ElFormItem label="全家福照片：" required>
                <div class="card-img-list">
                  <ElUpload
                    action="/api/file/type"
                    :data="{
                      type: 'archives'
                    }"
                    :on-error="onError"
                    :list-type="'picture-card'"
                    accept=".jpg,.jpeg,.png,.pdf"
                    :multiple="true"
                    :file-list="familyPic"
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
              </ElFormItem>
            </ElCol>
          </ElRow>

          <ElRow>
            <ElCol :span="12">
              <ElFormItem label="库区房屋照片：">
                <div class="card-img-list">
                  <ElUpload
                    action="/api/file/type"
                    :data="{
                      type: 'archives'
                    }"
                    :on-error="onError"
                    :list-type="'picture-card'"
                    accept=".jpg,.jpeg,.png,.pdf"
                    :multiple="true"
                    :file-list="housePic"
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
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="安置房照片：">
                <div class="card-img-list">
                  <ElUpload
                    action="/api/file/type"
                    :data="{
                      type: 'archives'
                    }"
                    :on-error="onError"
                    :list-type="'picture-card'"
                    accept=".jpg,.jpeg,.png,.pdf"
                    :multiple="true"
                    :file-list="resettlePic"
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
      </div>
    </div>
    <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </ElDialog>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElButton,
  ElSpace,
  ElFormItem,
  ElForm,
  ElRow,
  ElCol,
  ElUpload,
  ElDialog,
  ElInput
} from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { updateHouseholdInfo } from '@/api/immigrantImplement/householdInfo/service'
import { WorkContentWrap } from '@/components/ContentWrap'
import { MapFormItem } from '@/components/Map'

interface PropsType {
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const appStore = useAppStore()
const rules = ref()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const form = ref<any>({})
const householdPic = ref<FileItemType[]>([]) // 户主照片
const familyPic = ref<FileItemType[]>([]) // 全家福照片
const housePic = ref<FileItemType[]>([]) // 库区房屋照片
const resettlePic = ref<FileItemType[]>([]) // 安置房照片
const imgUrl = ref<string>('')
const dialogVisible = ref(false)

const emit = defineEmits(['updateData'])
const position: {
  latitude: number
  longitude: number
  address?: string
  phone?: string
  homesteadArea?: string
} = reactive({
  latitude: 0,
  longitude: 0
})
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.baseInfo,
  (val) => {
    // 处理表单数据
    form.value = {
      ...val
    }

    householdPic.value = []
    familyPic.value = []
    housePic.value = []
    resettlePic.value = []
    position.latitude = 0
    position.longitude = 0
    position.address = ''
    position.phone = ''
    try {
      if (form.value.householdPic) {
        householdPic.value = JSON.parse(form.value.householdPic)
      }

      if (form.value.familyPic) {
        familyPic.value = JSON.parse(form.value.familyPic)
      }

      if (form.value.housePic) {
        housePic.value = JSON.parse(form.value.housePic)
      }

      if (form.value.resettlePic) {
        resettlePic.value = JSON.parse(form.value.resettlePic)
      }
      position.latitude = form.value.latitude
      position.longitude = form.value.longitude
      position.phone = form.value.phone
      position.homesteadArea = form.value.homesteadArea
    } catch (error) {
      console.log(error, 'bbq')
    }
  },
  {
    immediate: true,
    deep: true
  }
)

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

  if (type === 'household') {
    householdPic.value = list
  } else if (type === 'family') {
    familyPic.value = list
  } else if (type === 'house') {
    housePic.value = list
  } else if (type === 'resettle') {
    resettlePic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'household')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'family')
}

const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'resettle')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'household')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'family')
}

const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'resettle')
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}
// 定位
const onChosePosition = (ps) => {
  console.log(ps, 'bbq')

  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}
// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}

// 保存
const onSave = () => {
  let params = {
    ...form.value,
    doorNo: props.doorNo,
    householdPic: householdPic.value ? JSON.stringify(householdPic.value) : '',
    familyPic: familyPic.value ? JSON.stringify(familyPic.value) : '',
    housePic: housePic.value ? JSON.stringify(housePic.value) : '',
    resettlePic: resettlePic.value ? JSON.stringify(resettlePic.value) : '',
    latitude: position.latitude,
    longitude: position.longitude,
    phone: position.phone,
    homesteadArea: position.homesteadArea
  }
  if (!householdPic.value.length) {
    ElMessage.error('请上传户主照片')
    return
  }
  if (!position.phone) {
    ElMessage.error('请输入联系方式')
    return
  }
  if (!position.homesteadArea) {
    ElMessage.error('请输入宅基地总面积')
    return
  }
  if (!familyPic.value.length) {
    ElMessage.error('请上传全家福照片')
    return
  }
  // if (!position.latitude || !position.longitude) {
  //   ElMessage.error('请选择地理位置')familyPic
  //   return
  // }
  updateHouseholdInfo(params).then(() => {
    ElMessage.success('操作成功！')
    emit('updateData')
  })
}
</script>
<style lang="less" scoped>
.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }

  .col-wrapper {
    display: flex;
    align-items: center;
    margin: 0 16px 16px 0;

    .col-label {
      display: inline-flex;
      width: 120px;
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
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
