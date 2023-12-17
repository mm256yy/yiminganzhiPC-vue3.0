<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="sider_info" :id="idName">
    <div class="seder_head">
      <div v-if="index == 3" class="tab_list">
        <div class="list_li"> 企（事）业单位 </div>
      </div>
      <div v-else class="tab_list">
        <div
          v-for="i in list"
          :id="index == i.id ? 'list_li' : ''"
          :key="i.id"
          class="list_li"
          @click="hanldeClick(i)"
        >
          {{ i.name }}
        </div>
      </div>
      <div @click="close" class="close">X</div>
    </div>
    <div class="right_icon"></div>

    <div class="container">
      <div class="th-title">
        <div v-for="(item, indexs) in tableJosn[index]" :key="indexs">{{ item }}</div>
      </div>
      <div class="question-list">
        <div class="item" v-for="item in questionList" :key="item.id">
          <div class="name">{{ item[keyJosn[index].key] }}</div>
          <div class="names">{{ item[keyJosn[index].key_a] }}</div>
          <div class="names">{{ item[keyJosn[index].key_b] }} </div>
          <div v-if="keyJosn[index].key_c" class="names">{{ item[keyJosn[index].key_c] }} </div>
          <div v-if="keyJosn[index].key_d" class="names">{{ item[keyJosn[index].key_d] }} </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  isType: {
    type: [String, Number],
    default: '0'
  },
  isClose: {
    type: Boolean,
    default: false
  }
})

const list = ref([
  {
    name: '永久用地',
    id: 0
  },
  {
    name: '人口',
    id: 1
  },
  {
    name: '房屋',
    id: 2
  }
])

const tableJosn = ref({
  0: ['行政村', '户数', '户数', '户数', '户数'],
  1: ['行政村', '户数', '户数', '户数', '户数'],
  2: ['行政村', '住宅房屋', '村集体房屋', '合计'],
  3: ['企业(家)', '水电站(座)', '个体工商户(家)', '探矿权(处)']
})

const keyJosn = ref({
  0: {
    key: 'remark',
    key_a: 'creater',
    key_b: '',
    key_c: '',
    key_d: ''
  },
  //人口
  1: {
    key: 'remark',
    key_a: 'creater',
    key_b: '',
    key_c: '',
    key_d: ''
  },
  //房屋
  2: {
    key: 'remark',
    key_a: 'creater',
    key_b: '',
    key_c: ''
  },
  //企（事）业单位
  3: {
    key: 'remark',
    key_a: 'creater',
    key_b: '',
    key_c: ''
  }
})

const idJson = ref({
  '0': 'top_a',
  '1': 'top_b',
  '2': 'top_c',
  '3': 'top_d'
})

const questionList = ref([
  {
    remark: '122122',
    creater: '21',
    time: '121'
  }
])

const index = ref(props.isType)

const idName = ref(idJson.value[props.isType])

const emit = defineEmits(['onClose', 'handleChange'])

const hanldeClick = (e: any) => {
  idName.value = idJson.value[e.id]
  index.value = e.id
  emit('handleChange', e.id)
}

const close = () => {
  emit('onClose', false)
}
</script>

<style lang="less" scoped>
.sider_info {
  width: 400px;
  height: 294px;
  background: #ffffff;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 9px 9px 9px 9px;
  opacity: 1;
  position: relative;
  border: 2px solid #3e73ec;
  .container {
    padding: 16px 16px;
    .th-title {
      display: flex;
      height: 36px;
      padding: 0 10px;
      // font-weight: bold;
      background: #f2f6ff;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;

      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      color: #171718;
      line-height: 36px;
    }
    .question-list {
      .item {
        display: flex;
        height: 44px;
        padding: 0 10px;
        border-bottom: 1px solid #ebebeb;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;

        .name {
          width: 70px;
          overflow: hidden;
          font-size: 14px;
          font-weight: 500;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #333333;
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap;
        }

        .names {
          margin-left: 70px;
          overflow: hidden;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #666666;
        }

        .time {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: rgba(19, 19, 19, 0.4);
        }
      }
    }
  }
  .right_icon {
    width: 16px;
    height: 24px;
    background: url('../../../../assets/imgs/homes/right_icon.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: absolute;
    left: -11px;
    top: 10px;
  }
  .seder_head {
    width: 100%;
    height: 50px;
    border-top-left-radius: 8px; /* 左上角边框弧形 */
    border-top-right-radius: 8px;
    background: #3e73ec;
    position: relative;
    padding: 10px 0 0 20px;
    .tab_list {
      display: flex;
      .list_li {
        padding: 10px 10px 10px 10px;
        cursor: pointer;
        border-radius: 4px 4px 0px 0px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        // line-height: 19px;
      }
      #list_li {
        background: #ffffff;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #3e73ec;
        font-size: 16px;
        line-height: 19px;
      }
    }
    .close {
      font-size: 16px;
      color: white;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
#top_a {
  position: absolute;
  top: 55px;
  right: -410px;
  z-index: 999;
}
#top_b {
  position: absolute;
  top: 155px;
  right: -410px;
  z-index: 999;
}
#top_c {
  position: absolute;
  top: 305px;
  right: -410px;
  z-index: 999;
}
#top_d {
  position: absolute;
  top: 405px;
  right: -410px;
  z-index: 999;
}
</style>
