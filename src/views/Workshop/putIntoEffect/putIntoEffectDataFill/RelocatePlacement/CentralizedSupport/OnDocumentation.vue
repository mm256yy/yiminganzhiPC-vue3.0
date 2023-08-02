<template>
  <ElDialog
    title="档案上传"
    :model-value="props.show"
    :width="1200"
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
      <div class="row-item" v-for="(item, index) in form" :key="index">
        <ElRow>
          <ElCol :span="24">
            <div class="name-box">{{ item.name }}</div>
          </ElCol>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required"> 集中供养凭证： </div>
              <div class="card-img-list">
                <ElUpload
                  action="/api/file/type"
                  :data="{
                    type: 'image'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".jpg,.jpeg,.png"
                  :multiple="true"
                  :file-list="item.chooseHousePic"
                  :headers="headers"
                  :on-success="(...event) => uploadFileChange(event, index)"
                  :before-remove="beforeRemove"
                  :on-remove="(...event) => removeFile(event, index)"
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
      </div>
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
import { useAppStore } from '@/store/modules/app'
import { saveDocumentationApi } from '@/api/putIntoEffect/putIntoEffectDataFill/SiteConfirmation/siteSel-service'
import type { SiteType } from '@/api/putIntoEffect/putIntoEffectDataFill/SiteConfirmation/siteSel-types'

interface PropsType {
  show: boolean
  doorNo: string
  baseInfo: any
  dataList: Array<SiteType>
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const form = ref<any[]>([])
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
    let arr: any = []
    props.dataList.map((item: any) => {
      arr.push({
        ...item,
        lotteryOrderPic: item.lotteryOrderPic ? JSON.parse(item.lotteryOrderPic) : [], // 摇号顺序凭证
        placeOrderPic: item.placeOrderPic ? JSON.parse(item.placeOrderPic) : [], // 择房顺序号凭证
        chooseHousePic: item.chooseHousePic ? JSON.parse(item.chooseHousePic) : [], // 择房确认单
        otherPic: item.otherPic ? JSON.parse(item.otherPic) : [] // 其他附件
      })
    })
    form.value = [...arr]
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({})

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  saveDocumentationApi(data).then(() => {
    ElMessage.success('操作成功！')
  })
  onClose()
}

// 集中供养凭证是否为空
const isNullPic = () => {
  const arr: any = form.value.map((item: any) => {
    return item.lotteryOrderPic.length > 0
  })
  const result = arr.every((item: boolean) => item)
  return result
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!isNullPic()) {
        ElMessage.error('请上传集中供养凭证')
        return
      }
      let params: any = []
      form.value.map((item: any) => {
        params.push({
          ...item,
          lotteryOrderPic: JSON.stringify(item.lotteryOrderPic || []) // 集中供养凭证
        })
      })
      submit(params)
    } else {
      return false
    }
  })
}, 600)

// 处理函数
const handleFileList = (fileList: UploadFiles, index: number) => {
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

  form.value[index].lotteryOrderPic = list
}

/**
 * 文件上传
 * @param params [_response: any, _file: UploadFile, fileList: UploadFiles]
 * @param index 数组下标
 */
const uploadFileChange = (params: any[], index: number) => {
  handleFileList(params[2], index)
}

// 文件移除
const removeFile = (params: any[], index: number) => {
  handleFileList(params[1], index)
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
.row-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #e1e4ea;

  &:last-child {
    margin-bottom: 0;
    border: none;
  }

  .name-box {
    font-size: 14px;
    font-weight: bold;
    color: #313131;
  }

  .col-wrapper {
    display: flex;
    align-items: center;
    margin: 0 16px 16px 0;

    .col-label-required {
      display: inline-flex;
      width: 160px;
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
