// pages/home/home.js
/*
0 已报名 待录取
1 通过初筛
2 已录取 已结束
3 已拒绝
*/
const { reg } = require('../../config/index')
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, '') // 将小数点及 'Z' 删除
  return formattedTime
}
Page({
  data: {
    isEmpty: false,
    number: ['', '', '', ''],
    show: false,
    contactShow: false,
    bJob: [],
    currentJob: {},
    currentJobId: '',
    phone: '',
    c1: Object,
    job: Object,
    user: Object,
    user_job: Object
  },

  async onLoad(options) {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxcd21eb64b26e4b50',
      resourceEnv: 'jzy-1gjdmixbb2d05e5f',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')    
    const fuser = c1.database().collection('user')    
    const user_job = c1.database().collection('user_job')
    this.setData({ c1, job, user, user_job })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (wx.getStorageSync('openid')) {
      // 获取当前商家所有的岗位
      let { number } = this.data
      const openid = wx.getStorageSync('openid')
      const res = await job.where({ _openid: openid }).orderBy('time', 'desc').get()
      const bJob = []
      res.data.map(item => {
        if (item.state == 0) bJob.push(item)
      }) // 将所有的跟该商家有关的职位全部缓存到bJob
      
      if (!bJob.length) {
        wx.hideLoading()
        let { currentJob } = this.data
        currentJob.jobTitle = '当前未发布职位'
        this.setData({
          currentJob
        })
        return
      } 
      let { currentJob } = this.data
      if(Object.keys(currentJob).length === 0) { // 如果是第一次初始化
        currentJob = bJob[0]
      }
      const jobId = currentJob._id
      // user_job表中查找最近发布的一个职位,并加载与该岗位相关的信息
      let user_jobList = await user_job.where({ jobId }).get() // 获取用户接单列表
      user_jobList = await Promise.all(user_jobList.data.map(async item => {
        let res = await fuser.where({ _openid: item._openid }).get()
        res.data[0].avatarUrl = reg(res.data[0].avatarUrl)
        item.user = res.data[0]
        item.time = formatTime(item.time)
        return item
      }))
      number = number.map((item, index) => {
        return user_jobList.filter(item => item.state == index).length
      })
      this.setData({ user_jobList, currentJob, number, bJob }, () => wx.hideLoading())
    } else {
      wx.hideLoading()
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
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
      show: false,
      contactShow: false
    })
  },
  async onAdmitted(e) {
    const { user_job } = this.data
    const { _id } = e.currentTarget.dataset.index
    await user_job.where({ _id }).update({
      data: {
        state: 2
      }
    })
    wx.showToast({ title: '录取成功' })
    setTimeout(() => this.onLoad(), 2000)

  },
  async onInitialScreening(e) {
    const { user_job } = this.data
    const { _id } = e.currentTarget.dataset.index
    await user_job.where({ _id }).update({
      data: {
        state: 1
      }
    })
    wx.showToast({ title: '通过初筛成功' })
    setTimeout(() => this.onLoad(), 2000)
  },
  async onRefuse(e) {
    const { user_job } = this.data
    const _id = e.currentTarget.dataset.index
    // 同步到数据库
    await user_job.where({ _id }).update({
      data: {
        state: 3
      }
    })
    wx.showToast({ title: '拒绝成功' })
    // 重新读取数据库
    setTimeout(() => this.onLoad(), 2000)

  },
  async onToggleJob(e) {
    const { user_job, user } = this.data
    const { index } = e.currentTarget.dataset // 应该代表职位
    const currentJob = index
    this.setData({ currentJob,show: false },() => 
    { 
      wx.showToast({ title: '切换成功' })
    this.onLoad()
  })
    
  },
  onPhoneCalling(e) {
    console.log(e)
    const { phone } = e.currentTarget.dataset.index.user
    this.setData({ contactShow: true, phone })
  },
  onClipboard(e) {
    const { phone } = this.data
    wx.setClipboardData({
      data: phone,
      success: function (res) {
        wx.showToast({
          title: '电话已复制',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onDetail(e) {
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../resume/resume?id=${index}`
    })
  }
})