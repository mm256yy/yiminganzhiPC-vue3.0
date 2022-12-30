<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="1140"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="与户主关系" prop="relation">
            <ElSelect clearable v-model="form.relation">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="姓名" prop="name">
            <ElInput v-model="form.name" placeholder="请输入姓名" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="身份证号" prop="card">
            <ElInput
              clearable
              placeholder="请输入身份证号"
              type="text"
              class="!w-full"
              v-model="form.card"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="性别" prop="sex">
            <ElSelect clearable v-model="form.sex">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="出生年月" prop="birthday">
            <ElDatePicker v-model="form.birthday" type="date" placeholder="请选择日期" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="民族" prop="nation">
            <ElInput v-model="form.nation" placeholder="请输入民族" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="人口类型" prop="populationType">
            <ElSelect clearable v-model="form.populationType">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="户籍所在地" prop="censusRegister">
            <ElInput
              clearable
              placeholder="请输入户籍所在地"
              type="text"
              class="!w-full"
              v-model="form.censusRegister"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="文化程度" prop="education">
            <ElSelect clearable v-model="form.education">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="婚姻状况" prop="marital">
            <ElSelect clearable v-model="form.marital">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="户籍类别" prop="censusType">
            <ElSelect clearable v-model="form.censusType">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="8">
          <ElFormItem label="职业" prop="occupation">
            <ElSelect clearable v-model="form.occupation">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="工作单位" prop="company">
            <ElInput
              clearable
              placeholder="请输入工作单位"
              type="text"
              class="!w-full"
              v-model="form.company"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="参保情况" prop="insured">
            <ElSelect clearable v-model="form.insured">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="8">
          <ElFormItem label="人口类别" prop="category">
            <ElSelect clearable v-model="form.category">
              <ElOption
                v-for="item in [treeSelectDefaultProps]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="9">
          <ElFormItem label="身份证照片">
            <div class="flex items-center">
              <ElUpload
                :class="[cardFront.length > 0 ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :limit="1"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="cardFront"
                :headers="headers"
                :on-success="uploadFileChange1"
                :before-remove="beforeRemove"
                :on-remove="removeFile1"
                :on-preview="imgPreview"
              >
                <template #trigger v-if="cardFront.length === 0">
                  <div class="relative w-148px h-148px">
                    <img class="block w-148px h-148px" src="@/assets/imgs/card-front.png" alt="" />
                    <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]"
                      >点击上传正面</div
                    >
                  </div>
                </template>
                <template #trigge v-else></template>
              </ElUpload>
              <ElUpload
                class="ml-8px"
                :class="[cardEnd.length > 0 ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :limit="1"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="cardEnd"
                :headers="headers"
                :on-success="uploadFileChange2"
                :before-remove="beforeRemove"
                :on-remove="removeFile2"
                :on-preview="imgPreview"
              >
                <template #trigger>
                  <div class="relative w-148px h-148px">
                    <img class="block w-148px h-148px" src="@/assets/imgs/card-back.png" alt="" />
                    <div class="absolute bottom-26px left-32px text-[var(--el-color-primary)]"
                      >点击上传反面</div
                    >
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="15">
          <ElFormItem label="户口本照片" prop="sex">
            <ElUpload
              :class="[inhabitant.length > 9 ? 'upload' : '']"
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :limit="10"
              :list-type="'picture-card'"
              accept=".jpg,.jpeg,.png"
              :multiple="false"
              :file-list="inhabitant"
              :headers="headers"
              :on-success="uploadFileChange3"
              :before-remove="beforeRemove"
              :on-remove="removeFile3"
              :on-preview="imgPreview"
            >
              <template #trigger>
                <div class="relative w-148px h-148px">
                  <img class="block w-148px h-148px" src="@/assets/imgs/inhabitant.png" alt="" />
                  <div class="absolute bottom-26px left-46px text-[var(--el-color-primary)]"
                    >点击上传</div
                  >
                </div>
              </template>
            </ElUpload>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="备注" prop="info">
        <ElInput type="textarea" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
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
  ElDivider,
  ElRow,
  ElCol,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
// import { useValidator } from '@/hooks/web/useValidator'
import type { DemographicDtoType } from '@/api/workshop/population/types'
import type { DistrictNodeType } from '@/api/district/types'
import { useAppStore } from '@/store/modules/app'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: DemographicDtoType | null | undefined
  districtTree: DistrictNodeType[]
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
// const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<DemographicDtoType, 'id'> = {
  address: '',
  doorNo: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea'
}
const form = ref<Omit<DemographicDtoType, 'id'>>(defaultValue)

const cardFront = ref<FileItemType[]>([])
const cardEnd = ref<FileItemType[]>([])
const inhabitant = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.row,
  (val) => {
    formRef.value?.resetFields()
    if (val) {
      // 处理行政区划
      form.value = {
        ...val
      }
    } else {
      form.value = defaultValue
    }
    try {
      if (form.value.cardFront) {
        cardFront.value = JSON.parse(form.value.cardFront)
      }
      if (form.value.cardEnd) {
        cardEnd.value = JSON.parse(form.value.cardEnd)
      }
      if (form.value.inhabitant) {
        inhabitant.value = JSON.parse(form.value.inhabitant)
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
const rules = reactive<FormRules>({})

// 关闭弹窗
const onClose = () => {
  emit('close')
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const data: any = {
        ...form.value,
        cardFront: JSON.stringify(cardFront.value),
        cardEnd: JSON.stringify(cardEnd.value),
        inhabitant: JSON.stringify(inhabitant.value)
      }
      emit('submit', data)
    } else {
      return false
    }
  })
}, 600)

// 处理函数
const handleFileList = (fileList: UploadFiles, type: string) => {
  let list: FileItemType[] = []
  if (fileList && fileList.length) {
    list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: fileItem.url || (fileItem.response as any).data
        }
      })
  }
  if (type === 'card-front') {
    cardFront.value = list
  } else if (type === 'card-end') {
    cardEnd.value = list
  } else if (type === 'inhabitant') {
    inhabitant.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-front')
}
const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-end')
}
const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'inhabitant')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-front')
}
const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'card-end')
}
const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'inhabitant')
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
</style>
