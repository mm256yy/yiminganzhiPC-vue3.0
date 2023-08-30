<template>
  <div class="app-container">
    <div class="section-input" style="margin-top: 30px">
      <div class="input-label">原手机号码</div>
      <div class="input-value">
        <input v-model="phone" placeholder="请输入手机号码" />
      </div>
    </div>
    <div class="part-line"></div>
    <div class="section-input">
      <div class="input-label">验证码</div>
      <div class="input-value check">
        <input v-model="code" placeholder="请输入验证码" />
      </div>
      <span class="verificationCode" v-if="verification" @click="handleSendSMS">获取验证码</span>
      <span class="count-down" v-if="!verification">{{ time }}s</span>
    </div>
    <ElButton class="blue-btn" :loading="btnLoading" @click="onConfirm">确定</ElButton>
    <div class="service">
      <div class="tips">如无法修改请联系工作人员</div>
      <div class="tips">电话：<span class="phone">800 0000 0000</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { isPhoneNumber } from '@/h5/utils/verify'
import { ElMessage, ElButton } from 'element-plus'

const phone = ref('')
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
</script>

<style lang="less" scoped>
.section-input {
  display: flex;
  height: 96px;
  padding: 20px 30px;
  background: #fff;

  .input-label {
    width: 140px;
    font-size: 28px;
    font-weight: 400;
    color: #666666;
    text-align: right;
  }

  .input-value {
    margin-left: 55px;
    font-size: 28px;
    font-weight: 500;
    color: #171718;

    input {
      font-size: 28px;
      color: #131313;
      border: none;
      outline: none;
    }
  }

  .verificationCode {
    height: 40px;
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
    color: #3e73ec;
  }
}

.part-line {
  height: 1px;
  background: #ececec;
}

.blue-btn {
  display: flex;
  width: 90%;
  height: 96px;
  margin: 48px auto;
  font-size: 32px;
  font-weight: bold;
  line-height: 96px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #3e73ec 0%, #3ea3ec 100%);
  border-radius: 16px;
  justify-content: center;
}

.service {
  position: fixed;
  bottom: 40px;
  width: 100%;
  text-align: center;

  .tips {
    font-size: 28px;
    font-weight: 400;
    line-height: 42px;
    color: #13131366;

    .phone {
      font-weight: bold;
      color: #3e73ec;
    }
  }
}
</style>
