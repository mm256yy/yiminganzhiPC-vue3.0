<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto">
      <div class="flex-col section">
        <div class="flex-col items-center">
          <img class="image-center-logo" :src="centerLogoSrc" />
          <span class="logo-txt">镜岭水库</span>
        </div>
        <div class="field">
          <div class="label">手机号</div>
          <div class="input">
            <input v-model="phone" placeholder="请输入手机号" type="tel" maxlength="11" />
          </div>
        </div>
        <div class="field">
          <div class="label">验证码</div>
          <div class="code">
            <div class="input">
              <input v-model="code" placeholder="请输入短信验证码" type="tel" maxlength="6" />
            </div>
            <span class="code-txt" v-if="verification" @click="handleSendSMS">获取验证码</span>
            <span class="count-down" v-if="!verification">{{ time }}s</span>
          </div>
        </div>
        <ElButton class="blue-btn" :loading="btnLoading" @click="onConfirm">确定</ElButton>
        <div class="agreement">
          <div class="checked-field" @click="onCheckTick">
            <div v-if="!isTicked" class="agreement-unChecked"></div>
            <ElImage v-else :src="iconCheckedSrc"
          /></div>
          <span class="agreement-txt"
            >我已阅读并同意<span class="special">《用户服务协议》</span>以及<span class="special"
              >《隐私政策》</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import centerLogoSrc from '@/h5/assets/imgs/icon_reservoir_logo.png'
import { isPhoneNumber } from '@/h5/utils/verify'
import { ref, onBeforeUnmount } from 'vue'
import { ElMessage, ElButton, ElImage } from 'element-plus'
import iconCheckedSrc from '@/h5/assets/imgs/icon_checked.png'

const phone = ref<string>('')
const code = ref<string>('')
const verification = ref<boolean>(true) // 获取验证码
const time = ref<number>(0)
let timer = 0
const btnLoading = ref<boolean>(false)
const isTicked = ref<boolean>(false)

const checkNullOrEmpty = (val: string, msg: string) => {
  if (!val) {
    ElMessage.error(msg)
    return false
  }
  return true
}

// 验证码倒计时
const countDown = () => {
  timer = window.setInterval(() => {
    // 定时器设置每秒递减
    time.value-- // 递减时间
    if (time.value <= 0) {
      verification.value = true // 60s时间结束还原v-show状态并清除定时器
      clearInterval(timer)
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(timer)
  timer = 0
})

const onConfirm = () => {
  console.log('confirm')
  if (!isTicked.value) {
    const msg = '请先勾选相关协议'
    ElMessage.error(msg)
    return
  }

  btnLoading.value = true
  window.setTimeout(() => {
    btnLoading.value = false
  }, 1500)
}

// 发送验证码
const handleSendSMS = () => {
  if (!checkNullOrEmpty(phone.value, '手机号不能为空')) {
    return
  }

  if (!isPhoneNumber(phone.value)) {
    const msg = '请输入有效的手机号码'
    ElMessage.error(msg)
    return
  }
  verification.value = false
  time.value = 60
  // 开始倒计时
  countDown()
}

// 勾选协议
const onCheckTick = () => {
  isTicked.value = !isTicked.value
}
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  background-image: url('../../../assets/imgs/bind_phone_bg.png');
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

        input {
          font-size: 28px;
          color: #131313;
          border: none;
          outline: none;
        }
      }
    }

    .code {
      display: flex;
      justify-content: space-between;

      .code-txt {
        padding-top: 28px;
        font-size: 28px;
        color: #3f71d8;
      }

      .count-down {
        padding-top: 28px;
        font-size: 28px;
        color: #999999;
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

    .agreement {
      display: flex;
      margin-left: 46px;

      font-size: 24px;
      align-items: center;

      .checked-field {
        width: 32px;
        height: 32px;

        .agreement-unChecked {
          width: 32px;
          height: 32px;
          margin-right: 16px;
          background-color: #fff;
          border-radius: 50%;
        }
      }

      .agreement-txt {
        padding-left: 12px;
        color: #171718;

        .special {
          color: #3e73ec;
        }
      }
    }
  }
}
</style>
