<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : '新增'"
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
      <div style="font-weight: bolder">基本信息</div>
      <ElFormItem label="安置点:" required prop="name">
        <ElInput type="text" v-model="form.name" placeholder="请输入安置点" />
      </ElFormItem>
      <ElFormItem label="小区名称:" prop="residential">
        <ElInput type="text" v-model="form.residential" placeholder="请输入小区名称" />
      </ElFormItem>
      <ElFormItem label="绿化率(%):" prop="greeningRate">
        <ElInput type="text" v-model="form.greeningRate" placeholder="请输入绿化率(%)" />
      </ElFormItem>
      <ElFormItem label="结构类型:">
        <!-- <el-radio-group class="ml-4">
          <el-radio label="1" size="large">Option 1</el-radio>
          <el-radio label="2" size="large">Option 2</el-radio>
        </el-radio-group> -->
        <!-- <ElTreeSelect
          class="!w-full"
          v-model="form.structure"
          :data="dictObj[252]"
          node-key="code"
        /> -->
        <ElSelect v-model="form.structure" style="width: 100%">
          <ElOption
            v-for="item in dictObj[252]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="建筑密度(%):" prop="buildingDensity">
        <ElInput type="text" v-model="form.buildingDensity" placeholder="请输入建筑密度(%)" />
      </ElFormItem>
      <ElFormItem label="用地面积(㎡):" prop="landSpace">
        <ElInput type="text" v-model="form.landSpace" placeholder="请输入用地面积(㎡)" />
      </ElFormItem>
      <ElFormItem label="建筑面积(㎡):" prop="floorSpace">
        <ElInput type="text" v-model="form.floorSpace" placeholder="请输入建筑面积(㎡)" />
      </ElFormItem>
      <MapFormItem :required="true" :positon="position" @change="onChosePosition" />
      <ElFormItem prop="address">
        <ElInput type="text" v-model="form.address" placeholder="请输入地理位置" />
      </ElFormItem>
      <ElFormItem label="户型类型:" required prop="type">
        <el-radio-group class="ml-4" v-model="form.type">
          <el-radio label="1" size="large">宅基地</el-radio>
          <el-radio label="2" size="large">公寓房</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="是否有生产用地:" required prop="isProductionLand">
        <el-radio-group class="ml-4" v-model="form.isProductionLand">
          <el-radio label="1" size="large">有</el-radio>
          <el-radio label="2" size="large">无</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="规划图：" required prop="pic">
        <div class="col-wrapper">
          <div class="card-img-list">
            <ElUpload
              :list-type="'picture-card'"
              action="/api/file/type"
              :data="{
                type: 'archives'
              }"
              accept=".jpg,.png,jpeg,.pdf"
              :multiple="false"
              :file-list="relocateVerifyPic"
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
      </ElFormItem>

      <div style="font-weight: bolder">周边配套</div>
      <ElFormItem label="交通:" prop="traffic">
        <ElInput type="text" v-model="form.traffic" placeholder="请输入交通" />
      </ElFormItem>
      <ElFormItem label="商业:" prop="business">
        <ElInput type="text" v-model="form.business" placeholder="请输入商业" />
      </ElFormItem>
      <ElFormItem label="教育:" prop="education">
        <ElInput type="text" v-model="form.education" placeholder="请输入教育" />
      </ElFormItem>
      <ElFormItem label="医院:" prop="hospital">
        <ElInput type="text" v-model="form.hospital" placeholder="请输入医院" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">保存</ElButton>
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
  // ElRow,
  // ElCol,
  ElMessage,
  ElMessageBox,
  ElInput,
  // ElDatePicker,
  // ElSelect,
  // ElOption,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElOption
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { editPlacementPointApi } from '@/api/systemConfig/placementPoint-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { MapFormItem } from '@/components/Map'
import { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'
import { useValidator } from '@/hooks/web/useValidator'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: PlacementPointDtoType | null | undefined
}

interface FileItemType {
  name: string
  url: string
}
const position = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})
const onChosePosition = (ps) => {
  console.log(ps, 'ps')
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
  form.value.address = position.address
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const relocateVerifyPic = ref<FileItemType[]>([]) // 规划图列表

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const dictObj = computed(() => dictStore.getDictObj)
// console.log('obj', dictObj.value[252])
watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划

      form.value = { ...val }
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address
    } else {
      form.value = {}
    }
  },
  {
    immediate: true,
    deep: true
  }
)
// 规则校验
const { required } = useValidator()
const rules = {
  name: [required()],
  address: [required()],
  type: [required()],
  isProductionLand: [required()],
  pic: [required()]
}
const initData = () => {}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  /*nextTick(() => {
    formRef.value?.resetFields()
  })*/
}

const submit = (data: any) => {
  editPlacementPointApi(data).then(() => {
    ElMessage.success('操作成功！')
    onClose(true)
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (props.actionType === 'add') {
        let params: any = {
          ...form.value,
          ...position,
          pic: JSON.stringify(relocateVerifyPic.value || []) // 规划图
        }
        submit(params)
      } else {
        let params: any = {
          ...form.value,
          ...position,
          pic: JSON.stringify(relocateVerifyPic.value || []), // 规划图
          id: form.value.id
        }
        console.log('params', params)
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

  if (type === 'relocateVerify') {
    relocateVerifyPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
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
