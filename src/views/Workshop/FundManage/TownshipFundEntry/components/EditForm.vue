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
      <ElFormItem v-if="isHouseHold" label="户主" prop="household"> {{ form.name }} </ElFormItem>
      <ElFormItem v-if="isHouseHold" label="户号" prop="doorNo">
        {{ form.doorNo }}
      </ElFormItem>

      <ElFormItem v-if="isVillage" label="村集体" prop="villageText">
        {{ form.villageText }}
      </ElFormItem>
      <ElFormItem v-if="isVillage" label="村集体编号" prop="villageCode">
        {{ form.villageCode }}
      </ElFormItem>

      <ElFormItem v-if="isOther" label="名称" prop="name"> {{ form.name }} </ElFormItem>
      <ElFormItem v-if="isOther" label="资金科目" prop="funSubjectName">
        {{ form.funSubjectName }}
      </ElFormItem>

      <ElFormItem v-if="!isOther" label="所属区域" prop="area">
        {{
          `
              ${form.cityCodeText ? form.cityCodeText + '/' : ''}
              ${form.areaCodeText ? form.areaCodeText : ''}
              ${form.townCodeText ? '/' + form.townCodeText : ''}
              ${form.villageText ? '/' + form.villageText : ''}
              ${form.virutalVillageText ? '/' + form.virutalVillageText : ''}
              `
        }}
      </ElFormItem>
      <!-- <ElFormItem label="到账金额"> {{ allamount }}&nbsp;元 </ElFormItem> -->
      <ElFormItem label="到账金额" prop="amount"> {{ form.amount }}&nbsp;元 </ElFormItem>
      <ElFormItem label="已发放金额" prop="issuedAmount">
        {{ form.issuedAmount }}&nbsp;元</ElFormItem
      >
      <ElFormItem label="待发放" prop="pendingAmount">
        {{ form.pendingAmount }}&nbsp;元
      </ElFormItem>
      <ElFormItem label="发放金额" required>
        <ElInputNumber v-model="allamount" :min="0" placeholder="请输入" />
        <span>&nbsp;&nbsp;元</span>
      </ElFormItem>
      <ElFormItem label="发放日期" prop="paymentTime" required>
        <ElDatePicker v-model="form.paymentTime" type="datetime" />
      </ElFormItem>
      <ElFormItem label="发放说明" prop="remark" required>
        <ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" />
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
import { ref, reactive, nextTick, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import type { TownshipFundEntryDtoType } from '@/api/fundManage/townshipFundEntry-types'
import { addFundEntryApi } from '@/api/fundManage/townshipFundEntry-service'

interface PropsType {
  show: boolean
  row?: TownshipFundEntryDtoType | null | undefined
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
const allamount = ref<any>()
console.log(form.value, '111')
// allamount.value = JSON.parse(JSON.stringify(form.value.amount))
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({
  amount: [{ required: true, message: '发放金额不能为空', trigger: 'blur' }],
  paymentTime: [{ required: true, message: '发放日期不能为空', trigger: 'change' }],
  remark: [{ required: true, message: '发放说明不能为空', trigger: 'blur' }]
})

const isHouseHold = computed(() => {
  return props.type === 1
})

const isVillage = computed(() => {
  return props.type === 2
})

const isOther = computed(() => {
  return props.type === 3
})

const getTabType = (type: number) => {
  const map = {
    1: 'PeasantHousehold',
    2: 'Village',
    3: 'other'
  }
  return map[type]
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      form.value = {
        ...props.row
        // amount: null
      }
    }
  }
)

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  form.value = {}
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  addFundEntryApi(data).then(() => {
    ElMessage.success('操作成功！')
    onClose(true)
  })
}
//刷新清空
const refresh = () => {
  relocateOtherPic.value = []
  form.value = {}
  allamount.value = null
}
defineExpose({ refresh })

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!relocateOtherPic.value.length) {
        ElMessage.error('请上传相关凭证')
        return
      } else if (allamount.value > form.value.pendingAmount) {
        ElMessage.error('请勿超额发放')
        return
      } else {
        form.value.amount = allamount.value
        if (getTabType(props.type) == 'other') {
          let params: any = {
            id: form.value.id,
            paymentTime: form.value.paymentTime,
            remark: form.value.remark,
            projectId: form.value.projectId,
            receipt: JSON.stringify(relocateOtherPic.value || []),
            doorNo: form.value.doorNo,
            type: getTabType(props.type),
            amount: form.value.amount
          }
          submit(params)
        } else {
          let params: any = {
            ...form.value,
            relocateOtherPic: JSON.stringify(relocateOtherPic.value || []), // 其他附件
            type: getTabType(props.type)
          }
          submit(params)
        }
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
