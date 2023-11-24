// pages/my/my.js
const { imageUrl } = require('../../config/index')
Page({
  data: {
    imageUrl,
    isLogin: '',
    avatarUrl: '',
    nickName: '',
    name: '',
    verifyType: '',
    verify: Object,
    c1: Object,
    job: Object,
    user: Object,
    user_job: Object
  },

  onShow() {
    this.onLoad()
  },

  async onLoad() {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxcd21eb64b26e4b50',
      resourceEnv: 'jzy-1gjdmixbb2d05e5f',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')    
    const user_job = c1.database().collection('user_job')
    const verify = c1.database().collection('verify')
    this.setData({ c1, job, user, user_job, verify })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let { imageUrl } = this.data
    imageUrl = imageUrl + '/assets/boy.svg'
    let verifyType = ['个人', '企业']
    if(wx.getStorageSync('verify') !== '') { // 如果有的话
      verifyType = verifyType[parseInt(wx.getStorageSync('verify'))]
    }
    else { // 如果没有的话
      verifyType = '未实名'
    }

    this.setData({
      isLogin: wx.getStorageSync('isLogin'),
      avatarUrl: wx.getStorageSync('url') || imageUrl,
      name: wx.getStorageSync('name'),
      nickName: wx.getStorageSync('nickName'),
      major: wx.getStorageSync('major'),
      verifyType
    }, () => wx.hideLoading())
  },

  async onLogin() {
    const { user, c1, verify } = this.data
    // todo
    await c1.callFunction({
      name: 'getOpenId',
      complete: async ress => {
        const { openId } = ress.result.event.userInfo
        const res = await user.where({
          _openid: openId
        }).get()
        if (!res.data.length) { // 如果没找到则引导注册
          wx.navigateTo({
            url: '../edit/edit'
          })
        } 
        else { // 如果找到则立即登录
          const data = res.data[0]
          for (const key in data) {
            wx.setStorageSync(key, data[key])
          }
          const r = await verify.where({ _openid: openId }).get()
          if(r.data[0]) {
            const { type } = r.data[0]
            wx.setStorageSync('verify', parseInt(type))
          }
          wx.setStorageSync('openid', openId)
          wx.setStorageSync('isLogin', true)
          wx.showToast({ title: '登录成功' })
          setTimeout(() => this.onLoad(), 2000)
        }
      }
    })
  },

  onEdit() {
    if (wx.getStorageSync('isLogin')) {
      wx.navigateTo({
        url: '../edit/edit?id=1',
      })
    } else {
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
  },

  onTap() {
    wx.navigateTo({
      url: '../star/star',
    })
  },

  onExit() {
    wx.clearStorageSync()
    wx.setStorageSync('isLogin', false)
    wx.showToast({ title: '退出成功' })
    setTimeout(() => this.onLoad(), 2000)
  },

  onVerify(e) {
    if (wx.getStorageSync('isLogin')) {
      wx.navigateTo({
        url: '../verify/verify'
      })
    } else {
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
  },

  onState() {
    wx.navigateTo({
      url: '../state/state'
    })
  },

  onProxy() {
    wx.navigateTo({
      url: '../proxy/proxy',
    })
  }
})