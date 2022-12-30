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
      label-width="124px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="幢号" prop="houseNo">
            <ElInput v-model="form.houseNo" placeholder="请输入幢号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="土地使用权证编号" prop="landNo">
            <ElInput v-model="form.landNo" placeholder="请输入编号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="房产所有权证编号" prop="propertyNo">
            <ElInput clearable placeholder="请输入编号" type="text" v-model="form.propertyNo" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋用途" prop="usageType">
            <ElSelect class="!w-full" clearable v-model="form.usageType">
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
          <ElFormItem label="层高" prop="storeyHeight">
            <ElInput v-model="form.storeyHeight" placeholder="请输入层高" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="层数" prop="storeyNumber">
            <ElInput v-model="form.storeyNumber" placeholder="请输入层数" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋产别" prop="propertyType">
            <ElSelect class="!w-full" clearable v-model="form.propertyType">
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
          <ElFormItem label="房屋类别" prop="houseType">
            <ElSelect class="!w-full" clearable v-model="form.houseType">
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
          <ElFormItem label="房屋高程" prop="houseHeight">
            <ElInput
              clearable
              placeholder="请输入房屋高程"
              type="text"
              class="!w-full"
              v-model="form.houseHeight"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="结构类型" prop="constructionType">
            <ElSelect class="!w-full" clearable v-model="form.constructionType">
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
          <ElFormItem label="屋面形式" prop="roofType">
            <ElSelect class="!w-full" clearable v-model="form.roofType">
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
          <ElFormItem label="屋面材料" prop="roofMaterialsType">
            <ElSelect class="!w-full" clearable v-model="form.roofMaterialsType">
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
          <ElFormItem label="外墙" prop="outerWallType">
            <ElSelect class="!w-full" clearable v-model="form.outerWallType">
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
          <ElFormItem label="内墙" prop="interiorWallType">
            <ElSelect class="!w-full" clearable v-model="form.interiorWallType">
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
          <ElFormItem label="地面" prop="groundType">
            <ElSelect class="!w-full" clearable v-model="form.groundType">
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
          <ElFormItem label="门窗" prop="doorsWindowsType">
            <ElSelect class="!w-full" clearable v-model="form.doorsWindowsType">
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
          <ElFormItem label="水电" prop="waterElectricityType">
            <ElSelect class="!w-full" clearable v-model="form.waterElectricityType">
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
          <ElFormItem label="竣工日期" prop="completedTime">
            <ElDatePicker
              class="!w-full"
              v-model="form.completedTime"
              type="date"
              placeholder="请选择日期"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="土地性质" prop="landType">
            <ElSelect class="!w-full" clearable v-model="form.landType">
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
          <ElFormItem label="建筑面积" prop="landArea">
            <ElInput
              clearable
              placeholder="请输入建筑面积"
              type="text"
              class="!w-full"
              v-model="form.landArea"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="计算公式" prop="formula">
            <ElInput
              clearable
              placeholder="请输入计算公式"
              type="text"
              class="!w-full"
              v-model="form.formula"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <MapFormItem :positon="position" @change="onChosePosition" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋平面示意图">
            <ElUpload
              :class="[housePic.length > 0 ? 'upload' : '']"
              :list-type="'picture-card'"
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :limit="1"
              accept=".jpg,.jpeg,.png"
              :multiple="false"
              :file-list="housePic"
              :headers="headers"
              :on-success="uploadFileChange1"
              :before-remove="beforeRemove"
              :on-remove="removeFile1"
              :on-preview="imgPreview"
            >
              <template #trigger>
                <div class="relative w-148px h-148px">
                  <img class="block w-148px h-148px" src="@/assets/imgs/house.png" alt="" />
                  <div class="absolute bottom-26px left-46px text-[var(--el-color-primary)]"
                    >点击上传</div
                  >
                </div>
              </template>
            </ElUpload>
          </ElFormItem>
        </ElCol>
        <ElCol :span="16">
          <ElFormItem label="土地证">
            <ElUpload
              :class="[landPic.length > 0 ? 'upload' : '']"
              :list-type="'picture-card'"
              action="/api/file/type"
              :data="{
                type: 'image'
              }"
              :limit="1"
              accept=".jpg,.jpeg,.png"
              :multiple="false"
              :file-list="landPic"
              :headers="headers"
              :on-success="uploadFileChange2"
              :before-remove="beforeRemove"
              :on-remove="removeFile2"
              :on-preview="imgPreview"
            >
              <template #trigger>
                <div class="relative w-148px h-148px">
                  <img class="block w-148px h-148px" src="@/assets/imgs/land.png" alt="" />
                  <div class="absolute bottom-26px left-46px text-[var(--el-color-primary)]"
                    >点击上传</div
                  >
                </div>
              </template>
            </ElUpload>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
    <el-dialog v-model="dialogVisible">
      <img class="w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
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
// import { useValidator } from '@/hooks/web/useValidator'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'
import { useAppStore } from '@/store/modules/app'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: HouseDtoType | null | undefined
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

const defaultValue: Omit<HouseDtoType, 'id'> = {
  address: '',
  doorNo: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea'
}

const form = ref<Omit<HouseDtoType, 'id'>>(defaultValue)
const position: {
  latitude: number
  longitude: number
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})

const housePic = ref<FileItemType[]>([])
const landPic = ref<FileItemType[]>([])
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
        ...val
      }
    } else {
      form.value = defaultValue
    }
    position.longitude = form.value.longitude
    position.latitude = form.value.latitude
    position.address = form.value.address

    try {
      if (form.value.housePic) {
        housePic.value = JSON.parse(form.value.housePic)
      }
      if (form.value.landPic) {
        landPic.value = JSON.parse(form.value.landPic)
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
        housePic: JSON.stringify(housePic.value || []),
        landPic: JSON.stringify(landPic.value || [])
      }
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
  if (type === 'house') {
    housePic.value = list
  } else {
    landPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}
const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}
const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
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
