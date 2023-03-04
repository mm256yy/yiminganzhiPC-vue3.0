<template>
  <Form
    :schema="schema"
    :rules="rules"
    :is-col="true"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="register"
  >
    <template #title>
      <h2 class="text-3xl font-bold text-center w-[100%]">移民安置综合管理平台</h2>
    </template>

    <template #authImage>
      <div class="mt-25px w-[100%]">
        <img
          v-if="authImage"
          class="w-130px h-48px cursor-pointer"
          :src="authImage"
          @click="loadCaptcha"
        />
      </div>
    </template>

    <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <ElCheckbox v-model="remember" label="记住我" size="small" />
      </div>
    </template>

    <template #login>
      <div class="w-[100%]">
        <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          登录
        </ElButton>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { reactive, ref, unref, watch, onMounted } from 'vue'
import { Form } from '@/components/Form'
import { ElButton, ElCheckbox } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi, loginCaptchaApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { UserLoginType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { usePlatform } from '@/hooks/web/usePlatform'
import { currentUserApi } from '@/api/sys'
import { ProjectRoleEnum } from '@/api/sys/types'

const { required } = useValidator()
const appStore = useAppStore()
const { setPlatform } = usePlatform()
const { currentRoute, addRoute } = useRouter()

const rules = {
  userName: [required('用户名必填')],
  password: [required('密码必填')],
  authCode: [required('验证码必填')]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入密码'
    }
  },
  {
    field: 'authCode',
    label: '验证码',
    component: 'Input',
    colProps: {
      span: 14
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入验证码'
    }
  },
  {
    field: 'authImage',
    colProps: {
      span: 10
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  }
])

const remember = ref(false)
const { register, elFormRef, methods } = useForm()
const loading = ref(false)
const redirect = ref<string>('')
const authKey = ref<string>('')
const authImage = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

onMounted(() => {
  loadCaptcha()
})

const loadCaptcha = () => {
  loginCaptchaApi().then((data) => {
    authKey.value = data.key
    authImage.value = data.image
  })
}

// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserLoginType>()
      formData.authKey = authKey.value

      try {
        const res = await loginApi(formData)

        if (res) {
          const user = res.user
          appStore.setUserJwtInfo(user)
          appStore.setToken(res.token)
          appStore.setreservoirName(res.reservoirName)

          localStorage.setItem('reservoirName', res.reservoirName)

          const userInfo = await currentUserApi()
          appStore.setUserInfo(userInfo)
          await doRoute()
        }
      } catch {
        loadCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

const doRoute = async () => {
  let path = '/#/workshop/home'
  if (appStore.getIsSysAdmin || appStore.getIsProjectAdmin) {
    path = '/admin.html#/dashboard/home'
    if (appStore.getIsProjectAdmin) {
      const project = appStore.getUserInfo?.projectUsers.find(
        (x) => x.projectRole === ProjectRoleEnum.PROJECT_ADMIN
      )
      if (project) {
        appStore.setCurrentProjectId(project.projectId!)
      }
    }
    await setPlatform('admin', addRoute)
  } else {
    await setPlatform('workshop', addRoute)
  }
  // window.location.href = path
  setTimeout(() => {
    window.location.href = path
  }, 0)
}
</script>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
