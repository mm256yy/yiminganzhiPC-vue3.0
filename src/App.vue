<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { listDictApi } from '@/api/sys/index'

const dictStore = useDictStoreWithOut()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const { wsCache } = useCache()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark')) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

setDefaultTheme()

const setDictObj = async () => {
  // 拿到字典
  const res = await listDictApi({
    includeVal: true,
    size: 1000
  })
  const list = res.content || []
  const dictObj: any = {}
  list.forEach((item) => {
    // 使用Id作为key 保证唯一 避免name作为key改动时影响页面
    dictObj[item.id as number] = (item.dictValList || []).map((dictItem) => {
      return {
        label: dictItem.label,
        value: dictItem.value
      }
    })
  })
  dictStore.setDictObj(dictObj)
}

setDictObj()
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
