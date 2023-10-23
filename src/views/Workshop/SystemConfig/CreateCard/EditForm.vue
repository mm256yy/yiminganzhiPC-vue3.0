<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : '新增'"
    :model-value="props.show"
    :width="800"
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
      <ElFormItem label="身份类型:" required prop="identityType">
        <ElSelect>
          <ElOption
            v-for="item in dictObj[392]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="类别:" required prop="category">
        <ElSelect>
          <ElOption
            v-for="item in dictObj[394]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="项目名:" prop="projectName">
        <ElInput type="text" v-model="form.projectName" placeholder="请输入项目名" />
      </ElFormItem>
      <ElFormItem label="项目编码:" prop="projectCode">
        <ElInput type="text" v-model="form.projectCode" placeholder="请输入项目编码" />
      </ElFormItem>
      <ElFormItem label="单位:" prop="unit">
        <ElInput type="text" v-model="form.unit" placeholder="请输入项目编码" />
      </ElFormItem>
      <ElFormItem label="单价（元）:" prop="unitPrice">
        <ElInput type="text" v-model="form.unitPrice" placeholder="请输入建筑密度(%)" />
      </ElFormItem>
      <ElFormItem label="是否需要确认:" prop="buildingDensity">
        <ElInput type="text" v-model="form.buildingDensity" placeholder="请输入建筑密度(%)" />
      </ElFormItem>
      <ElFormItem label="资金科目:" prop="fundAccount">
        <div class="fundAccount">
          <ElSelect class="field-item">
            <ElOption
              v-for="item in testOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ElSelect>
          <ElSelect class="field-item">
            <ElOption
              v-for="item in testOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ElSelect>
          <ElSelect class="field-item">
            <ElOption
              v-for="item in testOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </ElSelect>
        </div>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">保存</ElButton>
    </template>
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
  ElMessage,
  ElInput,
  ElSelect,
  ElOption
} from 'element-plus'
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import { editPlacementPointApi } from '@/api/systemConfig/placementPoint-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'
interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: PlacementPointDtoType | null | undefined
}

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()

const form = ref<any>({})
// 规则校验
const rules = reactive<FormRules>({})

const initData = () => {}

const testOptions = ref<any[]>([
  {
    label: '一级科目1',
    value: '一级科目1'
  },
  {
    label: '一级科目2',
    value: '一级科目2'
  }
])

// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const submit = (data: any) => {
  editPlacementPointApi(data).then(() => {
    ElMessage.success('操作成功！')
    onClose(true)
  })
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      if (props.actionType === 'add') {
        let params: any = {
          ...form.value
        }
        submit(params)
      } else {
        let params: any = {
          ...form.value,
          id: form.value.id
        }
        submit(params)
      }
    } else {
      return false
    }
  })
})

onMounted(() => {
  initData()
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

.fundAccount {
  display: flex;
  align-items: center;

  .field-item {
    width: 185px;
    margin-right: 20px;
  }
}
</style>
