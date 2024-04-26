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
          <ElButton :icon="printIcon" type="primary" @click="onPrintTable">打印报表</ElButton>
          <ElButton :icon="archivesIcon" type="default" @click="onSortSave">进度汇报</ElButton>
        </ElSpace>
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
            >过渡安置已办理，过渡时间：{{ `${startTime || '-'} 至 ${endTime || '-'}` }}。</div
          >
        </div>
      </div>
    </div>

    <el-dialog title="过渡安置" v-model="dialogVisible" width="500" @close="onDialogClose">
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="150px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElFormItem label="过渡安置地详址" prop="excessAddress">
          <ElInput
            type="textarea"
            v-model="form.excessAddress"
            class="!w-full"
            placeholder="请输入"
          />
        </ElFormItem>
        <ElFormItem label="过渡开始日期" prop="excessStartDate">
          <ElDatePicker
            class="!w-full"
            v-model="form.excessStartDate"
            type="date"
            placeholder="请选择日期"
          />
        </ElFormItem>
        <ElFormItem label="过渡结束日期" prop="excessEndDate">
          <ElDatePicker
            class="!w-full"
            v-model="form.excessEndDate"
            type="date"
            placeholder="请选择日期"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="onDialogClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
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
          过渡去向情况
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
import { onMounted, ref, reactive } from 'vue'
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
  saveTransitionInfoApi
} from '@/api/immigrantImplement/vacate/transition-service'
import { debounce } from '@/utils/index'
import { htmlToPdf } from '@/utils/ptf'
interface PropsType {
  doorNo: string
  baseInfo: any
}

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
  excessStartDate: '',
  excessEndDate: ''
})
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const trsArchivesPup = ref<boolean>(false)

const { required } = useValidator()

const rules = reactive<FormRules>({
  excessAddress: [required()],
  excessStartDate: [required()]
})

const flag = ref<boolean>(true)
onMounted(() => {
  init()
})

const init = async () => {
  const res = await getTransitionInfoApi(props.doorNo)
  console.log(res, 'res')
  if (res) {
    const timeStart = res.excessStartDate ? dayjs(res.excessStartDate).format('YYYY-MM-DD') : ''
    const timeEnd = res.excessEndDate ? dayjs(res.excessEndDate).format('YYYY-MM-DD') : ''
    form.value = {
      excessAddress: res.excessAddress || '',
      excessStartDate: timeStart,
      excessEndDate: timeEnd,
      id: res.id
    }
    isExcess.value = res.isExcess
    startTime.value = timeStart
    endTime.value = timeEnd
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
}

const handleSave = async (data?: any) => {
  let params: any = {
    doorNo: props.doorNo,
    isExcess: isExcess.value
  }
  if (data) {
    params.excessAddress = data.excessAddress
    params.excessStartDate = data.excessStartDate ? dayjs(data.excessStartDate) : ''
    params.excessEndDate = data.excessEndDate ? dayjs(data.excessEndDate) : ''
    params.id = data.id
  }
  console.log(form.value, '11111111111')
  const res = await saveTransitionInfoApi(params)
  if (res) {
    ElMessage.success('保存成功！')
    onDialogClose()
  }
}

const onSubmit = (formEl: any) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const params = {
        ...form.value
      }
      isExcess.value = '1'
      startTime.value = params.excessStartDate
        ? dayjs(params.excessStartDate).format('YYYY-MM-DD')
        : ''
      endTime.value = params.excessEndDate ? dayjs(params.excessEndDate).format('YYYY-MM-DD') : ''
      handleSave(params)
    }
  })
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
</style>
