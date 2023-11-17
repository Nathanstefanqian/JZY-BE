// pages/my/my.js
const user = wx.cloud.database().collection('buser')
const refresh = () => {
  var currentPages = getCurrentPages();
  var currentPage = currentPages[currentPages.length - 1];
  currentPage.onLoad(); // 触发页面的 onLoad 方法
}
Page({
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    avatarUrl: wx.getStorageSync('url') || '../../assets/boy.svg',
    nickName: wx.getStorageSync('nickName'),
    name: wx.getStorageSync('name'),
    verifyType: wx.getStorageSync('verifyType'),
    data: [1, 2, 3, 4]
  },

  onLoad() {
    this.setData({
      isLogin: wx.getStorageSync('isLogin'),
      avatarUrl: wx.getStorageSync('url') || '../../assets/boy.svg',
      name: wx.getStorageSync('name'),
      nickName: wx.getStorageSync('nickName'),
      major: wx.getStorageSync('major'),
      verifyType: wx.getStorageSync('verifyType')
    })
  },
  async onLogin() {
    const openid = wx.getStorageSync('openid')
    const res = await user.where({
      _openid: openid
    }).get()
    console.log(res)
    if (!res.data.length) { // 如果没找到则引导注册
      wx.navigateTo({
        url: '../edit/edit'
      })
    } else { // 如果找到则立即登录
      const data = res.data[0]
      console.log(data)
      for (const key in data) {
        wx.setStorageSync(key, data[key])
      }
      wx.setStorageSync('isLogin', true)
      wx.showToast({ title: '成功' })
      refresh()
    }
  },

  onEdit() {
    wx.navigateTo({
      url: '../edit/edit'
    })
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
    refresh()
  },

  onPersonal(e) {
    wx.navigateTo({
      url: '../personal/personal',
    })
  },

  onVerify(e) {
    wx.navigateTo({
      url: '../verify/verify'
    })
  },

  onBasic(e) {
    wx.navigateTo({
      url: '../edit/edit',
    })
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