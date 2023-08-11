<template>
  <ElDialog
    title="编辑个体工商"
    :model-value="props.show"
    :width="609"
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
      <ElFormItem label="个体工商编码" prop="doorNo">
        <ElInput v-model="form.doorNo" class="!w-350px" placeholder="请输入个体工商编码" />
      </ElFormItem>

      <ElFormItem label="个体工商名称" prop="name">
        <ElInput
          v-model="form.name"
          class="!w-350px"
          placeholder="请输入个体工商名称"
          :draggable="false"
        />
      </ElFormItem>

      <ElFormItem label="所属区域" prop="parentCode" required>
        <ElCascader
          class="!w-350px"
          v-model="form.parentCode"
          :options="districtTree"
          :props="treeSelectDefaultProps"
          expandTrigger="hover"
        />
      </ElFormItem>

      <ElFormItem label="所在位置" prop="locationType">
        <ElSelect class="w-350px" v-model="form.locationType">
          <ElOption
            v-for="item in dictObj[326]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="个体工商联系方式" prop="phone">
        <ElInput
          clearable
          placeholder="请输入个体工商联系方式"
          type="text"
          class="!w-350px"
          v-model="form.phone"
        />
      </ElFormItem>

      <ElFormItem label="淹没范围" prop="inundationRange" v-if="false">
        <ElSelect class="!w-350px" clearable v-model="form.inundationRange">
          <ElOption
            v-for="item in dictObj[346]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <VillageEditForm
      :district-tree="districtTree"
      :show="villageDialog"
      :row="null"
      :hideMap="true"
      action-type="add"
      @close="onVillageDialogClose"
    />

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)" :loading="btnLoading">确认</ElButton>
    </template>
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
  ElOption,
  ElSelect,
  ElMessage,
  ElCascader
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { updateLandlordApi } from '@/api/immigrantImplement/common-service'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDistrictTreeApi } from '@/api/district'
import VillageEditForm from '@/views/Workshop/Village/components/EditForm.vue'
interface PropsType {
  show: boolean
  row?: LandlordDtoType | null | undefined
}
const btnLoading = ref(false)
const dictStore = useDictStoreWithOut()
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'updateDistrict'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId

const dictObj = computed(() => dictStore.getDictObj)
const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea'
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)
const position: {
  latitude: number
  longitude: number
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})
const districtTree = ref([])
const villageDialog = ref(false)

const getDistrictTree = async () => {
  const list = await getDistrictTreeApi(projectId)
  districtTree.value = list || []
}

getDistrictTree()

watch(
  () => props.row,
  (val) => {
    if (val) {
      // 处理行政区划
      form.value = {
        ...val,
        parentCode: [val.areaCode, val.townCode, val.villageCode]
      }
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  doorNo: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      const data: any = {
        ...form.value,
        ...position,
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || '',
        type: 'IndividualHousehold'
      }
      delete data.parentCode
      submit(data)
    } else {
      return false
    }
  })
}, 600)

const submit = async (data: LandlordDtoType) => {
  await updateLandlordApi({
    ...data,
    projectId
  })
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

const onVillageDialogClose = (flag?: boolean) => {
  villageDialog.value = false
  if (flag) {
    emit('updateDistrict')
  }
}
</script>

<style lang="less">
.form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
