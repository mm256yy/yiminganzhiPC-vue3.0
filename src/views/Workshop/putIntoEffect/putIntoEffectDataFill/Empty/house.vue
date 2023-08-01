<template>
  <div class="table-wrap !py-12px !mt-0px empty-wrap">
    <div class="empty-head">
      <div class="title">房屋腾空办理情况</div>
      <div>
        <ElSpace v-if="!isHouseEmpty">
          <ElButton type="primary" @click="onHandle">办理</ElButton>
          <ElButton type="primary" @click="onNoHandle">无须办理</ElButton>
        </ElSpace>

        <ElSpace v-else>
          <ElButton type="primary" @click="onSortSave">归档</ElButton>
          <ElButton type="primary" @click="onPrintTable">打印报表</ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="empty-cont">
      <div class="flex-center" v-if="!isHouseEmpty">
        <Icon icon="gis:flag-start" color="#999999" :size="20" />

        <div class="txt"> 该户房屋腾空未办理。 </div>
      </div>
      <div class="flex-center" v-else-if="isHouseEmpty === '0'">
        <Icon icon="gis:flag-start" color="#3E73EC" :size="20" />

        <div class="txt"> 该户无须房屋腾空。 </div>
      </div>
      <div class="flex-center" v-else-if="isHouseEmpty === '1'">
        <Icon icon="gis:flag-start" color="#3E73EC" :size="20" />

        <div class="txt">该户房屋腾空已完成，腾空时间：{{ time }}。</div>
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
        <ElFormItem label="移民户主意见" prop="houseEmptyOpinion">
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

    <HouseArchives :door-no="doorNo" :show="houseArchivesPup" @close="houseArchivesClose" />
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
  FormRules
} from 'element-plus'
import dayjs from 'dayjs'
import { useValidator } from '@/hooks/web/useValidator'
// import { useIcon } from '@/hooks/web/useIcon'
import HouseArchives from './houseArchives.vue'
import { submitHouseEmptyInfoApi, getHouseEmptyInfoApi } from '@/api/putIntoEffect/empty'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const isHouseEmpty = ref<null | '0' | '1'>(null) //0 无须办理 1确认办理 -1默认状态
const time = ref<string>('')
const form = ref<any>({
  houseEmptyOpinion: '本户房屋已腾空完毕，同意交付给工程建设指挥部处理。',
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

onMounted(() => {
  init()
})

const init = async () => {
  const res = await getHouseEmptyInfoApi(props.doorNo)
  console.log(res, 'res')
  if (res) {
    form.value = {
      houseEmptyOpinion: res.houseEmptyOpinion,
      houseEmptyDate: dayjs(res.houseEmptyDate).format('YYYY-MM-DD')
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
  handleSave()
}

const onSortSave = () => {
  houseArchivesPup.value = true
}

const houseArchivesClose = () => {
  houseArchivesPup.value = false
}

const onPrintTable = () => {
  console.log('打印')
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
  }
  const res = await submitHouseEmptyInfoApi(params)
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
</style>
