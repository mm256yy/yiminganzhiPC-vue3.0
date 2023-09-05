<template>
  <ElDialog
    title="资金发放"
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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
      label-suffix=":"
    >
      <ElFormItem v-if="isHouseHold" label="户主" prop="household"> 张三 </ElFormItem>
      <ElFormItem v-if="isHouseHold" label="户号" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="isVillage" label="村集体" prop="household"> 张三 </ElFormItem>
      <ElFormItem v-if="isVillage" label="村集体编号" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="isOther" label="名称" prop="name"> 张三 </ElFormItem>
      <ElFormItem v-if="isOther" label="资金科目" prop="accountNumber"> aaaa </ElFormItem>

      <ElFormItem v-if="!isOther" label="所属区域" prop="area"> 所属区域文本 </ElFormItem>
      <ElFormItem label="到账金额" prop="amountReceived"> 到账金额文本 </ElFormItem>
      <ElFormItem label="金额(元)" prop="amount"> 金额文本 </ElFormItem>
      <ElFormItem label="发放金额" prop="issuedAmount" required>
        <ElInputNumber v-model="issuedAmount" placeholder="请输入" />
        <span>&nbsp;&nbsp;元</span>
      </ElFormItem>
      <ElFormItem label="发放日期" prop="issuedDate" required>
        <ElDatePicker v-model="issuedDate" type="datetime" />
      </ElFormItem>
      <ElFormItem label="发放说明" prop="issuedExplain" required>
        <ElInput v-model="issuedExplain" type="textarea" :rows="3" placeholder="请输入" />
      </ElFormItem>
      <div class="col-wrapper">
        <div class="col-label-required"> 相关凭证： </div>
        <div class="card-img-list">
          <ElUpload
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'archives'
            }"
            accept=".jpg,.png,jpeg,.pdf"
            :multiple="false"
            :file-list="relocateOtherPic"
            :headers="headers"
            :on-error="onError"
            :on-success="uploadFileChange"
            :before-remove="beforeRemove"
            :on-remove="removeFile"
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
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="onSubmit(formRef)">提交</ElButton>
      <ElButton @click="onClose">取消</ElButton>
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
  ElMessage,
  ElMessageBox,
  ElInput,
  ElInputNumber,
  ElDatePicker
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { saveDocumentationApi } from '@/api/immigrantImplement/common-service'

interface PropsType {
  show: boolean
  type: number // 类型
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const relocateOtherPic = ref<FileItemType[]>([]) // 其他附件列表

const issuedAmount = ref<number>(0) // 发放金额
const issuedExplain = ref<string>('') // 发放说明
const issuedDate = ref<string>('') // 发放日期

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({
  issuedAmount: [{ required: true, message: '发放金额不能为空', trigger: 'blur' }],
  issuedDate: [{ required: true, message: '发放日期不能为空', trigger: 'change' }],
  issuedExplain: [{ required: true, message: '发放说明不能为空', trigger: 'blur' }]
})

const initData = () => {}

const isHouseHold = computed(() => {
  return props.type === 1
})

const isVillage = computed(() => {
  return props.type === 2
})

const isOther = computed(() => {
  return props.type === 3
})

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
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!relocateOtherPic.value.length) {
        ElMessage.error('请上传相关凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          relocateOtherPic: JSON.stringify(relocateOtherPic.value || []) // 其他附件
        }
        submit(params)
      }
    } else {
      return false
    }
  })
})

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

  relocateOtherPic.value = list
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

onMounted(() => {
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
    width: 115px;
    height: 32px;
    padding: 0 12px 0 10px;
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
