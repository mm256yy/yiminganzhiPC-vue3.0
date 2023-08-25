<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-header-left">
          <div class="icon">
            <Icon icon="heroicons-outline:light-bulb" color="#fff" :size="18" />
          </div>
          <div class="desc">
            上传说明：请将上传的图片进行文字命名，图片为
            <span class="unit">jpg、png</span> 格式且图片大小需小于5M
          </div>
        </div>
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
          <ElRow>
            <ElCol :span="24">
              <div class="col-wrapper">
                <div class="col-label">上传文件：</div>
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
                    :file-list="collectiveAssetsPic"
                    :headers="headers"
                    :on-success="uploadFileChange"
                    :before-remove="beforeRemove"
                    :on-remove="removeFile"
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
        </ElForm>
      </div>
    </div>
    <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </ElDialog>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElButton,
  ElSpace,
  ElForm,
  ElRow,
  ElCol,
  ElUpload,
  ElDialog,
  UploadFile,
  UploadFiles
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import { getDocumentationApi, saveDocumentationApi } from '@/api/immigrantImplement/common-service'
import { WorkContentWrap } from '@/components/ContentWrap'

interface PropsType {
  doorNo: string // 户号
  type: string // 类型
  tabIndex: number // tab索引
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
const collectiveAssetsPic = ref<FileItemType[]>([]) // 户主照片
const imgUrl = ref<string>('')
const dialogVisible = ref(false)
const emit = defineEmits(['updateData'])

const isImageAttach = computed(() => {
  return props.type === '4' && props.tabIndex === 3
})

const isArchivesOtherPic = computed(() => {
  return props.type === '4' && props.tabIndex === 4
})

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 初始化数据
const initData = () => {
  getDocumentationApi(props.doorNo).then((res: any) => {
    if (res && res.collectiveAssetsPic) {
      collectiveAssetsPic.value = res.collectiveAssetsPic ? JSON.parse(res.collectiveAssetsPic) : []
    }
  })
}

// 处理函数
const handleFileList = (fileList: UploadFiles) => {
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

  collectiveAssetsPic.value = list
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList)
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

// 保存
const onSave = () => {
  let params = {
    ...form.value,
    doorNo: props.doorNo,
    status: 'implementation',
    collectiveAssetsPic: props.type !== '4' ? JSON.stringify(collectiveAssetsPic.value) : undefined,
    imagePic: isImageAttach.value ? JSON.stringify(collectiveAssetsPic.value) : undefined,
    archivesOtherPic: isArchivesOtherPic.value
      ? JSON.stringify(collectiveAssetsPic.value)
      : undefined
  }
  if (!collectiveAssetsPic.value.length) {
    ElMessage.error('请上传凭证')
    return
  }
  saveDocumentationApi(params).then(() => {
    ElMessage.success('操作成功！')
    emit('updateData')
  })
}

onMounted(() => {
  initData()
})
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

.desc {
  padding-left: 10px;
  font-size: 12px;
  color: #000000;

  .unit {
    color: var(--el-color-primary);
  }
}
</style>
