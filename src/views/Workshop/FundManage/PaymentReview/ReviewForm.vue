<template>
  <ElDialog
    :title="actionType === 'edit' ? '资金审核' : '资金详情'"
    :model-value="props.show"
    :width="1000"
    @close="onClose"
    alignCenter
    :closeOnClickModal="false"
  >
    <ElForm class="form" ref="formRef" :model="form" label-width="124px" :label-position="'right'">
      <ElRow>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">申请类型:</div>
            <div class="content">{{ form.applyTypeTxt }}</div>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">申请名称:</div>
            <div class="content">{{ form.name }}</div>
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">申请人:</div>
            <div class="content">{{ form.applyUserName }}</div>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">付款说明:</div>
            <div class="content">{{ form.remark }}</div>
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">概算科目:</div>
            <div class="content">{{ form.type === '1' ? '概算内' : '概算外' }}</div>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">资金科目:</div>
            <div class="content">{{ getTreeName(fundAccountList, form.funSubjectId) }}</div>
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">付款对象类型:</div>
            <div class="content">{{ form.paymentType === '1' ? '专业项目' : '其他' }}</div>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">付款类型:</div>
            <div class="content">{{ form.payType === '1' ? '支付' : '预拔' }}</div>
          </div>
        </ElCol>
      </ElRow>

      <ElRow>
        <!-- <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">收款方:</div>
            <div class="content">{{ form.payee ? fmtDict(dictObj[396], form.payee) : '-' }}</div>
          </div>
        </ElCol> -->
        <ElCol :span="12">
          <div class="col-wrap">
            <div class="label">申请总金额:</div>
            <div class="content">{{ form.amount }} 元</div>
          </div>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <div class="col-wrap">
            <div class="label">付款对象:</div>
            <!-- <div class="content">境岭镇</div> -->
            <!-- <div class="content">{{ form.type == 1 ? '支付' : '预拨' }}</div> -->
          </div>
        </ElCol>
      </ElRow>
      <div class="title-1">
        <!-- <span class="main-title">专业项目合同清单</span> -->
        申请总金额：{{ parmasList.amount }}<span class="num"></span> 元 申请户数：<span
          class="num"
          >{{ parmasList.paymentObjectList ? parmasList.paymentObjectList?.length : 0 }}</span
        >
        户
      </div>
      <ElTable
        :data="parmasList.paymentObjectList"
        style="width: 100%"
        class="mb-20"
        :border="true"
        v-if="form.paymentType == 2"
      >
        <ElTableColumn
          label="序号"
          align="center"
          width="80"
          type="index"
          header-align="center"
          prop="index"
        />
        <ElTableColumn label="支付对象" align="center" prop="contractId" header-align="center">
          <template #default="{ row }">
            {{ fmtDict(dictObj[393], row.contractId.toString()) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="申请金额" prop="amount" align="center" header-align="center" />
      </ElTable>
      <ElTable
        :data="parmasList.professionalContractList"
        style="width: 100%"
        class="mb-20"
        :border="true"
        v-if="form.paymentType == 1"
      >
        <ElTableColumn label="序号" align="center" width="80" type="index" header-align="center" />
        <ElTableColumn label="专项名称" align="center" prop="projectName" header-align="center" />
        <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
        <ElTableColumn label="合同编号" prop="contractCode" align="center" header-align="center" />
        <!-- <ElTableColumn
          label="合同乙方"
          prop="contractPartyB"
          align="center"
          header-align="center"
        /> -->
        <ElTableColumn
          label="合同金额(万元)"
          prop="contractAmount"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="支付节点"
          prop="nodeDtoList"
          align="center"
          header-align="center"
          width="200"
        >
          <template #default="scope">
            <div v-for="(item, index) in scope.row.nodeDtoList" :key="index">{{
              formatDate(item.paymentDate) + ' ' + '金额:' + item.amount + '元'
            }}</div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="申请金额" prop="amount" align="center" header-align="center">
          <template #default="{ $index }">
            <div> {{ parmasList.paymentObjectList[$index]?.amount }} </div>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="col-wrapper">
        <div> 申请凭证： </div>
        <div class="card-img-list">
          <ElUpload
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'archives'
            }"
            accept=".jpg,.png,jpeg,.pdf"
            :multiple="false"
            :file-list="parmasList.receipt ? JSON.parse(parmasList.receipt) : []"
            :headers="headers"
            :on-error="onError"
            :on-success="uploadFileChange1"
            :before-remove="beforeRemove"
            :on-remove="removeFile1"
            :on-preview="imgPreview"
            :disabled="true"
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
      <div v-if="userInfo == 'financevoucher'">
        <ElRow>
          <ElCol :span="24" style="margin-top: 20px">
            <div class="col-wrap">
              <div class="label">付款日期</div>
              <ElDatePicker
                v-model="formAudit.paymentTime"
                type="date"
                placeholder="请选择日期"
                :size="size"
              />
            </div>
          </ElCol>
        </ElRow>
        <div class="col-wrapper">
          <div class="col-label-required"> 财务凭证： </div>
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
      </div>
      <ElRow v-if="actionType === 'edit'" style="margin-top: 20px">
        <ElCol :span="24">
          <div class="col-wrap">
            <div class="label">审核意见</div>
            <div class="content">
              <ElInput
                v-model="formAudit.remark"
                :rows="4"
                type="textarea"
                class="!w-600px"
                placeholder="请输入"
              />
            </div>
          </div>
        </ElCol>
        <ElCol :span="24">
          <div class="col-wrap">
            <div class="label"> </div>
            <div class="content">
              <ElButton type="primary" @click="onSubmit('1')" :loading="btnLoading">通过</ElButton>
              <ElButton
                @click="onSubmit('0')"
                v-show="userInfo != 'financevoucher'"
                :loading="btnLoading"
                >驳回</ElButton
              >
            </div>
          </div>
        </ElCol>
      </ElRow>
    </ElForm>
    <div v-if="actionType === 'view'">
      <div class="title-2">审批流程</div>

      <div class="progress-wrapper">
        <div class="progress-list">
          <div
            class="progress-item"
            v-for="(item, index) in parmasList.funPaymentRequestFlowNodeList"
            :key="index"
          >
            <div class="left">
              <div class="icon-box">
                <div class="disabled"></div>
                <img
                  v-if="item.status == 1"
                  src="@/assets/imgs/icon_finish.png"
                  width="18"
                  height="18"
                />
                <img
                  v-if="item.status == 0"
                  src="@/assets/imgs/icon_error.png"
                  width="18"
                  height="18"
                />
              </div>
              <div
                class="line"
                v-if="index == parmasList.funPaymentRequestFlowNodeList?.length - 1"
                style="background: white"
              ></div>
              <div class="line" v-else></div>
            </div>
            <div class="right">
              <div class="content-box">
                <div class="content-1">
                  <div class="name">{{ item.name }}</div>
                </div>
                <!-- <div class="time" v-if="item.isAudit === '1' && item.type == '0'"> 待审核 </div> -->
                <div class="time" v-if="item.status">
                  {{ index == 0 ? '提交时间：' : '审核时间:'
                  }}{{
                    index == 0
                      ? dayjs(parmasList.createdDate).format('YYYY-MM-DD HH:mm:ss')
                      : dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                  }}
                </div>
                <!-- <div class="remark"> 审核意见: {{ item.status == 1 ? '通过' : '驳回' }} </div> -->
                <div class="remark" v-if="item.status">
                  审核意见: {{ index == 0 ? '发起申请' : item.remark }}
                </div>
                <div
                  style="display: flex"
                  v-if="index == 6 && item.receipt && item.receipt != '[]'"
                >
                  财务凭证:
                  <img :src="JSON.parse(item.receipt)[0]?.url" style="height: 200px" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
  <ElDialog v-model="dialogVisible" :z-index="999" appendToBody>
    <img w-full :src="imgUrl" alt="Preview Image" />
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElUpload,
  ElInput,
  ElMessage,
  ElButton,
  UploadFile,
  UploadFiles,
  ElMessageBox,
  ElDatePicker,
  FormInstance
} from 'element-plus'
import { ref, watch, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import { getPaymentReviewListSSApi } from '@/api/fundManage/paymentApplication-service'
import { useAppStore } from '@/store/modules/app'
import { fmtDict } from '@/utils'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import { formatDate } from '@/utils/index'
const formRef = ref<FormInstance>()

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const size = ref<'default' | 'large' | 'small'>('default')
interface PropsType {
  actionType: 'add' | 'edit' | 'view'
  show: any
  row?: LandlordDtoType | null | undefined
  parmasList: any
}

interface FileItemType {
  name: string
  url: string
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const btnLoading = ref<boolean>(false)
const relocateVerifyPic = ref<FileItemType[]>([]) // 搬迁安置确认单文件列表
const form = ref<any>({})
const formAudit = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const appStore: any = useAppStore()
const currentProjectId = appStore.currentProjectId
const userInfo: any = computed(() => {
  if (appStore.getUserInfo) {
    const project = appStore.getUserInfo.projectUsers.find(
      (x: any) => x.projectId === currentProjectId
    )
    const role = project.roles[0].code

    // 默认用户拥有一个角色 角色选择先不考虑
    return role
  }
  return ''
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      relocateVerifyPic.value = props.parmasList.financeReceipt
        ? JSON.parse(props.parmasList.financeReceipt)
        : []
      console.log(val, 'bbq')

      form.value = { ...val }
      formAudit.value = { ...val }
      // position.longitude = form.value.longitude
      // position.latitude = form.value.latitude
      // position.address = form.value.address
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const fundAccountList = ref<any[]>([]) // 资金科目
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
}
const getTreeName = (list: any, code: any) => {
  if (!list) {
    return ''
  }

  for (let i = 0; i < list.length; i++) {
    let a = list[i]
    if (a.code == code) {
      return a.name
    } else {
      if (a.children && a.children.length > 0) {
        let res = getTreeName(a.children, code)
        if (res) {
          return res
        }
      }
    }
  }
}
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}

// 处理函数
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
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
}
// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}

// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'relocateVerify')
}

const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onSubmit = async (status: string) => {
  if (userInfo.value == 'financevoucher' && !formAudit.value.paymentTime) {
    ElMessage.error('请选择付款时间')
    return
  }
  if (userInfo.value == 'financevoucher' && relocateVerifyPic.value?.length <= 0) {
    ElMessage.error('请选择财务凭证')
    return
  }
  console.log(relocateVerifyPic.value, '测试数据')
  btnLoading.value = true
  let params: any = {
    ...formAudit.value,
    businessId: form.value.id,
    status: status,
    type: 1, //付款申请
    receipt:
      relocateVerifyPic.value.length > 0 ? JSON.stringify(relocateVerifyPic.value || []) : null // 申请凭证
  }

  try {
    await getPaymentReviewListSSApi(params)
    ElMessage.success('操作成功！')
    onClose()
    btnLoading.value = false
  } catch (error) {
    ElMessage.error('操作失败')
    btnLoading.value = false
  }
}

// 关闭弹窗
const onClose = () => {
  // for (let i in formAudit.value) {

  // }
  formAudit.value = {}
  relocateVerifyPic.value = []
  emit('close')
  // nextTick(() => {
  //   formRef.value?.resetFields()
  // })
}
onMounted(() => {
  getFundSubjectList()
})
</script>

<style lang="less">
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
    display: inline-flex;
    width: 100px;
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

.col-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  .label {
    width: 100px;
    margin-right: 10px;
  }
}

.title-1 {
  display: flex;
  margin: 10px 0 20px 0;
  font-size: 14px;
  color: #333;
  align-items: center;

  .main-title {
    margin-right: 20px;
    font-size: 16px;
    font-weight: bold;
  }

  .num {
    font-weight: bold;
  }
}

.title-2 {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.progress-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 100px;
  box-sizing: border-box;

  .progress-list {
    display: flex;
    flex-direction: column;

    .progress-item {
      display: flex;

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;

          .hollow {
            width: 18px;
            height: 18px;
            border: 1px solid #3e73ec;
            border-radius: 9px;
          }

          .disabled {
            width: 18px;
            height: 18px;
            background-color: #ebebeb;
            border-radius: 9px;
          }
        }

        .line {
          width: 2px;
          height: 124px;
          background-color: #3e73ec;

          &.in-progress {
            height: 74px;
          }

          &.disabled {
            height: 74px;
            background-color: #ebebeb;
          }

          &.none {
            height: 74px;
            background-color: #fff;
          }
        }
      }

      .right {
        width: 570px;
        padding-bottom: 16px;

        .content-box {
          width: 570px;
          padding: 21px 16px;
          border: 1px solid #ebebeb;
          border-radius: 4px;
          box-sizing: border-box;

          &.finish {
            background: #fafafa;
          }

          .content-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
              font-size: 16px;
              color: #171718;
            }
          }

          .time {
            margin-top: 9px;
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }

          .remark {
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
    }
  }
}
</style>
