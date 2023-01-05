<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑菜单' : '新增菜单'"
    :model-value="props.show"
    :width="660"
    @close="onClose"
    alignCenter
    appendToBody
  >
    <ElForm ref="formRef" :model="form" label-width="80px" :rules="rules">
      <ElFormItem label="菜单类型" prop="type">
        <ElRadioGroup v-model="form.type">
          <ElRadioButton v-for="item in menuTypes" :key="item.value" :label="item.value">{{
            item.label
          }}</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>

      <!-- 图标选择 -->
      <IconSelectFormItem
        v-if="form.type !== MenuTypes.button"
        :icon="form.icon"
        prop="icon"
        @change="onUpdateIcon"
      />

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem
            :label="form.type === MenuTypes.button ? '按钮名称' : '菜单标题'"
            prop="name"
            required
          >
            <ElInput :minlength="2" :maxlength="20" v-model.trim="form.name" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12" v-if="form.type !== MenuTypes.button">
          <ElFormItem label="展示标题" prop="showName" required>
            <ElInput :minlength="2" :maxlength="20" v-model.trim="form.showName" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem
        required
        label="权限标识"
        prop="permission"
        v-if="form.type !== MenuTypes.directory"
      >
        <ElInput v-model.trim="form.permission" />
      </ElFormItem>

      <ElRow :gutter="10">
        <ElCol :span="12" v-if="form.type !== MenuTypes.button">
          <ElFormItem required label="访问路径" prop="componentCode">
            <ElInput v-model.trim="form.componentCode" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="菜单排序" prop="sort">
            <ElInputNumber v-model.number="form.sort" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10" v-if="form.type !== MenuTypes.button">
        <ElCol :span="12">
          <ElFormItem required label="路由名称" prop="componentName">
            <ElInput v-model.trim="form.componentName" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem required label="路由地址" prop="path">
            <ElInput v-model.trim="form.path" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="10">
        <ElCol :span="12">
          <ElFormItem required label="父级菜单" prop="parentId">
            <ElTreeSelect
              check-strictly
              :render-after-expand="false"
              v-model="form.parentId"
              :data="menuStore.getMenuTreeWithWrap"
              node-key="id"
              :props="{
                label: 'name'
              }"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem
            required
            label="指定项目"
            prop="projectId"
            v-if="form.type === MenuTypes.menu"
          >
            <ElSelect v-model="form.projectId">
              <ElOption
                v-for="item in props.projects"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="40" v-if="form.type !== MenuTypes.button">
        <ElCol :span="8">
          <ElFormItem label="是否外链" prop="iframe">
            <ElRadioGroup v-model="form.iframe">
              <ElRadioButton :label="true">是</ElRadioButton>
              <ElRadioButton :label="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="菜单可见" prop="hidden">
            <ElRadioGroup v-model="form.hidden">
              <ElRadioButton :label="false">是</ElRadioButton>
              <ElRadioButton :label="true">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>

        <ElCol :span="8">
          <ElFormItem label="菜单缓存" prop="cache" v-if="form.type === MenuTypes.menu">
            <ElRadioGroup v-model="form.cache">
              <ElRadioButton :label="true">是</ElRadioButton>
              <ElRadioButton :label="false">否</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElTreeSelect,
  ElCol,
  ElSelect,
  ElOption,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElInputNumber,
  FormInstance,
  FormRules
} from 'element-plus'
import IconSelectFormItem from './IconSelectFormItem.vue'
import { ref, reactive, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import { useMenuStoreWithOut } from '@/store/modules/menu'
import type { MenuDtoType } from '@/api/sys/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  projects: any[]
  row?: MenuDtoType | null
}

enum MenuTypes {
  directory = 0,
  menu = 1,
  button = 2
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const menuStore = useMenuStoreWithOut()
const { required } = useValidator()
const formRef = ref<FormInstance>()
const menuTypes = ref([
  {
    label: '目录',
    value: 0
  },
  {
    label: '菜单',
    value: 1
  },
  {
    label: '按钮',
    value: 2
  }
])

const defaultValue = {
  type: 0,
  parentId: 0,
  projectId: 0,
  cache: false,
  hidden: false,
  iframe: false,
  sort: 999
} as MenuDtoType
const form = ref<MenuDtoType>(defaultValue)

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const validateName = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('此项必填'))
  } else if (value.length < 2 || value.length > 20) {
    callback(new Error('推荐字数2-20个'))
  } else {
    callback()
  }
}

// 规则校验
const rules = reactive<FormRules>({
  name: [{ validator: validateName, trigger: 'blur' }],
  showName: [{ validator: validateName, trigger: 'blur' }],
  path: [required()],
  componentName: [{ required: true, pattern: /^[a-zA-Z_]+$/, message: '支持字母和下划线' }],
  componentCode: [required()],
  permission: [required()],
  icon: [required()],
  parentId: [required()]
})

// 关闭弹窗
const onClose = () => {
  emit('close')
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const onUpdateIcon = (name) => {
  form.value.icon = name
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      nextTick(() => {
        formRef.value?.resetFields()
      })
    } else {
      return false
    }
  })
}, 600)
</script>
