<template>
  <div class="table-wrap !py-12px !mt-0px empty-wrap">
    <div class="empty-head">
      <div class="title">土地腾让办理情况</div>
      <div>
        <ElSpace v-if="!isLandEmpty">
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
      <div class="flex-center" v-if="!isLandEmpty">
        <Icon icon="gis:flag-start" color="#999999" :size="20" />

        <div class="txt"> 该户土地腾让未办理。 </div>
      </div>
      <div class="flex-center" v-else-if="isLandEmpty === '0'">
        <Icon icon="gis:flag-start" color="#3E73EC" :size="20" />

        <div class="txt"> 该户无须土地腾让。 </div>
      </div>
      <div class="flex-center" v-else-if="isLandEmpty === '1'">
        <Icon icon="gis:flag-start" color="#3E73EC" :size="20" />

        <div class="txt">该户土地腾让已完成，腾让时间：{{ time }}。</div>
      </div>
    </div>

    <el-dialog title="土地腾让" v-model="dialogVisible" width="500" @close="onDialogClose">
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="150px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElFormItem label="腾让日期" prop="landEmptyDate">
          <ElDatePicker
            class="!w-full"
            v-model="form.landEmptyDate"
            type="date"
            placeholder="请选择日期"
          />
        </ElFormItem>
        <ElFormItem label="移民户主意见" prop="landEmptyOpinion">
          <ElInput
            type="textarea"
            v-model="form.landEmptyOpinion"
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

    <LandArchives :door-no="doorNo" :show="houseArchivesPup" @close="houseArchivesClose" />
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
import LandArchives from './landArchives.vue'
import { submitLandEmptyInfoApi, getLandEmptyInfoApi } from '@/api/putIntoEffect/empty'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
// const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const isLandEmpty = ref<null | '0' | '1'>(null) //0 无须办理 1确认办理 -1默认状态
const time = ref<string>('')
const form = ref<any>({
  landEmptyOpinion: '本户土地已腾让完毕，同意交付给工程建设指挥部处理。',
  landEmptyDate: ''
})
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const houseArchivesPup = ref<boolean>(false)

const { required } = useValidator()

const rules = reactive<FormRules>({
  landEmptyDate: [required()],
  landEmptyOpinion: [required()]
})

onMounted(() => {
  init()
})

const init = async () => {
  const res = await getLandEmptyInfoApi(props.doorNo)
  console.log(res, 'res')
  if (res) {
    form.value = {
      landEmptyOpinion: res.landEmptyOpinion,
      landEmptyDate: dayjs(res.landEmptyDate).format('YYYY-MM-DD')
    }
    isLandEmpty.value = res.isLandEmpty
    time.value = dayjs(res.landEmptyDate).format('YYYY-MM-DD')
  }
}

const onHandle = () => {
  dialogVisible.value = true
}

const onNoHandle = () => {
  isLandEmpty.value = '0'
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
    isLandEmpty: isLandEmpty.value
  }
  if (data) {
    params.landEmptyOpinion = data.landEmptyOpinion
    params.landEmptyDate = dayjs(data.landEmptyDate)
  }
  const res = await submitLandEmptyInfoApi(params)
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
      isLandEmpty.value = '1'
      time.value = dayjs(params.landEmptyDate).format('YYYY-MM-DD')
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
