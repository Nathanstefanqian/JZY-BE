const { params } = require('../data/data')
const AK = "Gkog1Ek1PRtKunUCBFCScZ5T"
const SK = "GCGjj4LmSZf2anDBcifaW9ZbPNP4jUe4"
const checkParams = (name, index) => {
  if(!name) {
    wx.showToast({
      title: `${params[index]}没填哦！`,
      icon: 'error'
    })
    return false
  }
  return true
}

const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
      method: 'POST',
      complete: res => {
        resolve(res.data.access_token)
      }
    })
  })
}

const getOCR = async (tempFilePath) => {
  let fsManager = wx.getFileSystemManager();
  return new Promise((resolve, reject) => {
    fsManager.readFile({ // 转换为base64编码
      filePath: tempFilePath,
      encoding: 'base64',
      success: async data => {
        var base64Data = 'data:image/jpeg;base64,' + data.data;
          wx.request({
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + await getAccessToken(),
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: {
              'id_card_side': 'back',
              'image': base64Data
            },
            complete: res => {
              resolve(res)
            }
          })
      },
      fail: function (err) {
        reject(err)
      }
    })
  })

}

const getCompanyOCR = async (tempFilePath) => {
  let fsManager = wx.getFileSystemManager();
  return new Promise((resolve, reject) => {
    fsManager.readFile({ // 转换为base64编码
      filePath: tempFilePath,
      encoding: 'base64',
      success: async data => {
        var base64Data = 'data:image/jpeg;base64,' + data.data;
          wx.request({
            url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/business_license?access_token=' + await getAccessToken(),
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: {
              'image': base64Data
            },
            complete: res => {
              resolve(res)
            }
          })
      },
      fail: function (err) {
        reject(err)
      }
    })
  })

}

const getTime = (str) => {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formattedDate = `${year}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`;
  const formattedTime = `${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}:${(second < 10 ? '0' : '') + second}`;

  return `${formattedDate} ${formattedTime}`
}

module.exports = {
  checkParams,
  getOCR,
  getCompanyOCR,
  getTime
}
