<template>
  <div class="data-fill">
    <ElButton
      @click="onBack"
      :icon="BackIcon"
      type="default"
      class="px-9px py-0px !h-28px mr-8px !text-12px"
    >
      返回
    </ElButton>
    <!-- 上面区域 -->
    <div class="between">
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">居民户</div></div
          >
        </div>

        <Echart style="padding-top: 20px" :options="householdOption" :height="300" />
      </div>
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">村集体</div></div
          >
        </div>

        <Echart style="padding-top: 20px" :options="villageOption" :height="300" />
      </div>
    </div>
    <!-- 中间区域 -->
    <div class="between">
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">企(事)业单位</div></div
          >
        </div>
        <Echart style="padding-top: 20px" :options="enterpriseOption" :height="350" />
      </div>
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">专业项目</div></div
          >
        </div>
        <Echart style="padding-top: 20px" :options="specialityOption" :height="350" />
      </div>
    </div>
    <!-- 下面区域 -->
    <div class="between">
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">其他费用</div></div
          >
        </div>

        <Echart style="padding-top: 20px" :options="otherOption" :height="300" />
      </div>
      <div class="common-color background">
        <div class="border_box">
          <div class="aliam-center">
            <div class="line"></div>
            <div class="strong">有关税费</div></div
          >
        </div>
        <Echart style="padding-top: 20px" :options="taxationOption" :height="300" />
      </div>
    </div>
    <bottomTarg />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import tabButton from '../Home/components/tabButton.vue'
import bottomTarg from '../Home/components/bottomTarg.vue'
import { useIcon } from '@/hooks/web/useIcon'
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const tabList = [
  {
    title: '企业'
  },
  {
    title: '水电站'
  }
]
const tab = (index) => {
  console.log(index, '123123132')
}
//居民户视图
const householdOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },

  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [
      '竹潭村',
      '小泉溪村',
      '殿前村',
      '下潘村',
      '大畈村',
      '潭角村',
      '后染村',
      '里镜屏村',
      '溪西村',
      '安山村'
    ]
  },
  yAxis: {
    type: 'value',
    name: '单位(元)'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000, 1500],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100, 1800],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
//村集体视图
const villageOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [
      '竹潭村',
      '小泉溪村',
      '殿前村',
      '下潘村',
      '大畈村',
      '潭角村',
      '后染村',
      '里镜屏村',
      '溪西村',
      '安山村'
    ]
  },
  yAxis: {
    name: '单位(元)',
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000, 1500],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100, 1800],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF  ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
//企(事)业单位视图
const enterpriseOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [
      '新昌县金禾纺织有限公司',
      '新昌县镜屏欣欣纺织器材厂',
      '新昌县新亚建筑工程有限公司',
      '新昌县明盛纺织有限公司'
    ]
  },
  yAxis: {
    name: '单位(元)',
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000],
      type: 'bar',
      barWidth: 62,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100],
      type: 'bar',
      barWidth: 62,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
//专业项目视图
const specialityOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [
      '交通',
      '电力',
      '电信',
      '移动',
      '联通',
      '铁塔',
      '广电',
      '溪西水文站',
      '县级文保站',
      '宗教设施'
    ]
  },
  yAxis: {
    name: '单位(元)',
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000, 1500],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100, 1800],
      type: 'bar',
      barWidth: 18,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
//其他费用视图
const otherOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [
      '前期工作费',
      '综合勘测科研费',
      '实施管理费',
      '实施机构开办费',
      '技术培训费',
      '监督评估费',
      ''
    ]
  },
  yAxis: {
    name: '单位(元)',
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000, 1500],
      type: 'bar',
      barWidth: 25,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100, 1800],
      type: 'bar',
      barWidth: 25,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF ' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
//有关税费视图
const taxationOption = ref({
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      return (
        params[0].name +
        '<br/>' +
        params[0].seriesName +
        ':' +
        params[0].value +
        '元' +
        '<br/>' +
        params[1].seriesName +
        ':' +
        params[1].value +
        '元'
      )
    }
  },
  legend: {
    //   指示框名字  注意！要和下方series中的name一起改
    data: ['应付', '已付'],
    // 指示框位置  距离上下左右多少
    right: '10%',
    top: '10%',
    textStyle: {
      color: '#666666 ' //字体颜色
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['耕地占用费', '耕地开垦费', '森林植被恢复费', '养老保险缴费补贴']
  },
  yAxis: {
    name: '单位(元)',
    type: 'value'
    // data: ['0-17岁', '18-35岁', '36-49岁', '50-65岁', '65岁以上岁', '村6', '村7', '村8']
  },
  series: [
    {
      name: '应付',
      data: [1400, 1800, 3000, 2000],
      type: 'bar',
      barWidth: 60,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#5E8AEF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#8EBBFF' // 100% 处的颜色
          // }
        ]
      }
    },
    {
      name: '已付',
      data: [1200, 1300, 2500, 2100],
      type: 'bar',
      barWidth: 60,
      // stack: 'all',
      color: {
        type: 'linear',
        x: 0, // 右
        y: 0, // 下
        x2: 0, // 左
        y2: 1, // 上
        colorStops: [
          {
            offset: 0,
            color: '#D2DFFF' // 0% 处的颜色
          }
          // {
          //   offset: 1,
          //   color: '#FF8E8E ' // 100% 处的颜色
          // }
        ]
      }
    }
  ]
})
const { back } = useRouter()
const onBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.data-fill {
  width: 100%;
}

.common-color {
  width: 100%;
  /* background-color: white; */
  padding: 10px;
  margin: 10px 0px auto;
  border-radius: 5px;
}

.between {
  display: flex;
  justify-content: space-between;
}

.arround {
  display: flex;
  justify-content: space-around;
}

.center {
  display: flex;
  justify-content: center;
}

.aliam-center {
  z-index: 99;
  display: flex;
  align-items: center;
}

.strong {
  font-weight: bolder;
}

.line {
  width: 4px;
  height: 14px;
  margin-right: 8px;
  background: #3e73ec;
}

.title-padding {
  padding: 18px 2px;
  font-size: 14px;
}

.background {
  position: relative;
  width: 49.5%;
  background-color: white;

  .border_box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 50px;
    padding: 10px;
    background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
    border: 4px solid #ffffff;
    border-radius: 8px 8px 0px 0px;
    opacity: 1;
  }
}
</style>
