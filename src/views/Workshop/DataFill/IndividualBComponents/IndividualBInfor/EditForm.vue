<template>
  <div
    class="FillingBox"
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    v-if="props.show"
    :width="1140"
    @close="onClose"
    alignCenter
    appendToBody
  >
    <div style="text-align: right">
      <ElButton :icon="addIcon" type="primary" @click="onAddRow" v-if="false">编辑</ElButton>
      <ElButton :icon="saveIcon" :loading="saveloading" type="primary" @click="onSubmit(formRef)"
        >保存</ElButton
      >
    </div>

    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      label-width="150px"
      :label-position="'right'"
      :rules="rules"
    >
      <div class="titleBox">
        <span class="text">个体工商法人信息：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="个体工商法人" prop="legalPersonName">
            <ElInput v-model="form.legalPersonName" placeholder="个体工商法人" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="法人身份证号" prop="legalPersonCard">
            <ElInput v-model="form.legalPersonCard" placeholder="法人身份证号" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="法人联系方式" prop="legalPersonPhone">
            <ElInput
              clearable
              filterable
              placeholder="法人联系方式"
              type="text"
              class="!w-full"
              v-model="form.legalPersonPhone"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div class="titleBox">
        <span class="text">个体工商证照信息：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="税务许可证编号" prop="taxLicenceNo">
            <ElInput v-model="form.taxLicenceNo" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="税务许可证有效期" prop="taxPeriodValidity">
            <ElInput v-model="form.taxPeriodValidity" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="税务许可证颁布单位" prop="taxLicenceCompany">
            <ElInput v-model="form.taxLicenceCompany" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="许可证类型" prop="licenceType">
            <ElSelect clearable filterable v-model="form.licenceType" class="!w-full">
              <ElOption
                v-for="item in dictObj[217]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="7" />
        <ElCol :span="7" />
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="许可证编号" prop="licenceNo">
            <ElInput v-model="form.licenceNo" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="许可证有效期" prop="periodValidity">
            <ElInput v-model="form.periodValidity" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="许可证颁布单位" prop="issuingCompany">
            <ElInput v-model="form.issuingCompany" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div class="titleBox">
        <span class="text">个体工商信息：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="个体工商地址" prop="companyAddress">
            <ElInput v-model="form.companyAddress" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="所属分类" prop="companyType">
            <ElSelect
              clearable
              filterable
              v-model="form.companyType"
              class="!w-full"
              placeholder=""
            >
              <ElOption
                v-for="item in dictObj[216]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="7">
          <ElFormItem label="经济性质" prop="economicNature">
            <ElInput v-model="form.economicNature" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="其他权证情况" prop="ohterLicence">
            <ElInput v-model="form.ohterLicence" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="登记注册类型" prop="registerType">
            <ElSelect clearable filterable v-model="form.registerType" class="!w-full">
              <ElOption
                v-for="item in dictObj[219]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="7">
          <ElFormItem label="成立日期" prop="establishDate">
            <el-date-picker v-model="form.establishDate" type="date" placeholder="请选择成立日期" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="所属行业" prop="industryType">
            <ElSelect clearable filterable v-model="form.industryType" class="!w-full">
              <ElOption
                v-for="item in dictObj[215]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="7">
          <ElFormItem label="注册资金" prop="registeredAmount">
            <ElInput
              type="number"
              :min="0"
              v-model="form.registeredAmount"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>

        <ElCol :span="7" />
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="14">
          <ElFormItem label="经营范围" prop="natureBusiness">
            <ElInput type="textarea" v-model="form.natureBusiness" /> </ElFormItem
        ></ElCol>

        <ElCol :span="7" />
      </ElRow>
      <div class="titleBox">
        <span class="text">个体工商资产信息：</span>
      </div>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="固定资产原值" prop="fixedAssetsOriginalValue">
            <ElInput
              type="number"
              :min="0"
              v-model="form.fixedAssetsOriginalValue"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="固定资产净值" prop="fixedAssetsNetValue">
            <ElInput
              type="number"
              :min="0"
              v-model="form.fixedAssetsNetValue"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7" />
      </ElRow>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="正式工人数量" prop="regularWorkerNum">
            <ElInput
              type="number"
              :min="0"
              v-model.number="form.regularWorkerNum"
              oninput="value=value.replace(/[^\d]/g,'')"
            >
              <template #append>人</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="临时工人数量" prop="temporaryWorkerNum">
            <ElInput
              type="number"
              :min="0"
              v-model.number="form.temporaryWorkerNum"
              oninput="value=value.replace(/[^\d]/g,'')"
            >
              <template #append>人</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="年工资总额" prop="annualPayroll">
            <ElInput
              type="number"
              :min="0"
              v-model="form.annualPayroll"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="近三年平均年产值" prop="averageAnnualOutputValue">
            <ElInput
              type="number"
              :min="0"
              v-model="form.averageAnnualOutputValue"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="近三年平均年利润" prop="averageAnnualProfit">
            <ElInput
              type="number"
              :min="0"
              v-model="form.averageAnnualProfit"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="近三年平均年缴税额" prop="averageAnnualTaxPaid">
            <ElInput
              type="number"
              :min="0"
              v-model="form.averageAnnualTaxPaid"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template></ElInput
            >
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div class="titleBox">
        <span class="text">个体工商其他信息：</span>
      </div>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="生产经营情况" prop="managementStatus">
            <ElSelect clearable filterable v-model="form.managementStatus" class="!w-full">
              <ElOption
                v-for="item in dictObj[213]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="7">
          <ElFormItem label="主要产品种类" prop="productCategory">
            <ElInput :min="0" v-model="form.productCategory" />
          </ElFormItem>
        </ElCol>

        <ElCol :span="7" />
      </ElRow>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="个体户涉及情况" prop="informationInvolved">
            <ElSelect clearable filterable v-model="form.informationInvolved" class="!w-full">
              <ElOption
                v-for="item in dictObj[209]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>

        <ElCol :span="7" />
        <ElCol :span="7" />
      </ElRow>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="个体户初步处理方案" prop="treatmentScheme">
            <ElSelect clearable filterable v-model="form.treatmentScheme" class="!w-full">
              <ElOption
                v-for="item in dictObj[210]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>

        <ElCol :span="7" />
        <ElCol :span="7" />
      </ElRow>

      <div class="titleBox">
        <span class="text">个体工商图片：</span>
      </div>
      <ElRow :gutter="30">
        <ElCol>
          <ElFormItem label="营业执照">
            <div class="flex items-center">
              <ElUpload
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :on-error="onError"
                :disabled="actionType === 'view'"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="true"
                :file-list="licensePic"
                :headers="headers"
                :on-success="uploadFileChange1"
                :before-remove="beforeRemove"
                :on-remove="removeFile1"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="relative w-148px h-148px">
                    <div class="flex items-center justify-center w-148px h-148px">
                      <Icon icon="ant-design:plus-outlined" :size="22" />
                    </div>
                    <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]">
                      点击上传附件
                    </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="其他附件">
        <ElUpload
          action="/api/file/type"
          :data="{
            type: 'image'
          }"
          :on-error="onError"
          :disabled="actionType === 'view'"
          :list-type="'picture-card'"
          accept=".jpg,.jpeg,.png"
          :multiple="true"
          :file-list="otherPic"
          :headers="headers"
          :on-success="uploadFileChange4"
          :before-remove="beforeRemove"
          :on-remove="removeFile4"
          :on-preview="imgPreview"
        >
          <template #trigger>
            <div class="relative w-148px h-148px">
              <div class="flex items-center justify-center w-148px h-148px">
                <Icon icon="ant-design:plus-outlined" :size="22" />
              </div>
              <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]">
                点击上传附件
              </div>
            </div>
          </template>
        </ElUpload>
      </ElFormItem>
      <div class="titleBox">
        <span class="text">备注:</span>
      </div>
      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElUpload,
  ElDatePicker,
  ElRow,
  ElCol,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, defineExpose } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addDemographicApi,
  updateDemographicApi,
  getDemographicListApi
} from '@/api/workshop/IndividualB/service'
import { validateIdNo, checkTel } from '@/utils/index'
import { useIcon } from '@/hooks/web/useIcon'
const addIcon = useIcon({ icon: 'ant-design:edit-filled' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const actionType2 = ref('')
const { required } = useValidator()
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  rowdata: any
  doorNo: string
  householdId
}
const saveloading = ref(false)
interface FileItemType {
  name: string
  url: string
}

const onAddRow = () => {}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
// const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<DemographicDtoType, 'id'> = {}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
// const placeholderList = ref<string[]>([])
const licensePic = ref<FileItemType[]>([])
const cardEnd = ref<FileItemType[]>([])
const householdPic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// //处理表单不同状态下的placeholder
// watch(
//   () => props.actionType,
//   (newValue) => {
//     if (newValue == 'view') {
//       placeholderList.value = ['', '', '', '', '', ' ']
//     } else {
//       placeholderList.value = [
//         '请输入姓名',
//         '请输入身份证号',
//         '请选择日期',
//         '请输入工作单位',
//         '请输入户籍所在地',
//         '请选择'
//       ]
//     }
//   },
//   //可选immediate: true马上执行
//   { deep: true, immediate: true }
// )

watch(
  () => props.rowdata,
  (val) => {
    if (val) {
      // 处理表单数据
      form.value = {
        ...val
      }
    } else {
      form.value = { ...defaultValue }
      licensePic.value = []
      cardEnd.value = []
      householdPic.value = []
      otherPic.value = []
    }
    try {
      if (form.value.licensePic) {
        licensePic.value = JSON.parse(form.value.licensePic)
      }

      if (form.value.householdPic) {
        householdPic.value = JSON.parse(form.value.householdPic)
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

// 规则校验
const rules = reactive<FormRules>({
  legalPersonName: [required()],

  legalPersonPhone: [{ validator: checkTel, trigger: 'blur' }, required()],
  legalPersonCard: [{ validator: validateIdNo, trigger: 'blur' }, required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: DemographicDtoType) => {
  if (props.actionType === 'add' && actionType2.value != 'edit') {
    await addDemographicApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  } else {
    await updateDemographicApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
  }
  getDemographicListApi({
    doorNo: props.doorNo
  }).then((res) => {
    form.value = res.content[0]
    actionType2.value = 'edit'
  })
  ElMessage.success('操作成功！')
  saveloading.value = false
  onClose(true)
}
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      saveloading.value = true
      const data: any = {
        ...form.value,
        licensePic: JSON.stringify(licensePic.value),
        householdPic: JSON.stringify(householdPic.value),
        otherPic: JSON.stringify(otherPic.value)
      }

      submit(data)
    } else {
      return false
    }
  })
}, 0)
defineExpose({
  onSubmit
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
  if (type === 'card-front') {
    licensePic.value = list
  } else if (type === 'card-end') {
    cardEnd.value = list
  } else if (type === 'householdPic') {
    householdPic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: any, fileList: UploadFiles) => {
  console.log(fileList)
  licensePic.value.push({ name: _file.name, url: _file.response.data })
}
const uploadFileChange4 = (_response: any, _file: any, fileList: UploadFiles) => {
  console.log(fileList)
  // handleFileList(fileList, 'other')
  otherPic.value.push({ name: _file.name, url: _file.response.data })
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-front')
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
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}

.FillingBox {
  padding: 15px 30px;
}

.titleBox {
  height: 36px;
  padding-left: 15px;
  margin: 20px 0px;
  line-height: 36px;
  background: #f5f7fa;
  box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

  .text {
    padding-left: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-size: 17px;
    font-weight: 600;
    color: #171718;
    border-left: 5px solid blue;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
