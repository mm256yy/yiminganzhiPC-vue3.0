<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑二维码' : '新增二维码'"
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
      <ElFormItem label="水库项目:" prop="projectName">
        <el-select v-model="form.projectName" placeholder="请输入水库项目">
          <el-option
            v-for="item in projectData"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
        <!-- <ElInput type="text" v-model="form.projectName" placeholder="请输入水库项目" /> -->
      </ElFormItem>
      <ElFormItem label="所属行政区域:" prop="landSpace">
        <ElTreeSelect
          ref="districtTree"
          v-model="townCode"
          lazy
          multiple
          node-key="code"
          :load="loadDistrictNode"
          :props="defaultProps"
          :style="{ width: '620px', 'margin-right': '10px' }"
          placeholder="请选择行政区域"
        />
      </ElFormItem>
      <ElFormItem label="URL:" required prop="url">
        <ElInput type="text" v-model="form.url" placeholder="请输入URL" />
      </ElFormItem>
      <ElFormItem label="备注:" required prop="remark">
        <ElInput type="text" v-model="form.remark" placeholder="请输入备注" />
      </ElFormItem>
      <div class="col-wrapper">
        <div class="col-label-required"> 二维码： </div>
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
                <!-- <div class="card-txt">点击上传</div> -->
              </div>
            </template>
          </ElUpload>
        </div>
      </div>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef, 0)" v-if="actionType == 'edit'"
        >保存</ElButton
      >
      <ElButton type="primary" @click="onSubmit(formRef, 1)" v-if="actionType == 'add'"
        >保存</ElButton
      >
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
  ElOption,
  ElTreeSelect
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
// import { editPlacementPointApi } from '@/api/systemConfig/placementPoint-service'
import { addQrcodeApi, updateQrcodeApi } from '@/api/project/qrCode/service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'
import { getDistrictChildrenApi } from '@/api/district'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: PlacementPointDtoType | null | undefined
  projectData?: any
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
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const relocateVerifyPic = ref<FileItemType[]>([]) // 二维码列表

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const dictObj = computed(() => dictStore.getDictObj)
const townCode = ref()
// console.log('obj', dictObj.value[252])
const defaultProps = {
  value: 'code',
  label: 'name',
  disabled: (node) => {
    return node && node.data && node.data.hasChild && node.level !== 3
  },
  isLeaf: (node) => {
    return node.level === 3
  }
}
const loadDistrictNode = async (node: any, resolve: any) => {
  if (node.level === 3) {
    resolve([])
    return
  }
  let parentId
  if (node && node.level == 0) {
    parentId = 0
  } else {
    parentId = node.data.id
  }
  const childrenList = await getDistrictChildrenApi(parentId)
  resolve(childrenList)
}

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = { ...val }
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address
    }
  },
  {
    immediate: true,
    deep: true
  }
)
// 规则校验
const rules = reactive<FormRules>({})

const initData = () => {}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any, status: number) => {
  // editPlacementPointApi(data).then(() => {
  //   ElMessage.success('操作成功！')
  //   onClose(true)
  // })
  if (status === 0) {
    updateQrcodeApi(data).then(() => {
      ElMessage.success('操作成功！')
      onClose(true)
    })
  } else if (status === 1) {
    addQrcodeApi(data).then(() => {
      ElMessage.success('操作成功！')
      onClose(true)
    })
  }
}

// 提交表单
const onSubmit = debounce((formEl, status: number) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (props.actionType === 'add') {
        let params: any = {
          ...form.value,
          fileUrl: JSON.stringify(relocateVerifyPic.value || []) // 二维码
        }
        console.log(params, status)
        submit(params, status)
      } else {
        let params: any = {
          ...form.value,
          fileUrl: JSON.stringify(relocateVerifyPic.value || []), // 二维码
          id: form.value.id
        }
        console.log(params, status)
        submit(params, status)
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
