<template>
  <ElDialog
    :title="actionType === 'edit' ? '核定' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="1000"
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
      label-width="190px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow>
        <!-- <ElCol :span="12">
          <ElFormItem label="新增原因" prop="addReason">
            <ElSelect clearable filterable v-model="form.addReason" class="!w-full">
              <ElOption
                v-for="item in dictObj[369]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol> -->
        <ElCol :span="12">
          <ElFormItem label="房屋编号" prop="houseNo">
            <ElInput v-model="form.houseNo" class="!w-full" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="层数" prop="storeyNumber">
            <ElInput v-model="form.storeyNumber" class="!w-full" placeholder="请输入">
              <template #append> 层 </template>
            </ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="建筑面积" prop="landArea">
            <ElInput v-model="form.landArea" class="!w-full" placeholder="请输入">
              <template #append>
                m<span style="position: absolute; top: -4px; right: 12px; font-size: 1px">2</span>
              </template>
            </ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="房屋结构" prop="constructionType">
            <ElSelect clearable filterable v-model="form.constructionType" class="!w-full">
              <ElOption
                v-for="item in dictObj[252]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="房屋性质" prop="houseNature">
            <ElInput v-model="form.houseNature" class="!w-full" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="房屋产权人" prop="demographicId">
            <ElSelect class="!w-full" v-model="form.demographicId" clearable placeholder="请选择">
              <ElOption
                v-for="item in demographicList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="共有人情况" prop="ownersSituation">
            <ElSelect
              v-model="form.ownersSituation"
              class="!w-full"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词搜素"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <ElOption
                v-for="item in landlordList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="房屋平面示意图">
            <div class="card-img-list">
              <ElUpload
                :disabled="actionType === 'view'"
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="housePic"
                :headers="headers"
                :on-error="onError"
                :on-success="uploadFileChange1"
                :before-remove="beforeRemove"
                :on-remove="removeFile1"
                :on-preview="imgPreview"
                :class="[actionType === 'view' ? 'upload' : '']"
              >
                <template #trigger v-if="actionType !== 'view'">
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/house.png" alt="" />
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
              <div
                style="display: flex; height: 88px"
                :class="[housePic.length == 0 ? 'CADuplogd' : '']"
              >
                <span style="padding: 0 12px; color: #606266">房屋平面示意图CAD格式:</span>
                <ElUpload
                  :file-list="CADfile"
                  :data="{
                    type: 'image'
                  }"
                  accept=".dwg,.dws,.dxf"
                  class="upload-demo"
                  action="/api/file/type"
                  multiple
                  :headers="headers"
                  :on-preview="previewClick"
                  :on-success="uploadFileChangeCAD"
                  :before-remove="beforeRemove"
                >
                  <template #trigger v-if="actionType !== 'view'">
                    <el-button type="primary">点击上传</el-button>
                  </template>
                </ElUpload>
              </div>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="土地证">
            <div class="card-img-list">
              <ElUpload
                :disabled="actionType === 'view'"
                :on-error="onError"
                :list-type="'picture-card'"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                accept=".jpg,.jpeg,.png"
                :multiple="false"
                :file-list="landPic"
                :headers="headers"
                :on-success="uploadFileChange2"
                :before-remove="beforeRemove"
                :on-remove="removeFile2"
                :on-preview="imgPreview"
                :class="[actionType === 'view' ? 'upload' : '']"
              >
                <template #trigger v-if="actionType !== 'view'">
                  <div class="card-img-box">
                    <img class="card-img" src="@/assets/imgs/land.png" alt="" />
                    <div class="card-txt">点击上传</div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="房屋照片">
            <div class="card-img-list">
              <ElUpload
                :disabled="actionType === 'view'"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="true"
                :file-list="homePic"
                :headers="headers"
                :on-success="uploadFileChange3"
                :before-remove="beforeRemove"
                :on-remove="removeFile3"
                :class="[actionType === 'view' ? 'upload' : '']"
                :on-preview="imgPreview"
              >
                <template #trigger v-if="actionType !== 'view'">
                  <div class="card-img-box">
                    <div class="card-img-custom">
                      <Icon icon="ant-design:plus-outlined" :size="22" />
                    </div>
                    <div class="card-txt"> 点击上传 </div>
                  </div>
                </template>
              </ElUpload>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="其他附件">
            <div class="card-img-list">
              <ElUpload
                :class="[actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :on-error="onError"
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
                <template #trigger v-if="actionType !== 'view'">
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

      <!-- 分割线 -->
      <ElRow>
        <ElDivider />
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="是否合法" prop="isCompliance">
            <ElSelect clearable filterable v-model="form.isCompliance" class="!w-full">
              <ElOption
                v-for="item in dictObj[371]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" />
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="集体土地使用权证" prop="landNo">
            <ElInput v-model="form.landNo" class="!w-full" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" />
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="房屋所有权证" prop="propertyNo">
            <ElInput v-model="form.propertyNo" class="!w-full" placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" />
      </ElRow>

      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="其他佐证材料">
            <div class="card-img-list">
              <ElUpload
                :class="[actionType === 'view' ? 'upload' : '']"
                action="/api/file/type"
                :data="{
                  type: 'image'
                }"
                :on-error="onError"
                :list-type="'picture-card'"
                accept=".jpg,.jpeg,.png"
                :multiple="true"
                :file-list="otherProofPic"
                :headers="headers"
                :on-success="uploadFileChange5"
                :before-remove="beforeRemove"
                :on-remove="removeFile5"
                :on-preview="imgPreview"
              >
                <template #trigger v-if="actionType !== 'view'">
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
    </ElForm>

    <template #footer v-if="actionType !== 'view'">
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
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElUpload,
  ElRow,
  ElCol,
  ElOption,
  ElSelect,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'

import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { addFwHouseApi, updateFwHouseApi } from '@/api/workshop/datafill/house-service'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'
import { getLandlordListApi } from '@/api/immigrantImplement/common-service'
import type { LandlordDtoType } from '@/api/immigrantImplement/common-types'
import { getDemographicListApi } from '@/api/workshop/population/service'
import type { DemographicDtoType } from '@/api/workshop/population/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row
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
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

const defaultValue: Omit<HouseDtoType, 'id'> = {
  // addReason: '', // 新增原因
  houseNo: '', // 房屋编号
  storeyNumber: '', // 层数
  landArea: '', // 建筑面积
  constructionType: '', // 房屋结构
  houseNature: '', // 房屋性质
  demographicId: '', // 房屋产权人 id
  ownersSituation: [], // 共有人情况
  housePic: '', // 房屋照片
  CADfile: '', // 房屋 CAD 图
  landPic: '', // 土地址
  homePic: '', // 房屋照片
  otherPic: '', // 其他附件
  isCompliance: '', // 是否合法
  landNo: '', // 集体土地使用权证
  propertyNo: '', // 房屋所有权(不动产权证)
  otherProofPic: '' // 其他佐证资料
}
const form = ref<Omit<HouseDtoType, 'id'>>(defaultValue)
const housePic = ref<FileItemType[]>([])
const CADfile = ref<FileItemType[]>([])
const landPic = ref<FileItemType[]>([])
const homePic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const otherProofPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const landlordList = ref<LandlordDtoType[]>([])
const demographicList = ref<DemographicDtoType[]>([])
const dialogVisible = ref<boolean>(false)
const searchLoading = ref<boolean>(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.show,
  () => {
    // 处理表单数据
    form.value = {
      ...props.row,
      demographicId: props.row?.demographicId ? String(props.row?.demographicId) : '',
      ownersSituation: props.row?.ownersSituation ? props.row?.ownersSituation.split(',') : []
    }

    housePic.value = []
    CADfile.value = []
    landPic.value = []
    homePic.value = []
    otherPic.value = []
    otherProofPic.value = []

    try {
      if (form.value.housePic) {
        housePic.value = JSON.parse(form.value.housePic)
      }

      if (form.value.houseCadPic) {
        CADfile.value = JSON.parse(form.value.houseCadPic)
      }

      if (form.value.landPic) {
        landPic.value = JSON.parse(form.value.landPic)
      }

      if (form.value.homePic) {
        homePic.value = JSON.parse(form.value.homePic)
      }

      if (form.value.otherPic) {
        otherPic.value = JSON.parse(form.value.otherPic)
      }

      if (form.value.otherProofPic) {
        otherProofPic.value = JSON.parse(form.value.otherProofPic)
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
const { required } = useValidator()
// 规则校验
const rules = reactive<FormRules>({
  // addReason: [required()],
  houseNo: [required()],
  storeyNumber: [required()],
  landArea: [required()],
  constructionType: [required()],
  houseNature: [required()],
  demographicId: [required()],
  isCompliance: [required()]
})

// 获取房屋产权人列表
const getDemographicList = () => {
  const params = {
    status: 'implementation',
    doorNo: props.doorNo
  }
  getDemographicListApi(params).then((res: any) => {
    let arr = res.content
    if (arr && arr.length) {
      demographicList.value = arr.map((item: any) => {
        return { value: `${item.id}`, label: `${item.name}` }
      })
    }
  })
}

/**
 * 获取居民户列表
 * @param query 查询参数
 */
const getLandlordList = (query?: string) => {
  getLandlordListApi({
    name: query,
    type: 'PeasantHousehold'
  }).then((res) => {
    let arr: any = res.content
    if (arr && arr.length) {
      landlordList.value = arr.map((item: any) => {
        return { value: `${item.id}`, label: `${item.name}` }
      })
    }
  })
}

const remoteMethod = (query?: string) => {
  if (query !== '') {
    searchLoading.value = true
    setTimeout(() => {
      searchLoading.value = false
      getLandlordList(query)
      landlordList.value = landlordList.value.filter((item: any) => {
        return item.label.indexOf(query) > -1
      })
    }, 200)
  } else {
    landlordList.value = []
  }
}

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = async (data: any) => {
  const { status, projectId, id } = props.baseInfo
  if (props.actionType === 'add') {
    await addFwHouseApi({
      ...data,
      doorNo: props.doorNo,
      status,
      projectId,
      householdId: id
    })
  } else {
    await updateFwHouseApi({
      ...data,
      doorNo: props.doorNo,
      status,
      projectId,
      householdId: id
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const data: any = {
        ...form.value,
        ownersSituation: form.value.ownersSituation.toString(),
        houseCadPic: JSON.stringify(CADfile.value || []),
        housePic: JSON.stringify(housePic.value || []),
        landPic: JSON.stringify(landPic.value || []),
        homePic: JSON.stringify(homePic.value || []),
        otherPic: JSON.stringify(otherPic.value || []),
        otherProofPic: JSON.stringify(otherProofPic.value || [])
      }
      submit(data)
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
          url: (fileItem.response as any)?.data || fileItem.url
        }
      })
  }

  if (type === 'house') {
    housePic.value = list
  } else if (type === 'houseCAD') {
    CADfile.value = list
  } else if (type === 'land') {
    landPic.value = list
  } else if (type === 'home') {
    homePic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  } else if (type === 'otherProof') {
    otherProofPic.value = list
  }
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const uploadFileChangeCAD = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseCAD')
}

const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}

const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
}

const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

const uploadFileChange5 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'otherProof')
}

const previewClick = (uploadFile: UploadFile) => {
  window.open(uploadFile.url)
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}

const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
}

const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

const removeFile5 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'otherProof')
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
  getDemographicList()
  getLandlordList()
})
</script>

<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
