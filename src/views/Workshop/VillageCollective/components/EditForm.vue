<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑村集体' : actionType === 'add' ? '新增村集体' : '查看详情'"
    :model-value="props.show"
    :width="609"
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
      label-width="150px"
      :label-position="'right'"
      :rules="rules"
    >
      <!-- <ElFormItem label="村集体编码" prop="doorNo">
        <ElInput
          v-model="form.doorNo"
          :disabled="actionType === 'edit'"
          class="!w-350px"
          placeholder="请输入村集体编码"
        />
      </ElFormItem> -->
      <ElFormItem label="村集体名称" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入村集体名称" />
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
        <ElSelect class="w-350px" v-model="form.locationType" @change="onChangeLocationType">
          <ElOption
            v-for="item in dictObj[326]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="淹没范围" prop="inundationRange">
        <ElSelect class="w-350px" v-model="form.inundationRange">
          <ElOption
            v-for="item in dictObj[346]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="村集体联系方式" prop="phone">
        <ElInput
          clearable
          placeholder="请输入村集体联系方式"
          type="text"
          class="!w-350px"
          v-model="form.phone"
        />
      </ElFormItem>

      <ElFormItem label="村集体属性：" prop="address">{{
        form.villageType == 'asset' ? '普通集体资产' : form.villageType == 'grave' ? '坟墓' : '-'
      }}</ElFormItem>

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
      <div class="w-466px">
        <MapFormItem :required="true" :positon="position" @change="onChosePosition" />
      </div>
      <!-- <div class="w-466px">
        <MapFormItem :required="false" :positon="position" @change="onChosePosition" />
      </div> -->
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
// ElCascader,ElDivider
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
// import { MapFormItem } from '@/components/Map'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
// import { locationTypes } from '@/views/Workshop/components/config'
// import { locationTypes, yesAndNoEnums } from '../config'
import { addLandlordApi, updateLandlordApi } from '@/api/workshop/landlord/service'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
// import type { DistrictNodeType } from '@/api/district/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDistrictTreeApi } from '@/api/district'
import { setlocationType } from '@/utils/index'
import { MapFormItem } from '@/components/Map'

import VillageEditForm from '@/views/Workshop/Village/components/EditForm.vue'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: LandlordDtoType | null | undefined
}
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
const btnLoading = ref(false)
const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  // householdNumber: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: [],
  locationType: 'SubmergedArea',
  villageType: ''
}
const form = ref<Omit<LandlordDtoType, 'id'>>(defaultValue)

if (props.actionType === 'add') {
  form.value.villageType = 'asset'
}

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
      console.log(val, 'val测试')
      form.value = {
        ...val,
        parentCode: [val.areaCode, val.townCode, val.villageCode]
      }
      val.virutalVillageCode ? form.value.parentCode.push(val.virutalVillageCode) : ''
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
  // doorNo: [required()],
  householdNumber: [required()],
  phone: [required()],
  parentCode: [required()],
  locationType: [required()]
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

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      if (!position.latitude || !position.longitude) {
        ElMessage.error('请选择位置')
        return
      }
      btnLoading.value = true
      const data: any = {
        ...form.value,
        ...position,
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || '',
        type: 'Village'
      }
      delete data.parentCode
      submit(data)
    } else {
      return false
    }
  })
}, 600)

const submit = async (data: LandlordDtoType) => {
  if (props.actionType === 'add') {
    await addLandlordApi({
      ...data,
      projectId
    })
  } else {
    await updateLandlordApi({
      ...data,
      projectId
    })
  }
  btnLoading.value = false
  ElMessage.success('操作成功！')
  onClose(true)
}

// const onVillageDialogOpen = () => {
//   villageDialog.value = true
// }

const onVillageDialogClose = (flag?: boolean) => {
  villageDialog.value = false
  if (flag) {
    emit('updateDistrict')
  }
}
let onChangeLocationType = (e: any) => {
  if (props.actionType === 'add') {
    form.value.inundationRange = setlocationType(e)
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
