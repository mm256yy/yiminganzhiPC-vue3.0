<template>
  <WorkContentWrap>
    <!-- 择址确认 —— 生产用地 -->
    <!-- 安置方式 settingWay: 1 农业安置 -->
    <div class="table-wrap !py-12px !mt-0px" v-if="len > 0">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="saveIcon"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <div class="formBox">
        <ElForm
          class="form"
          ref="formRef"
          :model="form"
          label-width="120px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">生产用地区块</span>
          </div>

          <ElRow>
            <ElCol :span="24">
              <ElFormItem label="区块：">
                {{ getSettleAddress(form.settleAddress) }}
              </ElFormItem>
            </ElCol>
          </ElRow>

          <div class="titleBox">
            <span class="text">择地结果录入</span>
          </div>

          <ElRow>
            <ElCol :span="12">
              <ElFormItem label="地块编号：" prop="landNo">
                <ElSelect
                  class="!w-250px"
                  v-model="form.landNo"
                  multiple
                  filterable
                  placeholder="请选择"
                >
                  <ElOption
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    :disabled="item.isOccupy === '1'"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="土地面积(亩)：" prop="landArea">
                <ElInputNumber
                  placeholder="请输入"
                  :min="0"
                  :precision="2"
                  v-model="form.landArea"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>

          <div class="titleBox">
            <span class="text">相关附件</span>
          </div>

          <ElRow>
            <ElCol :span="24">
              <ElFormItem label="附件上传：">
                <div class="card-img-list">
                  <ElUpload
                    action="/api/file/type"
                    :data="{
                      type: 'image'
                    }"
                    :on-error="onError"
                    :list-type="'picture-card'"
                    accept=".jpg,.jpeg,.png"
                    :multiple="true"
                    :file-list="landPic"
                    :headers="headers"
                    :on-success="uploadFileChange"
                    :before-remove="beforeRemove"
                    :on-remove="removeFile"
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
        </ElForm>
      </div>
    </div>

    <div class="table-wrap !py-12px !mt-0px no-data" v-else>
      该户未选择农业安置，无需办理生产用地
    </div>

    <ElDialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </ElDialog>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref, onMounted } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElButton,
  ElSpace,
  ElFormItem,
  ElSelect,
  ElOption,
  ElForm,
  ElRow,
  ElCol,
  ElInputNumber,
  ElUpload,
  ElDialog
} from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { useAppStore } from '@/store/modules/app'
import {
  getImmigrantLandApi,
  saveImmigrantLandApi
} from '@/api/immigrantImplement/siteConfirmation/prodLand-service'
import { getChooseConfigApi } from '@/api/immigrantImplement/siteConfirmation/common-service'
import { resettleArea } from '../../config'
import { getPlacementPointListApi } from '@/api/systemConfig/placementPoint-service'
import { getProduceListApi } from '@/api/immigrantImplement/resettleConfirm/produce-service'
interface PropsType {
  doorNo: string
  baseInfo: any
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const appStore = useAppStore()
const rules = ref()
// const printIcon = useIcon({ icon: 'ion:print-outline' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const form = ref<any>({})
const landPic = ref<FileItemType[]>([])
const imgUrl = ref<string>('')
const dialogVisible = ref(false)

const emit = defineEmits(['updateData'])

const options = ref<any[]>([])
const len = ref<any>()
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

// 初始化页面数据
const initData = () => {
  getImmigrantLandApi(props.doorNo).then((res: any) => {
    form.value = {
      ...res,
      landNo: res.landNo ? res.landNo.split(',') : []
    }
    if (form.value.landPic) {
      landPic.value = JSON.parse(form.value.landPic)
    }
  })
}

/**
 * 获取安置区块
 * @param data
 */
let apartmentArea: any = []
const getSettleAddressList = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '2',
    size: 9999,
    page: 0
  }
  try {
    const result = await getPlacementPointListApi(params)
    apartmentArea = result.content
    console.log(props.baseInfo, '测试数据')
  } catch {}
}

// 获取生产安置数据
const getdemographicList = async () => {
  const params = {
    doorNo: props.baseInfo.doorNo,
    projectId: props.baseInfo.projectId,
    status: props.baseInfo.status,
    populationNature: '5',
    size: 9999,
    page: 0
  }
  // try {
  const result = await getProduceListApi(params)
  len.value = result.content.filter((item: any) => item.settingWay === '1').length
  console.log(len.value, '测试人物数据')
  // } catch {}
}

const getSettleAddress = async (data: string) => {
  if (data) {
    // 选择了公寓房的安置方式
    if (props.baseInfo.houseAreaType === 'flat') {
      let str = ''
      apartmentArea.map((item: any) => {
        if (item.id == data) {
          str = item.name
        }
      })
      return str
    } else {
      let m = await resettleArea()
      let str = ''
      m.map((item: any) => {
        if (item.code === data) {
          str = item.name
        }
      })
      return str
    }
  } else {
    return ''
  }
}

// 获取地块编号配置数据
const getChooseConfig = (settingAddress?: string) => {
  const params = {
    projectId: props.baseInfo.projectId,
    type: 1,
    settingAddress
  }
  getChooseConfigApi(params).then((res: any) => {
    options.value = res.content
  })
}

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

  landPic.value = list
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

// 保存
const onSave = () => {
  let params = {
    ...form.value,
    doorNo: props.doorNo,
    landNo: form.value.landNo ? form.value.landNo.toString() : '',
    landPic: landPic.value ? JSON.stringify(landPic.value) : ''
  }
  saveImmigrantLandApi(params).then(() => {
    ElMessage.success('操作成功！')
    emit('updateData')
  })
}

onMounted(async () => {
  getSettleAddressList()
  initData()
  getChooseConfig()
  getdemographicList()
})
</script>
<style lang="less" scoped>
.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
