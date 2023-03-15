<template>
  <div :class="prefixCls" class="h-[100%] relative <xl:bg-v-dark box">
    <div class="leftbox"> </div>
    <div class="relative h-full flex mx-auto rightbox">
      <div class="flex-1 p-30px <sm:p-10px dark:bg-v-dark relative">
        <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ appStore.getTitle }}</span>
          </div>

          <div class="flex justify-end items-center space-x-10px">
            <!-- <ThemeSwitch /> -->
          </div>
        </div>
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="h-full flex items-center m-auto w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px"
          >
            <LoginForm class="p-20px m-auto <xl:(rounded-3xl light:bg-white)" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginForm } from './components'
// import { ThemeSwitch } from '@/components/ThemeSwitch'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const appStore = useAppStore()
</script>

<style lang="less" scoped>
.box {
  display: flex;
}

.leftbox {
  width: 50%;
  background-image: url(@/assets/imgs/loginBg.png);
  background-repeat: no-repeat;
  background-size: cover;
}

.rightbox {
  width: 50%;
  background: linear-gradient(1deg, #ffffff 0%, #e7edfd 100%);
}
@prefix-cls: ~'@{namespace}-login';
</style>
