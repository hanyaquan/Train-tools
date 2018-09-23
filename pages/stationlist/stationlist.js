var app = getApp();
Page({
  data: {
    TripDetail: '',
    stationlist: '',
    wxuserid: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var TripDetail = JSON.parse(options.TripDetail);
    that.setData({
      TripDetail: TripDetail,//options为页面路由过程中传递的参数
      stationlist: TripDetail.stations,
    })
    wx.setNavigationBarTitle({
      title: TripDetail.train_no//页面标题为路由参数
    })
    var wxuserid = wx.getStorageSync('wxuserid')
    this.setData({
      wxuserid: wxuserid
    })


  },


  // 删除行程
  deletetrip: function (e) {
    console.log('bbbbbbbbbbb');
    if (this.data.TripDetail.isShare) {
      this.formSubmit(e);
      return;
    }

    wx.vibrateShort();
    var self = this;
    wx.showModal({
      title: '是否确定删除车次：' + self.data.TripDetail.train_no,
      content: '出发日期：' + self.data.TripDetail.startdate + ' ' + self.data.TripDetail.mystartstation + '发往' + self.data.TripDetail.myendstation,
      success: function (res) {
        if (res.confirm) {
          console.log('删除行程');
          var wxuserid = self.data.wxuserid;
          console.log('addtrip-wxuserid:' + wxuserid);
          wx.request({
            url: app.deleteMyTripByUidAndTid, //仅为示例，并非真实的接口地址
            data: {
              openId: wxuserid,
              tripid: self.data.TripDetail.tid,
            },
            header: {
              // 'content-type': 'application/json' // 默认值
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: "POST",
            success: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              var pages = getCurrentPages();
              wx.navigateBack({
                delta: pages - 1
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })


  },

  // 添加车次
  formSubmit: function (e) {
    wx.vibrateShort();
    var self = this;
    wx.showModal({
      title: '是否确定添加车次：' + this.data.TripDetail.train_no,
      content: '出发日期：' + self.data.TripDetail.startdate + ' ' + self.data.TripDetail.mystartstation + '发往' + self.data.TripDetail.myendstation,
      success: function (res) {
        if (res.confirm) {
          console.log('添加行程');
          var wxuserid = self.data.wxuserid;
          wx.request({
            url: app.addtripurl, //仅为示例，并非真实的接口地址
            data: {
              formId: e.detail.formId,
              openId: wxuserid,
              trainNo: self.data.TripDetail.train_no,
              date: self.data.TripDetail.startdate,
              myStartStation: self.data.TripDetail.mystartstation,
              myEndStation: self.data.TripDetail.myendstation
            },
            header: {
              // 'content-type': 'application/json' // 默认值
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: "POST",
            success: function (res) {
              var jsonText = res.data;
              console.log(res);
              if (jsonText.msg_code == '0000') {
                console.log(res.data)
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                });
                var pages = getCurrentPages();
                wx.navigateBack({
                  delta: pages - 1
                })
              }
              else if (jsonText.msg_code == '2001') {
                wx.showToast({
                  title: '您已经添加过该车票，请勿重复添加！',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '添加失败！',
                  icon: 'none',
                  duration: 2000
                })

              }

            }
          })
        } else if (res.cancel) {


        }
      }
    })
  },
  shareClick: function () {
    console.log('bbbbbbb');
    this.onShareAppMessage();
  },
  onShareAppMessage: function () {
    var detail = this.data.TripDetail;
    detail.isShare = true;
    var titles = app.globalData.userInfo.nickName + '车次：' + this.data.TripDetail.train_no + '出发日期：' + this.data.TripDetail.startdate + ' ' + this.data.TripDetail.mystartstation + '发往' + this.data.TripDetail.myendstation;
    var currutDate = new Date();
    var imageurl = 'https://shuoboclub.com/photo/aa.jpg?bb=' + currutDate.getMilliseconds();
    console.log(imageurl);
    return {
      title: titles,
      imageUrl: imageurl,
      desc: '你的火车管家',
      path: '/pages/index/index?TripDetail=' + JSON.stringify(detail)
    }
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {

  }
})