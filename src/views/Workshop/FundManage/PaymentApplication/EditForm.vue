<template>
  <ElDialog
    :title="actionType === 'add' ? '新增申请' : actionType === 'edit' ? '编辑申请' : '申请详情'"
    :model-value="props.show"
    :width="1200"
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
      <ElFormItem label="申请类型:" required>
        <el-radio-group class="ml-4" v-model="form.applyType">
          <el-radio
            v-for="item in dictObj[381]"
            :label="item.value"
            size="large"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="申请名称:" required>
        <ElInput v-model="form.name" type="textarea" :rows="3" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="概算科目:" required>
        <el-radio-group class="ml-4" v-model="form.type">
          <el-radio
            v-for="item in dictObj[382]"
            :label="item.value"
            size="large"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </ElFormItem>

      <!-- <ElFormItem label="资金科目:" required>
        <ElTreeSelect
          class="!w-full"
          v-model="form.funSubjectId"
          :data="fundAccountList"
          node-key="code"
          :props="{ value: 'code', label: 'name' }"
          showCheckbox
          checkStrictly
          checkOnClickNode
        />
      </ElFormItem> -->
      <ElFormItem label="资金科目:" required>
        <ElTreeSelect
          class="!w-full"
          v-model="form.funSubjectId"
          :data="fundAccountList"
          node-key="code"
          :props="{ value: 'code', label: 'name' }"
          showCheckbox
          checkStrictly
          checkOnClickNode
        />
      </ElFormItem>
      <ElFormItem label="付款说明:" required>
        <ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label="付款对象类型:" required>
        <el-radio-group class="ml-4" v-model="form.paymentType">
          <el-radio
            v-for="item in dictObj[384]"
            :label="item.value"
            size="large"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="付款类型:" required v-if="form.paymentType == 1"> 支付 </ElFormItem>
      <ElFormItem label="付款类型:" required v-else>
        <el-radio-group class="ml-4" v-model="form.test">
          <el-radio label="1" size="large">支付</el-radio>
          <el-radio label="2" size="large">预拨</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="申请总金额:" v-if="form.paymentType == 1">123 </ElFormItem>
      <div class="table-wrap">
        <div
          class="flex items-center justify-between pb-12px"
          v-if="actionType == 'view' && form.paymentType == 1"
        >
          <div class="table-header-left">
            <span style="margin: 0 10px; font-size: 14px; font-weight: 600">专业项目合同清单</span>

            <div class="text">
              申请总金额:
              <span class="num">{{ otherDataAmount[0].amoutPrice }}</span> 元
            </div>
            <div class="text">
              审核笔数：
              <span class="num">{{ otherDataAmount[0].num }}</span> 笔
            </div>
          </div>
        </div>
      </div>
      <ElFormItem label="收款方:" v-if="form.test == 2">
        <ElSelect class="w-350px" v-model="form.source">
          <ElOption
            v-for="item in dictObj[388]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="付款对象:" v-if="actionType != 'view'">
        <ElButton type="primary" @click="girdList">选择付款对象</ElButton>
      </ElFormItem>
      <div class="table-wrap">
        <div class="flex items-center justify-between pb-12px" v-if="actionType != 'view'">
          <div class="table-header-left">
            <span style="margin: 0 10px; font-size: 14px; font-weight: 600">{{
              form.paymentType == 2 ? '付款居民名单' : '付款专业项目名单'
            }}</span>

            <div class="text">
              申请总金额:
              <span class="num">{{
                otherDataAmount[0].amoutPrice ? otherDataAmount[0].amoutPrice : 0
              }}</span>
              元
            </div>
            <div class="text">
              审核笔数：
              <span class="num">{{ otherDataAmount[0].num ? otherDataAmount[0].num : 0 }}</span> 笔
            </div>
          </div>
          <ElSpace>
            <ElButton type="primary" @click="delRow"> 清空 </ElButton>
          </ElSpace>
        </div>
        <ElTable
          :data="otherData"
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
          <ElTableColumn label="支付对象" align="center" prop="payObject" header-align="center" />
          <ElTableColumn
            label="申请金额"
            prop="contractName"
            align="center"
            header-align="center"
          />
        </ElTable>
      </div>
      <ElTable
        :data="tableData"
        :span-method="objectSpanMethod"
        style="width: 100%"
        class="mb-20"
        :border="true"
        v-if="form.paymentType == 1"
      >
        <ElTableColumn label="序号" align="center" width="80" type="index" header-align="center" />
        <ElTableColumn label="专项名称" align="center" prop="specialName" header-align="center" />
        <ElTableColumn label="合同名称" prop="contractName" align="center" header-align="center" />
        <ElTableColumn label="合同编号" prop="contractNo" align="center" header-align="center" />
        <ElTableColumn
          label="合同乙方"
          prop="contractPartyB"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="合同金额(万元)" prop="amount" align="center" header-align="center" />
        <ElTableColumn label="支付节点" prop="paymentNode" align="center" header-align="center" />
        <ElTableColumn label="申请金额" prop="applyAmount" align="center" header-align="center" />
      </ElTable>
      <div class="col-wrapper">
        <div class="col-label-required"> 申请凭证： </div>
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
      <div v-if="actionType === 'view'">
        <div class="title-2">审批流程</div>

        <div class="progress-wrapper">
          <div class="progress-list">
            <div class="progress-item" v-for="item in progressList" :key="item.name">
              <!-- <div class="left">
                <div class="icon-box">
                  <div v-if="item.isAudit === '0'" class="disabled"></div>
                  <img
                    v-if="item.isAudit === '1'"
                    src="@/assets/imgs/icon_finish.png"
                    width="18"
                    height="18"
                  />
                  <div v-if="item.isAudit === '2'" class="hollow"></div>
                </div>
                <div v-if="item.isAudit === '0' && item.type !== '5'" class="line disabled"></div>
                <div v-if="item.isAudit === '1' && item.type !== '6'" class="line"></div>
                <div
                  v-if="item.isAudit === '2' && item.type !== '5'"
                  class="line in-progress"
                ></div>
                <div v-if="item.type === '6'" class="line none"></div>
              </div> -->
              <div class="right">
                <div class="content-box">
                  <div class="content-1">
                    <div class="name">{{ item.name }}</div>
                  </div>
                  <!-- <div class="time" v-if="item.isAudit === '1' && item.type == '0'"> 待审核 </div> -->
                  <div class="time" v-if="item.isAudit === '1' && item.type !== '0'">
                    审核时间：{{ dayjs(item.auditDate).format('YYYY-MM-DD') }}
                  </div>
                  <div class="remark" v-if="item.isAudit === '1' && item.remark">
                    审核意见: {{ item.remark }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="onSubmit(formRef, 2)" v-if="actionType != 'view'"
        >暂存</ElButton
      >
      <ElButton type="primary" @click="onSubmit(formRef, 1)" v-if="actionType != 'view'"
        >提交</ElButton
      >
      <ElButton @click="onClose">取消</ElButton>
    </template>
    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
    <GirdList :show="girdDialog" @close="onFormPupClose" :type="type" @objlist="objListArr" />
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
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElRadioGroup,
  ElRadio,
  ElTreeSelect
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { addPaymentApplicationList } from '@/api/fundManage/paymentApplication-service'
import { updatePaymentApplicationList } from '@/api/fundManage/paymentApplication-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import GirdList from './Girdlist.vue'
import dayjs from 'dayjs'
import { getFundSubjectListApi } from '@/api/fundManage/common-service'
import { funFlowNodeApi } from '@/api/fundManage/paymentApplication-service'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row: null | undefined
  parmasList: any
}
// const onViewRow = () => {
//   if (form.value.id) {
//     PaymentApplicationByIdDetailApi(form.value.id, 1).then((res: any) => {
//       parmasList.value = res.funPaymentRequestFlowNodeList
//       console.log(res.funPaymentRequestFlowNodeList, '123123')
//     })
//   }
// }
// console.log(parmasList, '123123123123123123')
interface FileItemType {
  name: string
  url: string
}
const girdDialog = ref(false)
const type = ref(false)

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

console.log(dictObj)

const form = ref<any>({})
const imgUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const relocateVerifyPic = ref<FileItemType[]>([]) // 搬迁安置确认单文件列表
// const relocateOtherPic = ref<FileItemType[]>([]) // 其他附件列表
const fundAccountList = ref<any[]>([]) // 资金科目
// 获取资金科目选项列表
const getFundSubjectList = () => {
  getFundSubjectListApi().then((res: any) => {
    if (res) {
      fundAccountList.value = res.content
    }
  })
  funFlowNodeApi({ node: 1 }).then((res: any) => {
    console.log(res, '测试数据')
  })
}
watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = { ...(val as {}) }
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
const progressList = ref<any[]>([
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '财务上传凭证',
    projectId: 53,
    status: 'implementation',
    type: '0',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: ''
  },
  {
    auditDate: '2023-09-04T07:21:53.373+00:00',
    doorNo: 'jl1090011',
    id: 571944,
    isAudit: '1',
    name: '主管领导审核',
    projectId: 53,
    status: 'implementation',
    type: '1',
    uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
    remark: ''
  }
  // {
  //   auditDate: '2023-09-04T07:21:53.373+00:00',
  //   doorNo: 'jl1090011',
  //   id: 571944,
  //   isAudit: '1',
  //   name: '财务审核',
  //   projectId: 53,
  //   status: 'implementation',
  //   type: '2',
  //   uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
  //   remark: '同意'
  // },
  // {
  //   auditDate: '2023-09-04T07:21:53.373+00:00',
  //   doorNo: 'jl1090011',
  //   id: 571944,
  //   isAudit: '1',
  //   name: '分管领导审核',
  //   projectId: 53,
  //   status: 'implementation',
  //   type: '3',
  //   uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
  //   remark: '同意'
  // },
  // {
  //   auditDate: '2023-09-04T07:21:53.373+00:00',
  //   doorNo: 'jl1090011',
  //   id: 571944,
  //   isAudit: '1',
  //   name: '动迁科长审核',
  //   projectId: 53,
  //   status: 'implementation',
  //   type: '4',
  //   uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
  //   remark: '同意'
  // },
  // {
  //   auditDate: '2023-09-04T07:21:53.373+00:00',
  //   doorNo: 'jl1090011',
  //   id: 571944,
  //   isAudit: '1',
  //   name: '监督评估审核',
  //   projectId: 53,
  //   status: 'implementation',
  //   type: '5',
  //   uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
  //   remark: ''
  // },
  // {
  //   auditDate: '2023-09-04T07:21:53.373+00:00',
  //   doorNo: 'jl1090011',
  //   id: 571944,
  //   isAudit: '1',
  //   name: '动迁发起申请',
  //   projectId: 53,
  //   status: 'implementation',
  //   type: '6',
  //   uid: '4214fee0-0cf0-4c73-b418-c6f20715a114',
  //   remark: ''
  // }
])
const otherData = ref<any[]>([])
const otherDataAmount = ref<any[]>([
  {
    amoutPrice: '',
    num: ''
  }
])
const tableData = ref<any[]>([
  {
    id: 1,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 2,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 3,
    specialName: '通讯光缆',
    contractName: '迁移合同',
    contractNo: '001',
    contractPartyB: 'A公司',
    amount: 200,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '100,000'
  },
  {
    id: 4,
    specialName: '通讯光缆',
    contractName: '安装合同',
    contractNo: '001',
    contractPartyB: 'B公司',
    amount: 400,
    paymentNode: '2023年10月2日 金额：30,000元',
    applyAmount: '25,000'
  }
])
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  console.log(row, column)
  console.log(rowIndex, columnIndex)
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 1) {
    if (rowIndex === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 2) {
    if (rowIndex === 0) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 3) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 3) {
    if (rowIndex === 0) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 3) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 4) {
    if (rowIndex === 0) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 3) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 5) {
    if (rowIndex === 0) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 3) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 7) {
    if (rowIndex === 0) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 3) {
      return {
        rowspan: 1,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}
// 清空
const delRow = () => {
  otherDataAmount.value[0].amoutPrice = 0
  otherDataAmount.value[0].num = 0
  otherData.value = []
}
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
const onFormPupClose = (flag: boolean) => {
  girdDialog.value = flag
}
const objListArr = (list: any) => {
  console.log(list, otherData.value.length, '测试用的')
  otherData.value = list
  otherDataAmount.value[0].num = otherData.value.length
  otherDataAmount.value[0].amoutPrice = otherData.value.reduce(
    (c, item) => c + item.contractName * 1,
    0
  )
}
const girdList = () => {
  girdDialog.value = true
  // type.value = true
  form.value.paymentType == 2 ? (type.value = true) : (type.value = false)
}
// const detail = () => {
//   PaymentApplicationByIdDetailApi({ id }).then((res) => {
//     debugger
//     console.log('查询成功')
//   })
// }
const submit = (data: any, status?: number) => {
  if (props.actionType === 'add') {
    data.status = status
    addPaymentApplicationList(data).then(() => {
      ElMessage.success('操作成功！')
      onClose(true)
    })
  } else {
    data.status = status
    delete data.applyTypeTxt
    delete data.applyUserName
    delete data.paymentTypeTxt
    delete data.typeTxt
    delete data.gsStatusTxt
    data.gsStatus = 0
    updatePaymentApplicationList(data).then(() => {
      ElMessage.success('操作成功！')
      onClose(true)
    })
  }
  onClose(true)
}
// 提交表单
const onSubmit = debounce((formEl, status?: number) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (!relocateVerifyPic.value.length) {
        ElMessage.error('请上传申请凭证')
        return
      } else {
        let params: any = {
          ...form.value,
          paymentObjectList: [
            {
              contractId: 571923,
              nodeIds: '571919,571920',
              amount: otherDataAmount.value[0].amoutPrice
              // paymentObjectJson:
            }
          ],
          receipt: JSON.stringify(relocateVerifyPic.value || []) // 申请凭证
        }
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
  getFundSubjectList()
  // onViewRow()
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
