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
const getCurrentLocation = () => {

}
Page({
  data: {
    isEmpty: false,
    show: false,
    contactShow: false,
    bJob: [],
    currentJob: {},
    currentJobId: '',
    phone: '',
    c1: Object,
    job: Object,
    user: Object,
    user_job: Object,
    takeaway: Object,
    user_take: Object,
    userLocation: Object,
    progress: 0,
    latitude: '',
    longitude: '',
    ihaveDeliveredUrl: '',
    ihaveTakenUrl: '',
    markers: []
  },
  onReset() {
    this.setData({
      progress: 0,
      latitude: '',
      longitude: '',
      ihaveDeliveredUrl: '',
      ihaveTakenUrl: '',
      markers: [],
      isEmpty: false,
      show: false,
      contactShow: false,
      bJob: [],
      currentJob: {},
      currentJobId: '',
      phone: '',
    })
  },

  async onLoad(options) {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')
    const fuser = c1.database().collection('user')
    const user_job = c1.database().collection('user_job')
    const user_take = c1.database().collection('user_take')
    const takeaway = c1.database().collection('takeaway')
    const userLocation = c1.database().collection('userLocation')
    this.setData({ c1, job, user, user_job, takeaway, user_take, userLocation })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (wx.getStorageSync('isLogin')) {

      // 获取当前位置加载到地图上
      const that = this
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          // 获取用户当前位置成功
          this.setData({ latitude: res.latitude, longitude: res.longitude })
        }
      })

      const openid = wx.getStorageSync('openid')
      const res = await takeaway.where({ _openid: openid }).orderBy('time', 'desc').get()
      const bJob = []

      // 将当前正在跑腿的职位渲染到页面上, 同一时刻只会有一笔正在进行的跑腿
      res.data.map(item => {
        if (item.state == 0 || item.state == 1) bJob.push(item)
      }) 

      // 如果没有职位
      if (!bJob.length) {
        wx.hideLoading()
        let { currentJob } = this.data
        currentJob.jobTitle = '当前未发布跑腿'
        this.setData({ currentJob })
        return
      }

      // 如果是有职位的
      let currentJob = bJob[0]
      const jobId = currentJob._id

      // 查询是否有人接单
      let user_jobList = await user_take.where({ jobId }).get()
      user_jobList = await Promise.all(user_jobList.data.map(async item => {
        let res = await fuser.where({ _openid: item._openid }).get()
        res.data[0].avatarUrl = reg(res.data[0].avatarUrl)
        item.user = res.data[0]
        item.time = formatTime(item.time)
        return item
      }))
      console.log('列表', user_jobList)

      // 如果有人接单的话
      if(user_jobList.length) {
        const user_jobItem = user_jobList[0]
        this.setData({ progress: user_jobItem.progress })
        if(user_jobItem.ihaveDeliveredUrl) this.setData({ ihaveDeliveredUrl: reg(user_jobItem.ihaveDeliveredUrl) })
        if(user_jobItem.ihaveTakenUrl) this.setData({ ihaveTakenUrl: reg(user_jobItem.ihaveTakenUrl) })
      }
      
      // 渲染取货地点和送达地点
      const { workPlace, destPlace } = currentJob
      let markers = [{ id: 1, latitude: workPlace.latitude, longitude: workPlace.longitude,
        callout:{ content: '取货地', display: 'ALWAYS'}, width: '25px', height: '25px' },
        { id: 2, latitude: destPlace.latitude, longitude: destPlace.longitude,
          callout:{ content: '送货地', display: 'ALWAYS'}, width: '25px', height: '25px' }
        ]
      this.setData({  markers })

      setInterval(async () => {
        const location = await userLocation.where({ jobId }).get()
        console.log(location)
      }, 10000)
      this.setData({ user_jobList, currentJob, bJob }, () => wx.hideLoading())
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

  onCancel() {
    
  },

  onPreview(e) {
    console.log(e)
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: [url]
    })
  },

  async onIhaveGot() {
    const { takeaway, user_take, currentJob } = this.data
    // takeaway的状态变为3
    await takeaway.where({ _id: currentJob._id }).update({
      data: { state: 3 }
    })
    // user_take的状态变为2 并记入完成时间
    const completeTime = new Date()
    await user_take.where({ jobId: currentJob._id }).update({
      data: { state: 2, cTime: completeTime }
    })
    wx.showToast({ title:'确认成功'})
    const that = this
    setTimeout(() => that.onReset(), 2000)
  },

  onClose() {
    this.setData({
      show: false,
      contactShow: false
    })
  },

  onPopup() {
    this.setData({
      show: true
    })
  },

  onLog() {
    wx.navigateTo({
      url: '../log/log'
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