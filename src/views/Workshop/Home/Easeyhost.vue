<template>
  <div class="bodyBack">
    <div class="cin_top">
      <div class="search">
        <ElInput
          v-model="searchContent"
          class="ipt"
          placeholder="请输入搜索内容"
          @click.stop="() => {}"
        >
          <template #prepend>
            <ElSelect
              placeholder="请选择"
              clearable
              filterable
              v-model="reason"
              style="width: 120px"
              size="large"
            >
              <ElOption
                v-for="item in option"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </ElSelect>
          </template>
          <template #append>
            <div class="seach_icon" @click="goLink"></div>
            <div style="color: #ffffff">查询</div>
          </template>
        </ElInput>
      </div>
    </div>
    <div style="display: flex; justify-content: center; flex: 1">
      <div
        style="
          display: flex;
          width: 60%;
          height: 42vh;
          flex-wrap: wrap;
          justify-content: space-between;
        "
      >
        <div
          v-for="item in optionclick"
          :key="item.code"
          class="option_click"
          @click="optionClick(item)"
        >
          <div>
            <img :src="item.img" alt="" style="width: 64px; height: 64px" />
            <div style="font-size: 16px; font-weight: bold; color: #333333">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getTokenApi } from '@/api/common/index'
import { ref, onMounted } from 'vue'
import { ElSelect, ElOption, ElInput } from 'element-plus'
import zhkq from '@/assets/imgs/zhkq.png'
import zhaz from '@/assets/imgs/zhaz.png'
import zjgl from '@/assets/imgs/zjgl.png'
import jdgl from '@/assets/imgs/jdgl.png'
import zhbb from '@/assets/imgs/zhbb.png'
import dsjfx from '@/assets/imgs/dsjfx.png'
import { useRouter } from 'vue-router'

let option = ref([
  {
    code: '1',
    name: '移民户'
  },
  {
    code: '2',
    name: '企事业单位'
  },
  {
    code: '3',
    name: '专业项目'
  },
  {
    code: '4',
    name: '分户土地'
  }
])
let optionclick = ref([
  {
    code: '0',
    name: '智慧库区',
    img: zhkq
  },
  {
    code: '0',
    name: '智慧安置',
    img: zhaz
  },
  {
    code: '2',
    name: '资金管理',
    img: zjgl
  },
  {
    code: '3',
    name: '进度管理',
    img: jdgl
  },
  {
    code: '6',
    name: '智慧报表',
    img: zhbb
  },
  {
    code: '1',
    name: '大数据分析',
    img: dsjfx
  }
])
let tokenStr = ref('')
let reason = ref('')
let searchContent = ref('')
const goLink = async () => {
  try {
    const result = await getTokenApi()
    tokenStr.value = result.token
    let url = `https://jingling-reservoir-test.jldt.top/token?token=${tokenStr.value}&value=${searchContent.value}&callback=${window.location.href}` // 12.1 宗浩要求修改
    window.location.href = url
  } catch {}
}
const { push } = useRouter()
const handleClickItem = (type: number) => {
  const pathMap = {
    1: 'adminSecondHome', // 大数据分析
    2: 'adminhomefund', //资金管理
    3: 'adminhomeprogress', //进度管理 //新闻管理
    4: 'Project', //新闻管理
    5: 'Feedback', //反馈管理
    6: 'SmartReport' // 智慧报表
  }
  push({ name: pathMap[type] })
}
let optionClick = (e) => {
  if (e.code == '0') {
    goLink()
  } else {
    handleClickItem(e.code)
  }
}
</script>
<style scoped lang="less">
.bodyBack {
  display: flex;
  height: 91vh;
  background-image: url(@/assets/imgs/backpake.png);
  flex-direction: column;
}

.cin_top {
  display: flex;
  width: 100%;
  height: 30vh;
  justify-content: center;
  align-items: center;

  .screen {
    position: absolute;
    right: 9px;
    bottom: 9px;
    width: 31px;
    height: 30px;
    cursor: pointer;
    background: url('@/assets/imgs/homes/qb.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .seach_select {
    width: 96px;
    height: 40px;
    background: url('@/assets/imgs/homes/seach_select.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    .s_full {
      :deep(.el-input__wrapper) {
        padding: 4px 11px !important;
        font-weight: 500;
        background: #3578f2 !important;
        border-color: #3578f2;
        outline: none;
        box-shadow: none;
      }

      :deep(.el-input__inner) {
        color: #ffffff !important;
        outline: none;
        box-shadow: none;
      }

      :deep(.el-icon) svg {
        font-weight: bold;
        color: #ffffff;
      }
    }
  }

  .search {
    position: relative;
    width: 476px;
    height: 40px;
    margin-left: -2px;
    background: url('@/assets/imgs/homes/seach.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    .ipt {
      width: 520px;
      height: 46px;
    }

    .seach_icon {
      width: 30px;
      height: 21px;
      background: url(@/assets/imgs/search.png) no-repeat;
      background-size: 76%;
    }
  }
}

.option_click {
  display: flex;
  width: 250px;
  height: 160px;
  background: linear-gradient(180deg, #c9e0fe 0%, #fdfeff 50%);
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1;
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0px 0px 12px 0px rgba(34, 57, 128, 0.69), inset 0px -2px 0px 0px #8c86f9;
  justify-content: center;
  align-items: center;
}

:deep(.el-input-group__append) {
  width: 100px;
  height: 46px;
  background: linear-gradient(181deg, #70abf6 0%, #3a85fb 100%);
}
</style>
