// app.js
App({
  async onLaunch() {
    wx.cloud.init({
      env: 'jzy-1gjdmixbb2d05e5f',
      traceUser: true
    })
    let c1 = new wx.cloud.Cloud({
      // 资源方 小程序A的 AppID
      resourceAppid: 'wxb6b66008bee95427',
      // 资源方 小程序A的 的云开发环境ID
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })

    // // 跨账号调用，必须等待 init 完成
    await c1.init()
    // 入口处获取openid
    await c1.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('获取', res)
        const { openId } = res.result.event.userInfo
        wx.setStorageSync('openid', openId)
      }
    })
  },
  globalData: {
    imageCdn: '',
    c1: '1'
  }
})