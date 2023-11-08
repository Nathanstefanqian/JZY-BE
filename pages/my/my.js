// pages/my/my.js
const user = wx.cloud.database().collection('buser')
Page({
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
    name: wx.getStorageSync('name'),
    major: wx.getStorageSync('major'),
    grade: wx.getStorageSync('grade'),
    data: [1,2,3,4]
  },

  onLoad() {

  },
  onLogin() {
    
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
      url: '../state/state',
    })
  }
})