<template>
  <div class="tab-warp">
    <div class="warp">
      <TabItem
        v-for="(item, index) in getTabs"
        :key="index"
        :txt="item.txt"
        :url="item.url"
        :selected="selected"
        :normalImg="item.normalImg"
        :activeImg="item.activeImg"
        @change="tabChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TabItem from './components/TabItem.vue'
import type { TabItemType } from '@/h5/types/home'
import homeNormalImg from '@/h5/assets/imgs/icon_home_normal.png'
import homeActiveImg from '@/h5/assets/imgs/icon_home_checked.png'
import roamNormalImg from '@/h5/assets/imgs/icon_roaming_normal.png'
import roamActiveImg from '@/h5/assets/imgs/icon_roaming_checked.png'
import gardenNormalImg from '@/h5/assets/imgs/icon_garden_normal.png'
import gardenActiveImg from '@/h5/assets/imgs/icon_garden_checked.png'
import mineActiveImg from '@/h5/assets/imgs/icon_mine_checked.png'
import mineNormalImg from '@/h5/assets/imgs/icon_mine_normal.png'

interface ProjectType {
  type: string
}

const props = defineProps<ProjectType>()

// 选中路由
const selected = ref<string>('/')

// 移民端tabs
const tabBarList = ref<TabItemType[]>([
  {
    txt: '首页',
    url: '/home',
    normalImg: homeNormalImg,
    activeImg: homeActiveImg
  },
  {
    txt: '库区漫游',
    url: '/roam',
    normalImg: roamNormalImg,
    activeImg: roamActiveImg
  },
  {
    txt: '美丽家园',
    url: '/garden',
    normalImg: gardenNormalImg,
    activeImg: gardenActiveImg
  },
  {
    txt: '我的',
    url: '/mine',
    normalImg: mineNormalImg,
    activeImg: mineActiveImg
  }
])

//领导端tabs
const leaderTabBarList = ref<TabItemType[]>([
  {
    txt: '首页',
    url: '/home',
    normalImg: homeNormalImg,
    activeImg: homeActiveImg
  },
  {
    txt: '库区漫游',
    url: '/roam',
    normalImg: roamNormalImg,
    activeImg: roamActiveImg
  }
])

// 获取tab
const getTabs = computed(() => {
  return props.type === 'leader' ? leaderTabBarList.value : tabBarList.value
})

const tabChange = (tabSelect) => {
  selected.value = tabSelect
  window.localStorage.setItem('selectTabUrl', selected.value)
}

onMounted(() => {
  const selectTab = window.localStorage.getItem('selectTabUrl')

  tabChange(selectTab ?? '/home')
})
</script>

<style lang="less" scoped>
.warp {
  display: flex;
  width: 100%;
  font-size: 0;
  background: #fff;
  border-top: 1px solid #eee;
  align-items: center;
  justify-content: space-around;
}

.warp img {
  width: 20px;
  height: 20px;
}

.tab-warp img {
  margin-top: 10px;
  margin-bottom: 5px;
}

.tab-warp {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 5px;
  background: #fff;
}
</style>
