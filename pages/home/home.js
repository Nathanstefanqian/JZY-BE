// pages/home/home.js
Page({
  data: {
    isEmpty: false,
    show: false
  },

  onLoad(options) {

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
  }
})