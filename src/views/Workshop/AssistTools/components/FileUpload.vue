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
      v-loading="formLoading"
      class="form"
      ref="formRef"
      :model="form"
      label-width="120px"
      :label-position="'right'"
      :rules="rules"
    >
      <div class="row-item" v-for="(item, index) in form" :key="index">
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="区块："> {{ settleAddressText }}</ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 宅基地 -->
        <ElRow v-if="baseInfo.houseAreaType === 'homestead'">
          <ElCol :span="5">
            <ElFormItem label="类型："> 宅基地 </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="摇号顺序号："> {{ item.lotteryOrder }} </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="择址顺序号："> {{ item.placeOrder }} </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="户型："> {{ item.area }} </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="地块编号："> {{ item.landNo }} </ElFormItem>
          </ElCol>
        </ElRow>

        <!-- 公寓房 -->
        <ElRow v-else-if="baseInfo.houseAreaType === 'flat'">
          <ElCol :span="4">
            <ElFormItem label="类型："> 公寓房 </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="摇号顺序号："> {{ item.lotteryOrder }} </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem label="选房顺序号："> {{ item.placeOrder }} </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="套型："> {{ item.area }} </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="幢号-室号：">
              {{
                item.roomNo
                  ? baseInfo.roomNoOptions.filter((ket) => ket.value === item.roomNo)[0].label
                  : ''
              }}
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="摇号顺序凭证：">
              <div class="card-img-list">
                <ElUpload
                  ref="lotteryOrderRef"
                  :list-type="'picture-card'"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  accept=".*"
                  :multiple="true"
                  :file-list="item.lotteryOrderPic"
                  :headers="headers"
                  :on-error="onError"
                  :on-success="(...event) => uploadFileChange1(event, index)"
                  :before-remove="beforeRemove"
                  :on-remove="(...event) => removeFile1(event, index)"
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
            <div class="col-wrapper">
              <div class="col-labels">
                {{
                  props.baseInfo?.houseAreaType === 'homestead'
                    ? '选房顺序号凭证：'
                    : '择房顺序号凭证：'
                }}
              </div>
              <div class="card-img-list">
                <ElUpload
                  ref="placeOrderRef"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".*"
                  :multiple="true"
                  :file-list="item.placeOrderPic"
                  :headers="headers"
                  :on-success="(...event) => uploadFileChange2(event, index)"
                  :before-remove="beforeRemove"
                  :on-remove="(...event) => removeFile2(event, index)"
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
        </ElRow>

        <ElRow>
          <ElCol :span="24">
            <div class="col-wrapper">
              <div class="col-label-required">
                {{
                  props.baseInfo?.houseAreaType === 'homestead' ? '择房确认单：' : '选房确认单：'
                }}
              </div>
              <div class="card-img-list">
                <ElUpload
                  ref="chooseHouseRef"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".*"
                  :multiple="true"
                  :file-list="item.chooseHousePic"
                  :headers="headers"
                  :on-success="(...event) => uploadFileChange3(event, index)"
                  :before-remove="beforeRemove"
                  :on-remove="(...event) => removeFile3(event, index)"
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
            <ElFormItem label="其他附件：">
              <div class="card-img-list">
                <ElUpload
                  ref="otherRef"
                  action="/api/file/type"
                  :data="{
                    type: 'archives'
                  }"
                  :on-error="onError"
                  :list-type="'picture-card'"
                  accept=".*"
                  :multiple="true"
                  :file-list="item.otherPic"
                  :headers="headers"
                  :on-success="(...event) => uploadFileChange4(event, index)"
                  :before-remove="beforeRemove"
                  :on-remove="(...event) => removeFile4(event, index)"
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
import { debounce, filter } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { saveBatchDocumentationApi } from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { resettleArea, resettleAreaFlat } from '@/views/Workshop/ImmigrantImplement/DataFill/config'
import { getChooseHouseApi } from '@/api/immigrantImplement/siteConfirmation/common-service'

interface PropsType {
  show: boolean
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
const formLoading = ref<boolean>(false)
const settleAddressText = ref<string>('')
const btnLoading = ref<boolean>(false)
const lotteryOrderRef = ref()
const placeOrderRef = ref()
const chooseHouseRef = ref()
const otherRef = ref()

const form = ref<any[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 规则校验
const rules = reactive<FormRules>({})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    lotteryOrderRef.value?.clearFiles()
    placeOrderRef.value?.clearFiles()
    chooseHouseRef.value?.clearFiles()
    otherRef.value?.clearFiles()
  })
}

const submit = (data: any) => {
  btnLoading.value = true
  saveBatchDocumentationApi(data).then(
    () => {
      ElMessage.success('操作成功！')
      btnLoading.value = false
    },
    (error) => {
      btnLoading.value = false
      console.log(error)
    }
  )
  onClose(true)
}

// 择房/择址确认单是否为空
const isNullChooseHousePic = () => {
  const arr: any = form.value.map((item: any) => {
    return item.chooseHousePic.length > 0
  })
  const result = arr.every((item: boolean) => item)
  return result
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!isNullChooseHousePic()) {
        ElMessage.error(
          `${
            props.baseInfo?.houseAreaType === 'homestead' ? '请上传择址确认单' : '请上传择房确认单'
          }`
        )
        return
      }
      let params: any = {}
      form.value.forEach((item) => {
        params = {
          ...item,
          lotteryOrderPic: JSON.stringify(item.lotteryOrderPic || []), // 摇号顺序凭证
          placeOrderPic: JSON.stringify(item.placeOrderPic || []), // 择房/择址顺序号凭证
          chooseHousePic: JSON.stringify(item.chooseHousePic || []), // 择房/择址确认单
          otherPic: JSON.stringify(item.otherPic || []) // 其他附件
        }
      })

      submit(params)
    } else {
      return false
    }
  })
}, 600)

// 处理函数
const handleFileList = (fileList: UploadFiles, type: string, index: number) => {
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

  if (type === 'lotteryOrder') {
    form.value[index].lotteryOrderPic = list
  } else if (type === 'placeOrder') {
    form.value[index].placeOrderPic = list
  } else if (type === 'chooseHouse') {
    form.value[index].chooseHousePic = list
  } else if (type === 'other') {
    form.value[index].otherPic = list
  }
}

/**
 * 文件上传
 * @param params [_response: any, _file: UploadFile, fileList: UploadFiles]
 * @param index 数组下标
 */
const uploadFileChange1 = (params: any[], index: number) => {
  handleFileList(params[2], 'lotteryOrder', index)
}

const uploadFileChange2 = (params: any[], index: number) => {
  handleFileList(params[2], 'placeOrder', index)
}

const uploadFileChange3 = (params: any[], index: number) => {
  handleFileList(params[2], 'chooseHouse', index)
}

const uploadFileChange4 = (params: any[], index: number) => {
  handleFileList(params[2], 'other', index)
}

// 文件移除
const removeFile1 = (params: any[], index: number) => {
  handleFileList(params[1], 'lotteryOrder', index)
}

const removeFile2 = (params: any[], index: number) => {
  handleFileList(params[1], 'placeOrder', index)
}

const removeFile3 = (params: any[], index: number) => {
  handleFileList(params[1], 'chooseHouse', index)
}

const removeFile4 = (params: any[], index: number) => {
  handleFileList(params[1], 'other', index)
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

const getSettleAddress = async (data: any) => {
  // 选择了公寓房的安置方式
  if (data.houseAreaType === 'flat') {
    let f = await resettleAreaFlat()
    const str = f.find((item) => item.code === data.settleAddress)?.name
    settleAddressText.value = str
  } else {
    let m = await resettleArea()
    const str = m.find((item) => item.code === data.settleAddress)?.name
    settleAddressText.value = str
  }
}

const requestChooseHouseApi = async () => {
  try {
    const result = await getChooseHouseApi(props.baseInfo.id)
    getSettleAddress(result)
    // 处理表单数据
    const params = {
      ...result,
      lotteryOrderPic: result?.lotteryOrderPic ? JSON.parse(result?.lotteryOrderPic) : [], // 摇号顺序凭证
      placeOrderPic: result?.placeOrderPic ? JSON.parse(result?.placeOrderPic) : [], // 择房顺序号凭证
      chooseHousePic: result?.chooseHousePic ? JSON.parse(result?.chooseHousePic) : [], // 择房确认单
      otherPic: result?.otherPic ? JSON.parse(result?.otherPic) : [] // 其他附件
    }
    form.value = [params]
  } catch (error) {}
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      requestChooseHouseApi()
    }
  }
)
</script>

<style lang="less" scoped>
.row-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #e1e4ea;

  &:last-child {
    margin-bottom: 0;
    border: none;
  }

  .col-wrapper {
    display: flex;
    align-items: center;
    margin: 0 16px 16px 0;

    .col-labels {
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
    }

    .col-label-required {
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
