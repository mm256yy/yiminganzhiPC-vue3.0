<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto">
      <div class="flex-col section">
        <div class="flex-col items-center">
          <img class="image-center-logo" :src="centerLogoSrc" />
          <span class="logo-txt">镜岭水库</span>
        </div>
        <div class="field">
          <div class="label">用户号</div>
          <div class="input">
            <input v-model="userName" placeholder="请输入用户名" type="tel" maxlength="11" />
          </div>
        </div>
        <div class="field">
          <div class="label">密码</div>
          <div class="input">
            <input v-model="password" placeholder="请输入密码" type="password" />
          </div>
        </div>
        <ElButton class="blue-btn" :loading="btnLoading" @click="onConfirm">登录</ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import centerLogoSrc from '@/h5/assets/imgs/icon_reservoir_logo.png'
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { leaderLogin } from './service'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const userName = ref<string>('')
const password = ref<string>('')
const btnLoading = ref<boolean>(false)
const { push } = useRouter()

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}

const checkNullOrEmpty = (val: string, msg: string) => {
  if (!val) {
    ElMessage.error(msg)
    return false
  }
  return true
}

const onConfirm = () => {
  if (!checkNullOrEmpty(userName.value, '用户名不能为空')) {
    return
  }

  if (!checkNullOrEmpty(password.value, '密码不能为空')) {
    return
  }

  btnLoading.value = true

  let params = {
    userName: userName.value,
    password: password.value
  }
  leaderLogin(params).then(
    (res) => {
      btnLoading.value = false
      if (res) {
        const user = res.user
        appStore.setUserJwtInfo(user)
        appStore.setToken(res.token)
        toLink('home')
      }
    },
    (err) => {
      console.log(err)
      btnLoading.value = false
    }
  )
}
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  background-image: url('../../assets/imgs/bind_phone_bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  .section {
    .image-center-logo {
      width: 156px;
      height: 156px;
      margin-top: 200px;
      border-radius: 32px;
      filter: drop-shadow(0px 16px 16px #0462b81f);
    }

    .logo-txt {
      margin-top: 32px;
      margin-bottom: 52px;
      font-size: 36px;
      font-weight: bold;
      line-height: 30px;
      color: #333333;
    }

    .field {
      display: flex;
      width: 90%;
      margin: 17px auto;
      background: #ffffff;
      border-radius: 8px;
      align-items: center;

      .label {
        height: 96px;
        margin-left: 32px;
        font-size: 28px;
        font-weight: 400;
        line-height: 96px;
        color: #666666;
      }

      .input {
        height: 96px;
        margin-left: 32px;
        font-size: 28px;
        line-height: 96px;
        color: #cccccc;
        background: none;

        input {
          height: 96px;
          font-size: 28px;
          line-height: 96px;
          color: #131313;
          background: none;
          border: none;
          outline: none;
        }

        // 去除Input默认填充背景色
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 500px white inset;
          -webkit-text-fill-color: #131313;
        }
      }
    }

    .blue-btn {
      height: 96px;
      margin: 35px 40px;
      font-size: 32px;
      font-weight: bold;
      line-height: 96px;
      color: #fff;
      text-align: center;
      background: linear-gradient(90deg, #3e73ec 0%, #3ea3ec 100%);
      border-radius: 16px;
    }
  }
}
</style>
