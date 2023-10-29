<template>
  <div class="flex-col app-container">
    <div class="header-region">
      <ElCarousel height="250px">
        <ElCarouselItem v-for="(item, index) in picDta" :key="index">
          <ElImage :src="item ? item : bannerBgSrc" fit="cover" />
        </ElCarouselItem>
      </ElCarousel>
    </div>
    <div class="flex-col relative section-content">
      <div class="flex-col justify-start relative house-type">
        <div class="type-txt">小区户型</div>
      </div>
      <div class="flex-col section-house-type">
        <div class="house-type-group">
          <div
            class="house-type-btn"
            :class="{ active: currentType === item.id }"
            v-for="item in houseTypeList"
            :key="item.id"
            @click="tabChange(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="flex-col justify-start items-center image-wrapper">
          <ElImage class="house-type-image" :src="floorPlanBgSrc" fit="contain" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElCarousel, ElCarouselItem, ElImage } from 'element-plus'
import bannerBgSrc from '@/h5/assets/imgs/banner_bg.png'
import floorPlanBgSrc from '@/h5/assets/imgs/floor_plan_bg.png'
import { useRoute } from 'vue-router'
const currentType = ref(1)
let Route: any = useRoute()
interface HouseType {
  id: number
  name: string
}

const houseTypeList = ref<HouseType[]>([
  {
    id: 1,
    name: '60平方'
  },
  {
    id: 2,
    name: '70平方'
  },
  {
    id: 3,
    name: '80平方'
  }
])

const tabChange = (id: number) => {
  currentType.value = id
}
let picDta: any = ref([])

onMounted(() => {
  picDta.value = JSON.parse(Route.query.id)
  console.log(picDta.value)
})
</script>

<style lang="less" scoped>
.header-region {
  height: 360px;
}

.section-content {
  padding: 32px 30px;
  margin-top: -2px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 32px 32px 0px 0px;
  filter: drop-shadow(0px 8px 5px #0000000a);

  .house-type {
    overflow: hidden;
    background-color: #ffffff;
    border-image-slice: 1;

    .type-txt {
      margin-left: 32px;
      font-size: 40px;
      font-weight: 700;
      line-height: 37px;
      color: #333333;
    }
  }

  .section-house-type {
    padding: 0.1rem 30px;

    .house-type-group {
      display: flex;
      align-items: center;

      .house-type-btn {
        width: 170px;
        height: 56px;
        margin-right: 32px;
        font-size: 28px;
        font-weight: 500;
        line-height: 56px;
        color: #3e73ec;
        text-align: center;
        background: #f2f6ff;
        border-radius: 56px;

        &.active {
          color: #fff;
          background: #3e73ec;
        }
      }
    }

    .image-wrapper {
      padding: 60px 0;
      margin-top: 24px;
      overflow: hidden;
      border: solid 2px #ebebeb;
      border-radius: 8px;

      .house-type-image {
        width: 658px;
        height: 542px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
