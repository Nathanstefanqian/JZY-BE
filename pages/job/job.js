Page({
  data: {
    option1: [
      { text: '全部', value: 0 },
      { text: '招聘中', value: 1 },
      { text: '待发布', value: 2 },
      { text: '已下线', value: 3 },
      { text: '审核驳回', value: 4 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',
    show: false
  },
  onPop() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  }
});