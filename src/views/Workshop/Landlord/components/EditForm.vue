<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑居民户' : actionType === 'add' ? '新增居民户' : '查看详情'"
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
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElFormItem label="自然村" prop="parentCode">
        <!-- <ElTreeSelect
          class="!w-350px"
          v-model="form.parentCode"
          :data="props.districtTree"
          node-key="code"
          :props="treeSelectDefaultProps"
          :default-expanded-keys="[form.parentCode]"
        /> -->
        <ElCascader
          class="!w-350px"
          v-model="form.parentCode"
          :options="props.districtTree"
          :props="treeSelectDefaultProps"
          expandTrigger="hover"
        />
        <ElButton type="text" class="ml-10px" @click="onVillageDialogOpen">添加自然村</ElButton>
      </ElFormItem>
      <ElFormItem label="户主姓名" prop="name">
        <ElInput v-model="form.name" class="!w-350px" placeholder="请输入户主姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="sex">
        <ElSelect class="!w-350px" clearable v-model="form.sex">
          <ElOption
            v-for="item in dictObj[292]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="身份证号" prop="card">
        <ElInput
          clearable
          placeholder="请输入身份证号"
          type="text"
          class="!w-350px"
          v-model="form.card"
        />
      </ElFormItem>

      <ElFormItem label="联系方式" prop="phone">
        <ElInput
          clearable
          placeholder="请输入联系方式"
          type="text"
          class="!w-350px"
          v-model="form.phone"
        />
      </ElFormItem>

      <ElDivider border-style="dashed" />

      <ElFormItem label="财产户" prop="hasPropertyAccount">
        <ElSelect class="!w-350px" clearable v-model="form.hasPropertyAccount">
          <ElOption
            v-for="item in yesAndNoEnums"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="户籍册编号" prop="householdNumber">
        <ElInput class="!w-350px" v-model="form.householdNumber" placeholder="请输入户籍册编号" />
      </ElFormItem>

      <ElFormItem label="户籍所在地" prop="address">
        <ElInput class="!w-350px" v-model="form.address" placeholder="请输入户籍所在地" />
      </ElFormItem>

      <ElFormItem label="所在位置" prop="locationType">
        <ElSelect class="w-350px" v-model="form.locationType">
          <ElOption
            v-for="item in locationTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- <ElFormItem label="淹没范围" prop="inundationRange">
        <ElInput class="!w-350px" v-model="form.inundationRange" placeholder="请输入淹没范围" />
      </ElFormItem> -->
      <ElFormItem label="淹没范围" prop="inundationRange">
        <ElSelect class="!w-350px" clearable v-model="form.inundationRange">
          <ElOption
            v-for="item in dictObj[346]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="高程" prop="altitude">
        <ElInput
          clearable
          filterable
          placeholder="请输入高程"
          type="number"
          class="!w-350px"
          v-model="form.altitude"
        />
      </ElFormItem>

      <div class="w-466px">
        <MapFormItem :required="false" :positon="position" @change="onChosePosition" />
      </div>
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
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
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
  ElCascader,
  ElDivider
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed } from 'vue'
import { debounce } from 'lodash-es'
import { MapFormItem } from '@/components/Map'
// import { validateIdNo } from '@/utils/index'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { locationTypes, yesAndNoEnums } from '@/views/Workshop/components/config'
import { addLandlordApi, updateLandlordApi } from '@/api/workshop/landlord/service'
import type { LandlordDtoType } from '@/api/workshop/landlord/types'
import type { DistrictNodeType } from '@/api/district/types'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getDistrictTreeApi } from '@/api/district'
import VillageEditForm from '@/views/BasicInfor/Village/components/EditForm.vue'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: LandlordDtoType | null | undefined
  districtTree: DistrictNodeType[]
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

const defaultValue: Omit<LandlordDtoType, 'id'> = {
  address: '',
  householdNumber: '',
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
        parentCode: [val.areaCode, val.townCode, val.villageCode, val.virutalVillageCode]
      }
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address
    } else {
      // console.log(defaultValue)

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
  householdNumber: [required()],
  phone: [required()],
  parentCode: [required()]
  // card: [{ validator: validateIdNo, trigger: 'blur' }]
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
      // if (!position.latitude || !position.longitude) {
      //   ElMessage.error('请选择位置')
      //   return
      // }
      const data: any = {
        ...form.value,
        ...position,
        address: form.value.address,
        areaCode: form.value.parentCode[0],
        townCode: form.value.parentCode[1],
        villageCode: form.value.parentCode[2],
        virutalVillageCode: form.value.parentCode[3] || ''
      }
      console.log(form.value, data)

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
      type: 'PeasantHousehold',
      projectId
    })
  } else {
    await updateLandlordApi({
      ...data,
      type: 'PeasantHousehold',
      projectId
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

const onVillageDialogOpen = () => {
  villageDialog.value = true
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
