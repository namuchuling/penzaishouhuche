// start.js

Page({
  data: {
   Tdate:'请点击输入',
   wDuration: '请输入'
  },
  //跳转到天气页面
  navigate: function () {
    wx.showToast({
      title: '获取成功',
      duration:1000,
      icon: "success"
    }),
    wx.navigateTo({
      url: '../wifi_station/tianqi/tianqi',
    })
  },
  datechange:function(e){
    let value=e.detail.value;
    this.setData({
     Tdate:value
    });
  },
  wPeriod: function(e){
    let value= e.detail.value;
    this.setData({
      wDuration: value
    });
  }
})