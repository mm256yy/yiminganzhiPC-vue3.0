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
          <ElFormItem label="幢号" prop="relation">
            <ElInput v-model="form.name" placeholder="请输入幢号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="土地使用权证编号" prop="name">
            <ElInput v-model="form.name" placeholder="请输入编号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="房产所有权证编号" prop="card">
            <ElInput clearable placeholder="请输入编号" type="text" v-model="form.card" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋用途" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="层高" prop="birthday">
            <ElInput v-model="form.nation" placeholder="请输入层高" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="层数" prop="nation">
            <ElInput v-model="form.nation" placeholder="请输入层数" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋产别" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="房屋类别" prop="birthday">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="房屋高程" prop="nation">
            <ElInput
              clearable
              placeholder="请输入编号"
              type="text"
              class="!w-full"
              v-model="form.card"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="结构类型" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="屋面形式" prop="birthday">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="屋面材料" prop="nation">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="外墙" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="内墙" prop="birthday">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="地面" prop="nation">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="门窗" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="水电" prop="birthday">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="竣工日期" prop="nation">
            <ElDatePicker
              class="!w-full"
              v-model="form.birthday"
              type="date"
              placeholder="请选择日期"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="土地性质" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
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
          <ElFormItem label="建筑面积" prop="censusRegister">
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
          <ElFormItem label="计算公式" prop="sex">
            <ElSelect class="!w-full" clearable v-model="form.sex">
              <ElInput
                clearable
                placeholder="请输入户籍所在地"
                type="text"
                class="!w-full"
                v-model="form.censusRegister"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <MapFormItem :positon="position" @change="onChosePosition" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋平面示意图" prop="sex">
            <ElUpload
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :limit="1"
              accept=".jpg,.jpeg,.png"
              :multiple="false"
              :file-list="coverPic"
              :headers="headers"
              :on-success="uploadFileChange"
              :before-remove="beforeRemove"
              :on-remove="removeFile"
              :on-preview="imgPreview"
            >
              <template #trigger>
                <div>身份证正面上传</div>
              </template>
            </ElUpload>
          </ElFormItem>
        </ElCol>
        <ElCol :span="16">
          <ElFormItem label="土地证" prop="sex">
            <ElUpload
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :limit="1"
              accept=".jpg,.jpeg,.png"
              :multiple="false"
              :file-list="coverPic"
              :headers="headers"
              :on-success="uploadFileChange"
              :before-remove="beforeRemove"
              :on-remove="removeFile"
              :on-preview="imgPreview"
            >
              <template #trigger>
                <div>户口本上传</div>
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
  ElMessage,
  ElUpload,
  ElDatePicker,
  ElDivider,
  ElRow,
  ElCol,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { MapFormItem } from '@/components/Map'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import type { LandlordDtoType } from '@/api/project/landlord/types'
import type { DistrictNodeType } from '@/api/district/types'
import { useAppStore } from '@/store/modules/app'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: LandlordDtoType | null | undefined
  districtTree: DistrictNodeType[]
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  doorNo: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea'
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)
const position: {
  latitude: number
  longitude: number
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})

const enclosure = ref<any>([])
const coverPic = ref<any>([])
const imgUrl = ref<any>()
const dialogVisible = ref<boolean>()

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
        ...val,
        parentCode: [val.areaCode, val.townCode, val.villageCode, val.virutalVillageCode]
      }
    } else {
      form.value = defaultValue
    }
    position.longitude = form.value.longitude
    position.latitude = form.value.latitude
    position.address = form.value.address
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  doorNo: [required()],
  phone: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = () => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
  emit('close')
}

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      if (!position.latitude || !position.longitude) {
        ElMessage.error('请选择位置')
        return
      }
      const data: any = {
        ...form.value,
        ...position,
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || ''
      }
      delete data.parentCode
      emit('submit', data)
      position.latitude = 0
      position.longitude = 0
      position.address = ''
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
  if (type === 'enclosure') {
    enclosure.value = list
  } else {
    coverPic.value = list
  }
}

// 文件上传
const uploadFileChange = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'enclosure')
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'enclosure')
}

const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>
