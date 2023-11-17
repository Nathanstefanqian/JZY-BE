// pages/home/home.js
/*
0 已报名 待录取
1 通过初筛
2 已录取 已结束
3 已拒绝
*/
const job = wx.cloud.database().collection('job')
const user = wx.cloud.database().collection('user')
const user_job = wx.cloud.database().collection('user_job')
Page({
  data: {
    isEmpty: false,
    number: ['', '', '', ''],
    show: false,
    bJob: [],
    currentJob: []
  },

  async onLoad(options) {
    // 获取当前商家所有的岗位
    let { number } = this.data
    const openid = wx.getStorageSync('openid')
    const res = await job.where({ _openid: openid }).orderBy('time', 'desc').get()
    const bJob = res.data // 将所有的跟该商家有关的职位全部缓存到data
    this.setData({ bJob })
    // user_job表中查找最近发布的一个职位,并加载与该岗位相关的信息
    const jobId = bJob[0]._id
    const currentJob = bJob[0]
    let user_jobList = await user_job.where({ jobId }).get()
    user_jobList = await Promise.all(user_jobList.data.map(async item => {
      const res = await user.where({ _openid: item._openid }).get()
      item.user = res.data[0]
      return item
    }))
    number = number.map((item, index) => {
      return user_jobList.filter(item => item.state == index).length
    })
    console.log(number)
    this.setData({ user_jobList, currentJob, number })
  },
  onShow() {
    this.onLoad()
  },
  onToggle() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  async onAdmitted(e) {
    console.log(e)
    const { _id } = e.currentTarget.dataset.index
    const res = await user_job.where({ _id }).update({
      data: {
        state: 2
      }
    })
  },
  async onInitialScreening(e) {
    console.log(e)
    const { _id } = e.currentTarget.dataset.index
    const res = await user_job.where({ _id }).update({
      data: {
        state: 1
      }
    })
  },
  async onRefuse(e) {
    console.log(e)
    const _id = e.currentTarget.dataset.index
    // 同步到数据库
    await user_job.where({ _id }).update({
      data: {
        state: 3
      }
    })
    // 重新读取数据库
    this.onLoad()
  },
  async onToggleJob(e) {
    const { index } = e.currentTarget.dataset
    const jobId = index._id
    const currentJob = index
    let { number } = this.data
    let user_jobList = await user_job.where({ jobId }).get()
    user_jobList = await Promise.all(user_jobList.data.map(async item => {
      const res = await user.where({ _openid: item._openid }).get()
      item.user = res.data[0]
      return item
    }))
    number = number.map((item, index) => {
      return user_jobList.filter(item => item.state == index).length
    })
    this.setData({ user_jobList, currentJob, show: false, number })
  },
  async onPhoneCalling(e) {
    console.log(e)
  }
})