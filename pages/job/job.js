const job = wx.cloud.database().collection('job')
const user_job = wx.cloud.database().collection('user_job')
const formatTime = (timeString) => {
  const date = new Date(timeString);
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, ''); // 将小数点及 'Z' 删除
  return formattedTime;
};

Page({
  data: {
    option1: [
      { text: '全部', value: 0 },
      { text: '招聘中', value: 1 },
      { text: '待发布', value: 2 },
      { text: '已下线', value: 3 },
      { text: '审核驳回', value: 4 }
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' }
    ],
    value1: 0,
    value2: 'a',
    jobList: [],
    user_JobList: [],
    show: false,
    currentIndex: '',
    currentState: '',
    stateName: ['进行中', '已暂停', '已关闭'],
    stopTitle: ''
  },
  async onLoad(e) {
    const openid = wx.getStorageSync('openid')
    const res = await job.where({ _openid: openid }).get()
    const jobList = res.data.map(item => {
      item.time = formatTime(item.time) // 将时间对象转换为 ISO 格式的字符串
      item.updateTime = formatTime(item.updateTime) // 将时间对象转换为 ISO 格式的字符串
      return item
    })
    const user_jobList = await Promise.all(jobList.map(async item => {
      // 拿到该职位所有的人关注的数据
      let result = await user_job.where({ jobId: item._id }).get()
      return result.data
    }))

    this.setData({ user_jobList, jobList })
  },
  onPop(e) {
    const { index, state } = e.currentTarget.dataset
    let stopTitle = ''
    if (state == 0) stopTitle = '暂停职位'
    else if (state == 1) stopTitle = '恢复职位'
    this.setData({
      show: true,
      currentIndex: index,
      stopTitle,
      currentState: state
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  async onStop() {
    const { currentIndex, currentState } = this.data
    await job.where({ _id: currentIndex }).update({
      data: { state: currentState == 0 ? 1 : 0 }
    })
    this.onLoad()
    this.setData({
      show: false
    })
    wx.showToast({ title: currentState == 0 ? '暂停成功' : '恢复成功' })
  },
  async onRefresh(e) {
    const { index } = e.currentTarget.dataset
    const currentTime = new Date()
    await job.where({ _id: index }).update({
      data: { updateTime: currentTime }
    })
    this.onLoad()
    wx.showToast({ title: '刷新成功' })
  },
  async onModify() {
    const { currentIndex } = this.data
    const res = await job.where({ _id: currentIndex }).get()
    const item = res.data[0]
    wx.setStorageSync('job', item)
    wx.switchTab({
      url: '../publish/publish'
    })
    wx.setStorageSync('isJump', true)
  },
  async onCloseJob() {
    const { currentIndex } = this.data
    await job.where({ _id: currentIndex }).update({
      data: { state: 2 }
    })
    this.onLoad()
    this.setData({
      show: false
    })
    wx.showToast({ title: '关闭成功' })
  }
})