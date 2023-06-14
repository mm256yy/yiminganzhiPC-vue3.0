// tab 唯一标识
export const TabDataIds = [1, 2, 3, 4, 5, 6]

// 实采数据公示 tab 数组
export const TabDatas = [
  {
    name: '人口房屋公示',
    id: TabDataIds[0],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '附属物公示',
    id: TabDataIds[1],
    icon: 'bi:device-hdd-fill',
    active: false
  },
  {
    name: '零星(林)果木公示',
    id: TabDataIds[2],
    icon: 'mdi:pine-tree',
    active: false
  },
  {
    name: '村集体公示',
    id: TabDataIds[3],
    icon: 'clarity:house-solid',
    active: false
  },
  {
    name: '土地公示',
    id: TabDataIds[4],
    icon: 'ri:exchange-cny-fill',
    active: false
  },
  {
    name: '坟墓公示',
    id: TabDataIds[5],
    icon: 'tabler:grave-2',
    active: false
  }
]

// 数据导出 type 类型
export const exportTypes = {
  house: 'house', // 人口房屋公示
  appendant: 'appendant', // 附属物公示
  tree: 'tree', // 零星(林)果木公示
  village: 'village', // 村集体公示
  ground: 'ground', // 土地公示
  grave: '坟墓公示' // 坟墓公示
}
