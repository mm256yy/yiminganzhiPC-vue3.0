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
      <ElButton :icon="saveIcon" type="primary" @click="onSubmit(formRef)" :loading="saveLoading">
        保存
      </ElButton>
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
        <span class="text">企业法人信息：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="法人姓名" prop="legalPersonName">
            <ElInput v-model="form.legalPersonName" placeholder="法人姓名" class="!w-full" />
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
        <span class="text">企业证照信息：</span>
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
        <span class="text">企业工商信息：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="企业地址" prop="companyAddress">
            <ElInput v-model="form.companyAddress" placeholder="请输入" class="!w-full" />
          </ElFormItem>
        </ElCol>
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
        <!-- :oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+6)}" -->
        <ElCol :span="7">
          <ElFormItem label="注册资金" prop="registeredAmount">
            <ElInput
              type="number"
              :min="0"
              v-model="form.registeredAmount"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            >
              <template #append>万元</template>
            </ElInput>
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
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="成立日期" prop="establishDate">
            <el-date-picker v-model="form.establishDate" type="date" placeholder="请选择成立日期" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="企业类别" prop="industryType">
            <ElSelect clearable filterable v-model="form.type" class="!w-full">
              <ElOption
                v-for="item in dictObj[379]"
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
        <ElCol :span="14">
          <ElFormItem label="经营范围" prop="natureBusiness">
            <ElInput type="textarea" v-model="form.natureBusiness" />
          </ElFormItem>
        </ElCol>

        <ElCol :span="7" />
      </ElRow>
      <div class="titleBox">
        <span class="text">企业资产信息：</span>
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
              <template #append>万元</template>
            </ElInput>
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
              <template #append>万元</template>
            </ElInput>
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
              <template #append>人</template>
            </ElInput>
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
              <template #append>人</template>
            </ElInput>
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
              <template #append>万元</template>
            </ElInput>
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
              <template #append>万元</template>
            </ElInput>
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
              <template #append>万元</template>
            </ElInput>
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
              <template #append>万元</template>
            </ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div class="titleBox">
        <span class="text">企业其他信息：</span>
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
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="7">
          <ElFormItem label="主要产品种类" prop="productCategory">
            <ElInput :min="0" v-model="form.productCategory" />
          </ElFormItem>
        </ElCol>

        <ElCol :span="7" />
      </ElRow>
      <ElRow justify="center">
        <ElCol :span="7">
          <ElFormItem label="企业影响情况" prop="informationInvolved">
            <ElSelect clearable filterable v-model="form.informationInvolved" class="!w-full">
              <ElOption
                v-for="item in dictObj[209]"
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
          <ElFormItem label="企业初步处理方案" prop="treatmentScheme">
            <ElSelect clearable filterable v-model="form.treatmentScheme" class="!w-full">
              <ElOption
                v-for="item in dictObj[210]"
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
      <div class="titleBox">
        <span class="text">企业土地情况：</span>
      </div>
      <ElRow justify="center">
        <ElCol :span="14">
          <ElTable border :data="tableData" style="width: 100%">
            <ElTableColumn label="" :width="60" align="center" header-align="center" prop="type" />
            <ElTableColumn label="权属面积(亩)" prop="value" align="center" header-align="center">
              <template #default="{ row }">
                <div v-if="row.type == '合计'">{{ total.toFixed(2) }}</div>
                <ElInput v-else placeholder="请输入" type="number" min="0" v-model="row.value" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="占用面积(亩)" prop="value2" align="center" header-align="center">
              <template #default="{ row }">
                <div v-if="row.type == '合计'">{{ total2 }}</div>
                <ElInput v-else placeholder="请输入" type="number" min="0" v-model="row.value2" />
              </template>
            </ElTableColumn>
            <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
              <template #default="{ row }">
                <div v-if="row.type == '合计'"></div>
                <ElInput v-else placeholder="请输入" v-model="row.remark" />
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCol>

        <ElCol :span="7" />
      </ElRow>
      <div class="titleBox">
        <span class="text">企业图片：</span>
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
          :on-success="uploadFileChange2"
          :before-remove="beforeRemove"
          :on-remove="removeFile2"
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

  <!-- 查看图片 -->
  <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
    <img class="block w-full" :src="imgUrl" alt="Preview Image" />
  </ElDialog>
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
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElMessageBox,
  ElMessage,
  ElDialog
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import {
  addCompanyApi,
  updateCompanyApi,
  getCompanyListApi
} from '@/api/workshop/enterprise/service'
import { validateIdNo, checkTel } from '@/utils/index'
import { useIcon } from '@/hooks/web/useIcon'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  rowdata: any
  doorNo: string
  householdId
}

interface FileItemType {
  name: string
  url: string
}

const addIcon = useIcon({ icon: 'ant-design:edit-filled' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const saveLoading = ref(false)
const { required } = useValidator()

const tableData = ref([
  { type: '出让', value: 0, value2: 0, remake: '' },
  { type: '划拨', value: 0, value2: 0, remake: '' },
  { type: '租用', value: 0, value2: 0, remake: '' },
  { type: '其他', value: 0, value2: 0, remake: '' },
  { type: '合计', value: 0, value2: 0, remake: '' }
])

const total = computed(() => {
  return tableData.value.reduce((pre: any, current: any) => {
    return pre + current.value * 1
  }, 0)
})

const total2 = computed(() => {
  return tableData.value.reduce((pre: any, current: any) => {
    return pre + current.value2 * 1
  }, 0)
})

const onAddRow = () => {}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<DemographicDtoType, 'id'> = {}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)
const licensePic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.rowdata,
  (val) => {
    if (val) {
      // 处理表单数据
      form.value = {
        ...val
      }

      tableData.value.forEach((item: any) => {
        if (item.type == '出让') {
          item.value = form.value.sellOwnershipArea
          item.value2 = form.value.sellOccupiedArea
          item.remark = form.value.sellRemark
        }
        if (item.type == '划拨') {
          item.value = form.value.transferOwnershipArea
          item.value2 = form.value.transferOccupiedArea
          item.remark = form.value.transferRemark
        }
        if (item.type == '租用') {
          item.value = form.value.rentOwnershipArea
          item.value2 = form.value.rentOccupiedArea
          item.remark = form.value.rentRemark
        }
        if (item.type == '其他') {
          item.value = form.value.otherOwnershipArea
          item.value2 = form.value.otherOccupiedArea
          item.remark = form.value.otherRemark
        }
      })
    } else {
      form.value = { ...defaultValue }
      licensePic.value = []
      otherPic.value = []
    }
    if (!form.value.registerType) {
      form.value.registerType = '14'
    }
    try {
      if (form.value.licensePic) {
        licensePic.value = JSON.parse(form.value.licensePic)
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
  legalPersonCard: [{ validator: validateIdNo, trigger: 'blur' }, required()],
  registerType: [required()],
  taxLicenceNo: [required()],
  taxPeriodValidity: [required()],
  taxLicenceCompany: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: DemographicDtoType) => {
  if (props.actionType === 'add') {
    await addCompanyApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
    saveLoading.value = false
  } else {
    await updateCompanyApi({
      ...data,
      doorNo: props.doorNo,
      householdId: props.householdId
    })
    saveLoading.value = false
  }
  getCompanyListApi({
    doorNo: props.doorNo
  })
    .then((res) => {
      form.value = res.content[0]
      tableData.value.forEach((item: any) => {
        if (item.type == '出让') {
          item.value = res.content[0].sellOwnershipArea
          item.value2 = res.content[0].sellOccupiedArea
          item.remark = res.content[0].sellRemark
        }
        if (item.type == '划拨') {
          item.value = res.content[0].transferOwnershipArea
          item.value2 = res.content[0].transferOccupiedArea
          item.remark = res.content[0].transferRemark
        }
        if (item.type == '租用') {
          item.value = res.content[0].rentOwnershipArea
          item.value2 = res.content[0].rentOccupiedArea
          item.remark = res.content[0].rentRemark
        }
        if (item.type == '其他') {
          item.value = res.content[0].otherOwnershipArea
          item.value2 = res.content[0].otherOccupiedArea
          item.remark = res.content[0].otherRemark
        }
        ElMessage.success('操作成功！')
        saveLoading.value = false
      })
    })
    .catch(() => {
      saveLoading.value = false
    })

  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      saveLoading.value = true
      const data: any = {
        ...form.value,
        licensePic: JSON.stringify(licensePic.value),
        otherPic: JSON.stringify(otherPic.value)
      }

      tableData.value.forEach((item: any) => {
        if (item.type == '出让') {
          data.sellOwnershipArea = item.value
          data.sellOccupiedArea = item.value2
          data.sellRemark = item.remark
        }
        if (item.type == '划拨') {
          data.transferOwnershipArea = item.value
          data.transferOccupiedArea = item.value2
          data.transferRemark = item.remark
        }
        if (item.type == '租用') {
          data.rentOwnershipArea = item.value
          data.rentOccupiedArea = item.value2
          data.rentRemark = item.remark
        }
        if (item.type == '其他') {
          data.otherOwnershipArea = item.value
          data.otherOccupiedArea = item.value2
          data.otherRemark = item.remark
        }
        if (item.type == '合计') {
          data.totalOwnershipArea = total.value
          data.totalOccupiedArea = total2.value
        }
      })
      submit(data)
    } else {
      return false
    }
  })
}, 0)

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
  if (type === 'license') {
    licensePic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: any, fileList: UploadFiles) => {
  handleFileList(fileList, 'license')
}
const uploadFileChange2 = (_response: any, _file: any, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'license')
}
const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
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
  height: 32px;
  padding-left: 15px;
  margin: 20px 0px;
  line-height: 32px;
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
