const devicesId = "576960151"
const api_key = "akWK2L9aCWt4znaTMEU8Z=peeWg=" 
Page({
  data: {
    temperature: '未获取',
    humidity: '未获取',
    light: '未获取'
  },
  onLoad: function () {
    console.log(`your deviceId: ${devicesId}, apiKey: ${api_key}`)
    //每隔6s自动获取一次数据进行更新
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.upData(datapoints)
      })
    }, 6000)
    wx.showLoading({
      title: '加载中'
    })
    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
      this.firstDraw(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    })
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "正在获取"
    })
    this.getDatapoints().then(datapoints => {
      this.upData(datapoints)
      wx.hideLoading()
    }).catch((error) => {
      wx.hideLoading()
      console.error(error)
    })
  },
  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesId}/datapoints?datastream_id=Light,Temperature,Humidity&limit=20`,
        /**
         * 添加HTTP报文的请求头, 
         * 其中api-key为OneNet的api文档要求我们添加的鉴权秘钥
         * Content-Type的作用是标识请求体的格式, 从api文档中我们读到请求体是json格式的
         * 故content-type属性应设置为application/json
         */
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
            reject(res.data)
            return;
          }
          if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
            reject(response.error)
            return;
          }

          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }

          //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
          resolve({
            temperature: response.data.datastreams[0].datapoints.reverse(),
            light: response.data.datastreams[1].datapoints.reverse(),
            humidity: response.data.datastreams[2].datapoints.reverse()
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  upData: function (datapoints) {
    var valueH = datapoints.humidity[datapoints.humidity.length-1].value
    var valueT = datapoints.temperature[datapoints.temperature.length-1].value
    var valueL = datapoints.light[datapoints.light.length-1].value
    this.setData({
      humidity: valueH,
      temperature: valueT,
      light: valueL,
    });
  },
  firstDraw: function (datapoints) {
    var valueH = datapoints.humidity[datapoints.humidity.length - 1].value
    var valueT = datapoints.temperature[datapoints.temperature.length - 1].value
    var valueL = datapoints.light[datapoints.light.length - 1].value
    this.setData({
      humidity: valueH,
      temperature: valueT,
      light: valueL,
    });
  }
})