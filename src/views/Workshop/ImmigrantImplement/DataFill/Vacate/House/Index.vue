<template>
  <div class="table-wrap !py-12px !mt-0px empty-wrap">
    <div class="empty-head">
      <div class="title">房屋腾空办理情况</div>
      <div>
        <ElSpace>
          <ElButton :icon="notHandleIcon" type="default" @click="onNoHandle" v-if="!isHouseEmpty"
            >无须办理</ElButton
          >
          <ElButton :icon="editIcon" type="primary" @click="onHandle" v-if="flag">办理</ElButton>
        </ElSpace>

        <ElSpace v-if="isHouseEmpty && isHouseEmpty === '1'">
          <ElButton :icon="printIcon" type="primary" @click="onPrintTable">打印报表</ElButton>
          <ElButton :icon="archivesIcon" type="default" @click="onSortSave">进度上报</ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="empty-cont">
      <div class="flex-center" v-if="!isHouseEmpty">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FEC44C" :size="20" />
        <div class="txt"> 房屋腾空未办理。 </div>
      </div>
      <div class="flex-center" v-else-if="isHouseEmpty === '0'">
        <div class="txt">无须房屋腾空。 </div>
      </div>
      <div class="flex-center" v-else-if="isHouseEmpty === '1'">
        <Icon icon="ant-design:check-circle-filled" color="#30A952" :size="20" />
        <div class="txt"> 房屋腾空已完成，腾空时间：{{ time }}。</div>
      </div>
    </div>

    <el-dialog title="房屋腾空" v-model="dialogVisible" width="500" @close="onDialogClose">
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="150px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElFormItem label="腾空日期" prop="houseEmptyDate">
          <ElDatePicker
            class="!w-full"
            v-model="form.houseEmptyDate"
            type="date"
            placeholder="请选择日期"
          />
        </ElFormItem>
        <ElFormItem label="意见" prop="houseEmptyOpinion">
          <ElInput
            type="textarea"
            v-model="form.houseEmptyOpinion"
            class="!w-full"
            placeholder="请输入"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="onDialogClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
      </template>
    </el-dialog>

    <OnDocumentation
      :door-no="props.doorNo"
      :show="houseArchivesPup"
      @close="onDocumentationClose"
    />
    <div style="position: fixed; left: -1000px; width: 210mm; padding: 0 40px 0 40px" id="anztable">
      <h1 style="margin-bottom: 20px; font-size: 24px; font-weight: bold; text-align: center"
        >房屋腾空确认单</h1
      >
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item
          align="center"
          :label="
            props.type == 'Enterprise'
              ? '企业名称'
              : type == 'IndividualB'
              ? '个体户名称'
              : type == 'PeasantHousehold'
              ? '户主姓名'
              : '村集体名称'
          "
          label-class-name="bbqs"
        >
          {{ baseInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          align="center"
          :label="
            props.type == 'Enterprise'
              ? '企业编码'
              : type == 'IndividualB'
              ? '个体户编码'
              : type == 'PeasantHousehold'
              ? '户号'
              : '村集体编码'
          "
        >
          {{ baseInfo.showDoorNo }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          align="center"
          label="户内人口"
          v-if="props.type == 'PeasantHousehold'"
        >
          {{ baseInfo.familyNum }}
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          align="center"
          label="联系方式"
          v-if="props.type == 'PeasantHousehold'"
        >
          {{ baseInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="bbqs" align="center" label="迁出地" :span="2">
          {{
            props.type == 'LandNoMove'
              ? baseInfo.landNumbers
              : props.type == 'PeasantHousehold'
              ? (baseInfo.areaCodeText || '') +
                (baseInfo.townCodeText || '') +
                (baseInfo.villageText || '')
              : baseInfo.beforeAddress
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
            >房屋腾空情况</div
          >
        </el-descriptions-item>
        <el-descriptions-item
          label-class-name="bbqs"
          :span="2"
          :label="
            props.type == 'Enterprise'
              ? '企业意见'
              : type == 'IndividualB'
              ? '个体户意见'
              : type == 'PeasantHousehold'
              ? '移民户主意见'
              : '村集体意见'
          "
          align="center"
        >
          <template #default>
            <div style="display: flex; flex-direction: column">
              <div style="flex: 1">{{ form.houseEmptyOpinion }}</div>
              <div style="flex: 1; text-align: left">
                {{
                  props.type == 'Enterprise'
                    ? '企业盖章'
                    : type == 'IndividualB'
                    ? '个体户盖章'
                    : type == 'PeasantHousehold'
                    ? '移民户主'
                    : '村集体盖章'
                }}:</div
              ></div
            >
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
              <div style="flex: 1; display: flex; justify-content: flex-start">
                <div style="flex: 1; text-align: left">验收人：</div>
                <div style="flex: 1; text-align: left">验收时间：</div>
              </div>
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
              <div style="flex: 1; display: flex; justify-content: flex-start">
                <div style="flex: 1; text-align: left">审核人：</div>
                <div style="flex: 1; text-align: left">审核时间：</div>
              </div>
            </div>
          </template>
        </el-descriptions-item>
      </el-descriptions></div
    >
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
  saveHouseVacateInfoApi,
  getHouseVacateInfoApi
} from '@/api/immigrantImplement/vacate/house-service'
import { debounce } from '@/utils/index'
import { htmlToPdf } from '@/utils/ptf'
interface PropsType {
  doorNo: string
  baseInfo: any
  type: any
}

const props = defineProps<PropsType>()
const notHandleIcon = useIcon({ icon: 'ant-design:stop-outlined' })
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const printIcon = useIcon({ icon: 'ant-design:printer-outlined' })
const archivesIcon = useIcon({ icon: 'ant-design:container-outlined' })
const isHouseEmpty = ref<null | '0' | '1'>(null) //0 无须办理 1确认办理 -1默认状态
const time = ref<string>('')
const form = ref<any>({
  houseEmptyOpinion: '',
  houseEmptyDate: ''
})
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const houseArchivesPup = ref<boolean>(false)

const { required } = useValidator()

const rules = reactive<FormRules>({
  houseEmptyDate: [required()],
  houseEmptyOpinion: [required()]
})
const flag = ref<boolean>(true)

onMounted(() => {
  init()
})

const init = async () => {
  console.log(props.type, 'bbq')

  const res = await getHouseVacateInfoApi(props.doorNo)
  if (res) {
    form.value = {
      houseEmptyOpinion: res.houseEmptyOpinion,
      houseEmptyDate: dayjs(res.houseEmptyDate).format('YYYY-MM-DD'),
      id: res.id,
      uid: res.uid
    }
    isHouseEmpty.value = res.isHouseEmpty
    time.value = dayjs(res.houseEmptyDate).format('YYYY-MM-DD')
  }
}

const onHandle = () => {
  dialogVisible.value = true
}

const onNoHandle = () => {
  isHouseEmpty.value = '0'
  flag.value = false
  handleSave()
}

const onSortSave = () => {
  houseArchivesPup.value = true
}

const onDocumentationClose = () => {
  houseArchivesPup.value = false
}

const onPrintTable = () => {
  console.log('打印')
  debounce(() => {
    // ElMessage.error('待业主提供模板')

    htmlToPdf('#anztable', '房屋腾空确认单', false)
  })
}

const onDialogClose = () => {
  dialogVisible.value = false
}

const handleSave = async (data?: any) => {
  let params: any = {
    doorNo: props.doorNo,
    isHouseEmpty: isHouseEmpty.value
  }
  if (data) {
    params.houseEmptyOpinion = data.houseEmptyOpinion
    params.houseEmptyDate = dayjs(data.houseEmptyDate)
    ;(params.id = data.id), (params.uid = data.uid)
  }
  const res = await saveHouseVacateInfoApi(params)
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
      isHouseEmpty.value = '1'
      time.value = dayjs(params.houseEmptyDate).format('YYYY-MM-DD')
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
