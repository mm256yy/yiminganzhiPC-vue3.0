<template>
  <ElDialog
    title="资金支付"
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
      <ElFormItem label="申请类型:" required prop="applyType">
        <ElRadioGroup class="ml-4" v-model="form.applyType">
          <ElRadio v-for="item in dictObj[381]" :label="item.value" :key="item.value">{{
            item.label
          }}</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="申请名称:" required prop="name">
        <ElInput type="text" v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="概算科目:" required prop="type">
        <ElRadioGroup class="ml-4" v-model="form.type">
          <ElRadio v-for="item in dictObj[382]" :label="item.value" :key="item.value">{{
            item.label
          }}</ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <ElFormItem label="资金科目:" required prop="funSubjectId">
        <ElTreeSelect
          class="!w-full"
          v-model="form.funSubjectId"
          :data="subjectArray"
          :props="{ value: 'code', label: 'name' }"
          node-key="code"
          showCheckbox
          checkStrictly
          checkOnClickNode
          :default-checked-keys="[form.funSubjectId]"
        />
      </ElFormItem>

      <ElFormItem label="付款说明:" required prop="remark">
        <ElInput type="text" v-model="form.remark" />
      </ElFormItem>

      <ElFormItem label="收款单位:" required prop="receivePaymentUnit">
        <ElInput type="text" v-model="form.receivePaymentUnit" />
      </ElFormItem>
      <ElFormItem label="付款时间:" required prop="paymentTime">
        <ElDatePicker type="date" v-model="form.paymentTime" />
      </ElFormItem>
      <ElFormItem label="申请金额:" prop="amount">
        <ElInputNumber type="text" v-model="form.amount" />
      </ElFormItem>
      <div class="col-wrapper">
        <div class="col-label-required"> 申请凭证： </div>
        <div class="card-img-list">
          <ElUpload
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            accept=".jpg,.png,jpeg,.pdf"
            :multiple="false"
            :file-list="receipt"
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
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <template v-if="actionType === 'add'">
        <ElButton type="primary" @click="onSubmit(formRef, 0)">保存草稿</ElButton>
        <ElButton type="primary" @click="onSubmit(formRef, 1)">确认提交</ElButton>
      </template>
      <template v-else>
        <ElButton type="primary" @click="onSubmit(formRef)">确认提交</ElButton>
      </template>
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
  ElDatePicker,
  ElRadioGroup,
  ElRadio,
  ElTreeSelect,
  ElInputNumber
} from 'element-plus'
import { ref, reactive, nextTick, watch, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { addFunPayApi, updateFunPayApi } from '@/api/fundManage/fundPayment-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import dayjs from 'dayjs'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: any
  fundAccountList: any[]
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
// const fundAccountList = ref<any[]>([]) // 资金科目
console.log(dictObj.value[382], '382')
const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const receipt = ref<FileItemType[]>([]) // 凭证

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

watch(
  () => props.row,
  (val) => {
    if (val) {
      console.log(val, '当前对象')
      // 编辑
      form.value = {
        ...val
      }
      if (val.receipt) {
        receipt.value = JSON.parse(val.receipt)
      }
      if (form.value.paymentTime) {
        form.value.paymentTime = dayjs(form.value.paymentTime).format('YYYY-MM-DD')
      }
    } else {
      // 新增
      form.value = {}
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    receipt.value = []
  })
}

const submit = async (data: any) => {
  if (props.actionType === 'add') {
    data.projectId = appStore.getCurrentProjectId
    await addFunPayApi(data)
  } else {
    await updateFunPayApi(data)
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  if (status === 0) {
    let params: any = {
      ...form.value,
      receipt: JSON.stringify(receipt.value || []) // 搬迁安置确认单
    }
    params.paymentTime = dayjs(params.paymentTime)
    params.status = status
    submit(params)
    return
  }
  formEl?.validate((valid: any) => {
    if (valid) {
      console.log(form.value, 'form')
      if (!receipt.value.length) {
        ElMessage.error('请上传凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          receipt: JSON.stringify(receipt.value || []) // 搬迁安置确认单
        }
        params.paymentTime = dayjs(params.paymentTime)
        params.status = status
        submit(params)
      }
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

  if (type === 'receipt') {
    receipt.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'receipt')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'receipt')
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

// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      // fundAccountList.value = res.content
    }
  })
}

onMounted(() => {
  getFundSubjectList()
})

const subjectArray = computed(() => {
  if (props.fundAccountList && props.fundAccountList.length) {
    if (form.value.type === '1') {
      // 概算内
      return props.fundAccountList.filter((item) => item.type === '1')
    }

    return props.fundAccountList
  }
  return []
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
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
