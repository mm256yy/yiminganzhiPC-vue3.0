<template>
  <div>
    <ElDialog
      :title="
        actionType === 'edit' ? '编辑网格' : actionType === 'fenpei' ? '一键分配' : '添加网格'
      "
      :model-value="props.show"
      :width="575"
      @close="onClose"
      alignCenter
      appendToBody
      :closeOnClickModal="false"
      destroy-on-close
    >
      <ElForm
        class="policy-form"
        ref="formRef"
        label-position="right"
        :model="form"
        label-width="125px"
        :rules="rules"
      >
        <template v-if="actionType != 'fenpei'">
          <ElFormItem label="网格名称" prop="name" required>
            <ElInput clearable :maxlength="20" v-model="form.name" />
          </ElFormItem>
          <ElFormItem label="所属区域" prop="parentCode" required>
            <ElTreeSelect
              class="!w-full"
              v-model="form.parentCode"
              :data="props.districtTree"
              node-key="code"
              :props="treeSelectDefaultProps"
              :default-expanded-keys="[form.parentCode]"
            />
          </ElFormItem>
          <ElFormItem label="网格工作人员" prop="name" required>
            <ElInput clearable :maxlength="20" v-model="form.name" /> </ElFormItem
        ></template>
        <template v-if="actionType == 'fenpei'">
          <ElFormItem label="网格人员信息表" prop="name" required>
            <ElUpload
              action="/api/peasantHousehold/import"
              :headers="headers"
              :data="{ projectId }"
              :show-file-list="false"
              accept=".xls,.xlsx"
              :before-upload="beforeUpload"
              :on-success="uploadDone"
              :on-error="uploadError"
            >
              <template #trigger>
                <ElButton type="primary" :loading="uploadLoading">请上传</ElButton>
              </template>
            </ElUpload>
          </ElFormItem></template
        >
      </ElForm>

      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
      </template>
    </ElDialog>
    <el-dialog title="上传失败" v-model="dialogVisible">
      <div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="用户名" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="address" label="网格名称" />
          <el-table-column prop="address" label="网格工作人员" />
          <el-table-column prop="address" label="联系方式" />
        </el-table>
        <div class="error">
          <span class="label">上传失败:</span> <span class="text">失败</span>
        </div>
      </div>

      <!-- <div> 网格工作人员信息创建成功 所有网格小组，采集居民户数量分配成功 </div> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          <!-- 已分配网格 -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTreeSelect,
  ElUpload,
  FormInstance,
  FormRules,
  ElMessage,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { ref, reactive, watch, nextTick } from 'vue'
// import { MapFormItem } from '@/components/Map'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useAppStore } from '@/store/modules/app'
import { addVillageApi, updateVillageApi } from '@/api/workshop/village/service'
import type { VillageDtoType } from '@/api/workshop/village/types'
import type { DistrictNodeType } from '@/api/district/types'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
interface PropsType {
  show: boolean
  hideMap?: boolean
  actionType: 'add' | 'edit' | 'fenpei'
  row?: VillageDtoType | null | undefined
  districtTree: DistrictNodeType[]
}
const dialogVisible = ref(true)
const uploadLoading = ref(false)
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const headers = ref({
  'Project-Id': projectId,
  Authorization: appStore.getToken
})
const tableData = ref([
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
  }
])
const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}
const uploadError = (error) => {
  try {
    const response = JSON.parse(error.message)
    ElMessage.error(response.message)
    uploadLoading.value = false
  } catch (err) {
    // err
  }
}
const uploadDone = () => {
  uploadLoading.value = false
  // ElMessage.warning('正在导入，请等待批量导入结果')
}
const beforeUpload = () => {
  uploadLoading.value = true
}

const defaultValue: Omit<VillageDtoType, 'id'> = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: ''
}
const form = ref<Omit<VillageDtoType, 'id'>>(defaultValue)
const position = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
      position.latitude = form.value.latitude
      position.longitude = form.value.longitude
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
  parentCode: [required()]
})

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
    position.latitude = 0
    position.longitude = 0
    position.address = ''
  })
}

// 定位
// const onChosePosition = (ps) => {
//   position.latitude = ps.latitude
//   position.longitude = ps.longitude
//   position.address = ps.address
// }

const submit = async (data: VillageDtoType) => {
  if (props.actionType === 'add') {
    await addVillageApi({
      ...data,
      projectId
    })
  } else {
    await updateVillageApi({
      ...data,
      projectId
    })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      if (!props.hideMap && (!position || !position.longitude)) {
        return ElMessage.error('请点击地图选择经纬度')
      }
      const data: any = {
        ...form.value,
        ...position
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less" scoped>
.error {
  margin-top: 5px;
  color: red;
}

.label {
  font-weight: 600;
}

.policy-form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .el-input__wrapper {
    width: 100%;
  }
}
</style>
