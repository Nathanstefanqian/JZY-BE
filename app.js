// app.js
App({
  async onLaunch() {
    wx.cloud.init({
      env: 'jzy-1gjdmixbb2d05e5f',
      traceUser: true
    })
    // let c1 = new wx.cloud.Cloud({
    //   // 资源方 小程序A的 AppID
    //   resourceAppid: 'wxcd21eb64b26e4b50',
    //   // 资源方 小程序A的 的云开发环境ID
    //   resourceEnv: 'jzy-1gjdmixbb2d05e5f',
    // })

    // // 跨账号调用，必须等待 init 完成
    // await c1.init()

    // wx.cloud.callFunction({
    //   name: 'getOpenId',
    //   complete: res => {
    //     console.log(res)
    //     const { openid } = res.result
    //     wx.setStorageSync('openid', openid)
    //   }
    // })
  },
  globalData: {
    imageCdn: '',
    c1: '1'
  }
})