<template>
  <div class="table-wrap !py-12px !mt-0px empty-wrap">
    <div class="empty-head">
      <div class="title">过渡安置办理情况</div>
      <div>
        <ElSpace>
          <ElButton :icon="notHandleIcon" type="default" @click="onNoHandle" v-if="!isExcess"
            >无须办理</ElButton
          >
          <ElButton :icon="editIcon" type="primary" @click="onHandle" v-if="flag">办理</ElButton>
        </ElSpace>
        <ElSpace v-if="isExcess && isExcess === '1'">
          <ElButton :icon="printIcon" type="primary" @click="onPrintTable">打印</ElButton>
          <ElButton :icon="archivesIcon" type="default" @click="onSortSave">进度上报</ElButton>
        </ElSpace>
        <ElButton type="primary" @click="placementSave">过渡完成</ElButton>
      </div>
    </div>

    <div class="empty-cont">
      <div class="flex-center" v-if="!isExcess">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FEC44C" :size="20" />

        <div class="txt"> 该户未办理过渡安置。 </div>
      </div>
      <div class="flex-center" v-else-if="isExcess === '0'">
        <div class="txt"> 该户无须过渡安置 </div>
      </div>
      <div class="trans-box" v-else-if="isExcess === '1'">
        <div class="trans-item">
          <div class="tit">过渡去向情况</div>
          <div class="txt">过渡安置地详址：{{ form.excessAddress }}。</div>
        </div>
        <div class="trans-item">
          <div class="tit">过渡落实情况</div>
          <div class="txt"
            >过渡安置已办理。{{
              form.isComplete == '0' ? '过渡中' : form.isComplete == '1' ? '过渡完成' : '-'
            }}</div
          >
          <div v-for="(item, index) in immigrantExcessPay" :key="index">
            <div
              >第{{ item.orderNum }}批过渡时间 :
              {{ item.excessStartDate ? dayjs(item.excessStartDate).format('YYYY-MM-DD') : '' }} 至
              {{ item.excessEndDate ? dayjs(item.excessEndDate).format('YYYY-MM-DD') : '' }}。</div
            >
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="过渡安置" v-model="dialogVisible" width="700" @close="onDialogClose">
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="180px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElFormItem label="过渡安置地详址：" prop="excessAddress">
          <ElInput
            type="textarea"
            v-model="form.excessAddress"
            class="!w-full"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="过渡安置人数（人）：">
          {{ form.demographicNum }}
        </ElFormItem>
        <ElFormItem label="补偿单价（元/人·月）：">
          {{ form.compensationPrice }}
        </ElFormItem>
        <ElFormItem label=" 过渡安置补偿金额(元)：">
          {{ form.totalCompensationAmount ? form.totalCompensationAmount : '-' }}
        </ElFormItem>
        <div style="display: flex; justify-content: space-between">
          <div style="font-size: 22px">过渡安置费</div>
          <ElButton type="primary" @click="add">新增</ElButton>
        </div>
        <div
          style="border: 1px dashed #e1e4ea; margin-top: 5px"
          v-for="(item, index) in arrList"
          :key="index"
        >
          <div style="padding: 10px 2px">
            <div>第{{ item.index + 1 || item.orderNum }}批过渡安置费</div>
            <ElFormItem label="过渡开始日期：" prop="excessAddress">
              <ElDatePicker
                class="!w-full"
                v-model="item.excessStartDate"
                type="date"
                placeholder="请选择日期"
                @change="handleStartChange(index, $event)"
              />
            </ElFormItem>
            <ElFormItem label="过渡结束日期：">
              <ElDatePicker
                class="!w-full"
                v-model="item.excessEndDate"
                type="date"
                placeholder="请选择日期"
                @change="handleEndChange(index, $event)"
              />
            </ElFormItem>
            <ElFormItem label="补偿月数（个月）：">{{ item.monthNum }}</ElFormItem>
            <ElFormItem label="补偿金额（元）：">
              {{ item.compensationAmount }}
            </ElFormItem>
            <div style="display: flex; justify-content: center"
              ><ElButton type="danger" @click="del(item.index, item.id)">删除</ElButton></div
            >
          </div>
        </div>
      </ElForm>
      <template #footer>
        <ElButton @click="onDialogClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
      </template>
    </el-dialog>
    <el-dialog
      title="过渡完成"
      v-model="dialogConfirmVisible"
      width="700"
      @close="onDialogConfirmClose"
    >
      <div>是否过渡完成?</div>
      <template #footer>
        <ElButton @click="onDialogConfirmClose">取消</ElButton>
        <ElButton type="primary" @click="doSave">确认</ElButton>
      </template>
    </el-dialog>

    <OnDocumentation :door-no="doorNo" :show="trsArchivesPup" @close="onDocumentationClose" />
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="margin-bottom: 20px; font-size: 24px; font-weight: bold; text-align: center"
        >过渡安置确认单
      </h1>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item align="center" label="户主姓名" label-class-name="bbqs">
          {{ baseInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" align="center" label="户号">
          {{ baseInfo.showDoorNo }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" align="center" label="户内人口">
          {{ baseInfo.familyNum }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" align="center" label="联系方式">
          {{ baseInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" align="center" label="迁出地" :span="2">
          {{
            (baseInfo.areaCodeText || '') +
            (baseInfo.townCodeText || '') +
            (baseInfo.villageText || '')
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" :span="2" align="center">
          <div
            style="
              position: relative;
              left: -119px;
              width: 100%;
              height: 119%;
              font-size: 20px;
              /* align-items: center; */
              line-height: 75px;
              background: white;
            "
            >过渡去向情况</div
          >
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          :span="2"
          label="过渡安置地详址"
          align="center"
        >
          <template #default>
            <div style="display: flex; flex-direction: column">
              <div style="flex: 1; text-align: left">{{ form.excessAddress }} </div></div
            >
          </template>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" :span="2" label="移民户主" align="center">
          <template #default>
            <div style="display: flex; flex-direction: column">
              <div style="flex: 1; text-align: left"> </div
            ></div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          :span="2"
          label="移民工作组验收意见"
          align="center"
        >
          <template #default>
            <div style="display: flex; flex-direction: column">
              <div style="flex: 1">&nbsp;</div>
              <div style="flex: 1; display: flex; justify-content: space-around">
                <div>验收人：</div><div>验收时间：</div></div
              >
            </div>
          </template>
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          :span="2"
          label="乡镇街道审核意见"
          align="center"
        >
          <template #default>
            <div style="display: flex; flex-direction: column">
              <div style="flex: 1">&nbsp;</div>
              <div style="flex: 1; display: flex; justify-content: space-around">
                <div>审核人：</div><div>审核时间：</div></div
              >
            </div>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed, toRaw } from 'vue'
import {
  ElSpace,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElMessage,
  FormRules,
  ElDescriptions,
  ElDescriptionsItem
} from 'element-plus'
import dayjs from 'dayjs'
import { useValidator } from '@/hooks/web/useValidator'
import { useIcon } from '@/hooks/web/useIcon'
import OnDocumentation from './OnDocumentation.vue'
import {
  getTransitionInfoApi,
  saveTransitionInfoApi,
  completeApi
} from '@/api/immigrantImplement/vacate/transition-service'
import { debounce } from '@/utils/index'
import { htmlToPdf } from '@/utils/ptf'
interface PropsType {
  doorNo: string
  baseInfo: any
}
import { useAppStore } from '@/store/modules/app'
import { getHouseVacateInfoApi } from '@/api/immigrantImplement/vacate/house-service'
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const props = defineProps<PropsType>()
const notHandleIcon = useIcon({ icon: 'ant-design:stop-outlined' })
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const printIcon = useIcon({ icon: 'ant-design:printer-outlined' })
const archivesIcon = useIcon({ icon: 'ant-design:container-outlined' })

const isExcess = ref<null | '0' | '1'>(null) //0 无须办理 1确认办理 -1默认状态
const startTime = ref<string>('')
const endTime = ref<string>('')
const form = ref<any>({
  excessAddress: '',
  // excessStartDate: '',
  // excessEndDate: '',
  demographicNum: '',
  compensationPrice: '',
  totalCompensationAmount: '',
  excessDateEndFlag: '',
  isExcess: '',
  immigrantExcessPayList: []
})
const dialogVisible = ref<boolean>(false)
const dialogConfirmVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const trsArchivesPup = ref<boolean>(false)
const startMonth = ref<any>()
const endMonth = ref<any>()
const monthNum = ref<any>()
const immigrantExcessPay = ref<any>()
// const totalCompensationAmount = ref<any>()
// const compensationAmount = ref<any>()
const immigrantExcessPayListLength = ref<any>()
const targ = ref<any>(false)
const time = ref<any>()
const { required } = useValidator()

const rules = reactive<FormRules>({
  excessAddress: [required()],
  excessStartDate: [required()]
})

const flag = ref<boolean>(true)
const inits = async () => {
  const res = await getHouseVacateInfoApi(props.doorNo)
  // .format('YYYY-MM-DD')
  time.value = res.houseEmptyDate ? dayjs(res.houseEmptyDate) : ''
  console.log(time.value, '测试腾空时间')
}
onMounted(() => {
  init()
  inits()
})
const arrList = ref<any>([])
const displayWithIsDeleteArrList = ref<any>([])
const placementSave = async () => {
  dialogConfirmVisible.value = true
}
const init = async () => {
  const res = await getTransitionInfoApi(props.doorNo)
  immigrantExcessPay.value = res.immigrantExcessPayList
  immigrantExcessPayListLength.value = res.immigrantExcessPayList
    ? res.immigrantExcessPayList.filter((item) => item.isDelete == 0).length
    : 0
  console.log(res, immigrantExcessPayListLength.value, 'res')
  if (res) {
    // const timeStart = res.excessStartDate ? dayjs(res.excessStartDate).format('YYYY-MM-DD') : ''
    // const timeEnd = res.excessEndDate ? dayjs(res.excessEndDate).format('YYYY-MM-DD') : ''
    form.value = {
      excessAddress: res.excessAddress || '',
      // excessStartDate: timeStart,
      // excessEndDate: timeEnd,
      id: res.id,
      uid: res.uid,
      ...res
    }
    isExcess.value = res.isExcess
    arrList.value = res.immigrantExcessPayList ? res.immigrantExcessPayList : []
    displayWithIsDeleteArrList.value = res.immigrantExcessPayList ? res.immigrantExcessPayList : []
    // console.log()
    // startTime.value = timeStart
    // endTime.value = timeEnd
  }
}

const onHandle = () => {
  dialogVisible.value = true
}

const onNoHandle = () => {
  isExcess.value = '0'
  flag.value = false
  handleSave()
}

const onSortSave = () => {
  trsArchivesPup.value = true
}

const onDocumentationClose = () => {
  trsArchivesPup.value = false
}

const onPrintTable = () => {
  console.log('打印')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf('#anztable', '过渡安置确认单', false)
  })
}

const onDialogClose = () => {
  dialogVisible.value = false
  init()
}
const onDialogConfirmClose = () => {
  dialogConfirmVisible.value = false
}
const handleSave = async (data?: any) => {
  let params: any = {
    doorNo: props.doorNo,
    isExcess: isExcess.value,
    ...data
  }
  console.log(params, props.doorNo, '传输的是什么')
  // if (data) {
  //   params.excessAddress = data.excessAddress
  //   params.excessStartDate = data.excessStartDate ? dayjs(data.excessStartDate) : ''
  //   params.excessEndDate = data.excessEndDate ? dayjs(data.excessEndDate) : ''
  //   params.id = data.id
  //   params.uid = data.uid
  // }
  params.doorNo = props.doorNo
  params.isExcess = isExcess.value
  params.projectId = projectId
  params.status = 'implementation'
  console.log(toRaw(params.immigrantExcessPayList).length, '长度')
  params.isComplete =
    toRaw(params.immigrantExcessPayList).length > immigrantExcessPayListLength.value ? '0' : '1'
  console.log(form.value, '11111111111')
  console.log(params, 'params')
  const res = await saveTransitionInfoApi(params)
  if (res) {
    ElMessage.success('保存成功！')
    targ.value = false
    onDialogClose()
    init()
  }
}
const addMonthsToDate = (dateString, monthsToAdd) => {
  // 将字符串转换为Date对象
  let date = new Date(dateString)

  // 设置新的月份，注意月份是从0开始的
  let newMonth = (date.getMonth() + monthsToAdd) % 12
  let newYear = date.getFullYear() + Math.floor((date.getMonth() + monthsToAdd) / 12)

  // 如果newMonth为负数，表示需要回退一年并增加月份
  if (newMonth < 0) {
    newMonth += 12
    newYear--
  }

  // 设置新的年份和月份
  date.setFullYear(newYear, newMonth, date.getDate())

  // 如果月份变更后日期不存在（例如2月30日），则会自动调整为该月的最后一天

  // 将修改后的日期转换回ISO 8601格式的字符串
  return date.toISOString().split('.')[0] + 'Z' // 去除毫秒部分
}
const add = () => {
  console.log(
    arrList.value,
    'arrList.value',
    displayWithIsDeleteArrList.value,
    'displayWithIsDeleteArrList.value'
  )
  let i = 0
  arrList.value.push({
    index: arrList.value.length,
    excessStartDate:
      arrList.value.length == 0
        ? time.value
        : addMonthsToDate(arrList.value[arrList.value.length - 1].excessEndDate, 1), //开始日期
    excessEndDate: '', //结束日期
    monthNum: '', //补偿月数
    compensationAmount: '', //补偿金额
    orderNum: '',
    isDelete: 0
  })
  // displayWithIsDeleteArrList.value = [...displayWithIsDeleteArrList.value, ...arrList.value]
  displayWithIsDeleteArrList.value = arrList.value
  console.log(displayWithIsDeleteArrList.value, '数组')
  // displayWithIsDeleteArrList.value.push({
  //   index: displayWithIsDeleteArrList.value.length,
  //   excessStartDate: '', //开始日期
  //   excessEndDate: '', //结束日期
  //   monthNum: '', //补偿月数
  //   compensationAmount: '', //补偿金额
  //   orderNum: '',
  //   isDelete: 0
  // })
}
const del = (index, id) => {
  console.log(index, '索引')
  if (index >= 0) {
    arrList.value[index].isDelete = 1
    displayWithIsDeleteArrList.value[index].isDelete = 1
    arrList.value = arrList.value.filter((item) => item.isDelete != 1)
    console.log(arrList.value, '前端删除')
  } else if (id) {
    displayWithIsDeleteArrList.value.forEach((item) => {
      if (id == item.id) {
        item.isDelete = 1
      }
    })
    // displayWithIsDeleteArrList.value = arrList.value
    arrList.value = arrList.value.filter((item) => item.isDelete != 1)
    console.log(displayWithIsDeleteArrList.value, arrList.value, '后端数据删除')
    targ.value = true
  }
  form.value.totalCompensationAmount = arrList.value.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.compensationAmount
  }, 0)
}
const onSubmit = (formEl: any) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      // if (targ.value) {
      //   form.value.immigrantExcessPayList = displayWithIsDeleteArrList.value
      // } else {
      //   form.value.immigrantExcessPayList = arrList.value
      // }
      form.value.immigrantExcessPayList = displayWithIsDeleteArrList.value
      const params = {
        ...form.value
      }
      isExcess.value = '1'
      params.immigrantExcessPayList.forEach((item) => {
        item.excessStartDate = item.excessStartDate ? dayjs(item.excessStartDate) : ''
        item.excessEndDate = item.excessEndDate ? dayjs(item.excessEndDate) : ''
        // if (new Date(item.excessStartDate) > new Date(item.excessEndDate)) {
        //   ElMessage.error('开始日期不得大于结束日期')
        //   return false
        // }
        console.log(item.excessStartDate, item.excessEndDate, '日期数据')
      })
      console.log(params, '提交数据')
      let targ = params.immigrantExcessPayList.every(
        (item) => new Date(item.excessStartDate) < new Date(item.excessEndDate)
      )
      if (!targ) {
        ElMessage.error('开始日期不得大于结束日期')
        return
      }
      // return
      handleSave(params)
      dialogVisible.value = false
    } else {
      ElMessage.error('必填项未填写完整!')
    }
  })
}
const handleStartChange = (index, value) => {
  let date = new Date(value)
  startMonth.value = date.getMonth() + 1 // getMonth() 返回的月份是从0开始的，所以需要+1
  console.log(startMonth.value, endMonth.value, '选中的月份')
  // if (!endMonth.value) {
  let date1 = new Date(arrList.value[index].excessEndDate)
  endMonth.value = date1.getMonth() + 1
  // }
  if (startMonth.value && endMonth.value) {
    arrList.value[index].monthNum = endMonth.value - startMonth.value + 1
    arrList.value[index].compensationAmount =
      form.value.demographicNum * form.value.compensationPrice * arrList.value[index].monthNum
    form.value.totalCompensationAmount = arrList.value.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.compensationAmount
    }, 0)
    arrList.value[index].orderNum = index + 1
  } else {
    arrList.value[index].monthNum = ''
  }
}
const handleEndChange = (index, value) => {
  console.log(arrList.value[index].excessStartDate, '开始时间')
  let date = new Date(value)
  endMonth.value = date.getMonth() + 1 // getMonth() 返回的月份是从0开始的，所以需要+1
  console.log(endMonth.value, startMonth.value, '选中的月份')
  // if (!startMonth.value) {
  let date1 = new Date(arrList.value[index].excessStartDate)
  startMonth.value = date1.getMonth() + 1
  // }
  if (startMonth.value && endMonth.value) {
    console.log(endMonth.value, startMonth.value, '测试数据')
    arrList.value[index].monthNum = endMonth.value - startMonth.value + 1
    arrList.value[index].compensationAmount =
      form.value.demographicNum * form.value.compensationPrice * arrList.value[index].monthNum
    form.value.totalCompensationAmount = arrList.value.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.compensationAmount
    }, 0)
    arrList.value[index].orderNum = index + 1
  } else {
    arrList.value[index].monthNum = ''
  }
}
const doSave = async () => {
  console.log('过度完成')
  const res = await completeApi(props.doorNo)
  console.log(res, 'res')
  if (res) {
    ElMessage.success('过渡完成')
    init()
    dialogConfirmVisible.value = false
  }
}
</script>

<style scoped lang="less">
.empty-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}

.empty-cont {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 14px;

  .flex-center {
    display: flex;
    align-items: center;
  }

  .txt {
    margin-left: 10px;
    color: #171717;
  }
}

.trans-box {
  padding: 40px;
}

.trans-item {
  margin-bottom: 20px;

  .tit {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
    color: #171717;
  }

  .txt {
    padding-left: 20px;
    font-size: 14px;
    color: #171717;
  }
}

:deep(.bbqs) {
  background: #ffffff !important;
}

#anztable {
  :deep(td) {
    height: 100px;
    border: 1px solid black;
  }
}
</style>
