<template>
  <ElDialog
    title="办理"
    :model-value="props.show"
    :width="700"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="130px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <ElCol :span="24">
          <div class="sub-title">基本信息</div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="姓名："> {{ form.name }} </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="与户主关系：" prop="relationText">
            {{ form.relationText }}
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="性别："> {{ form.sexText }} </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="身份证号："> {{ form.card }} </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="户籍类别：">
            {{ form.censusTypeText }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="人口性质：">
            {{ form.populationNatureText }}
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="安置方式：">
            {{ form.settingWayText }}
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <div class="sub-title">办理信息</div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required"> 完成时间： </div>
            <ElDatePicker
              v-model="form.productionCompleteTime"
              type="date"
              placeholder="请选择"
              class="!w-full"
            />
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <div class="col-wrapper">
            <div class="col-label-required">
              {{ props.voucherType === 'findSelf' ? '集中供养凭证：' : '养老保险凭证：' }}
            </div>
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
                :file-list="productionPic"
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

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="onSubmit(formRef)">确认</ElButton>
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
  ElUpload,
  FormInstance,
  FormRules,
  ElDatePicker,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { updateDemographicApi } from '@/api/workshop/population/service'

interface PropsType {
  show: boolean
  voucherType: 'findSelf' | 'insure' // 凭证类型
  row?: DemographicDtoType | null | undefined
}

interface FileItemType {
  name: string
  url: string
}
const appStore = useAppStore()

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()

const form = ref<any>()
const imgUrl = ref<string>('')
const productionPic = ref<FileItemType[]>([])
const loading = ref(false)
const dialogVisible = ref(false)

watch(
  () => props.show,
  () => {
    form.value = { ...props.row }

    if (form.value.productionPic) {
      productionPic.value = JSON.parse(form.value.productionPic)
    }
  },
  // 可选 immediate: true 马上执行
  { deep: true, immediate: true }
)

// 规则校验
const rules = reactive<FormRules>({
  productionCompleteTime: [{ required: true, message: '请选择', trigger: 'blur' }]
})

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
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

  productionPic.value = list
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

const submit = async (data: DemographicDtoType) => {
  await updateDemographicApi({
    ...data,
    productionStatus: '1'
  })
    .then(() => {
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
  ElMessage.success('操作成功！')
  onClose()
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!form.value.productionCompleteTime) {
        ElMessage.error('请选择完成时间')
        return
      } else if (!productionPic.value.length) {
        ElMessage.error('请上传凭证')
        return
      } else {
        const data: any = {
          ...form.value,
          productionPic: JSON.stringify(productionPic.value || [])
        }
        loading.value = true
        submit(data)
      }
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less">
.sub-title {
  margin-bottom: 10px;
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
    width: 130px;
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
