// pages/myTiecker/myTiecker.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    MyAllTripCheCi: '',
    height: '100%',
    wxuserid: '',
    tripJson1:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '玩命加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var wxuserid = wx.getStorageSync('wxuserid')
    this.setData({
      wxuserid: wxuserid
    })
  },

  binddetail: function (e) {
    var that = this;
    var ee = e.currentTarget.dataset.index
    var tripJson = that.data.MyAllTripCheCi[ee];
    that.setData({
      tripJson1: tripJson
    })
    var TripDetail = JSON.stringify(tripJson);//转为json字符串
    wx.vibrateShort();
    wx.navigateTo({
      url: '../stationlist/stationlist?TripDetail=' + TripDetail,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    var wxuserid = wx.getStorageSync('wxuserid');
    console.log('myTicker-onShow:' + wxuserid);
    wx.request({
      url: app.getMyAllTripHandleurl, //仅为示例，并非真实的接口地址
      data: {
        openId: wxuserid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: "POST",
      success: function (res) {
        var jsonText = res.data;
        if (jsonText.msg_code == '0000') {
          _this.setData({
            MyAllTripCheCi: jsonText.result,
          })
          if (jsonText.result.length > 5) {
            _this.setData({
              height: 'auto',
            })
          } else {
            _this.setData({
              height: '100%',
            })
          }
        }

      }
    }
    )
  },
  // 添加车次
  formSubmit: function (e) {
    var self = this;
    setTimeout(function () {
      var tripJson = self.data.tripJson1;
      console.log('hhhhhh' + tripJson.utid);
      wx.request({
        url: app.updateDaoZhanFormId, //仅为示例，并非真实的接口地址
        data: {
          formId: e.detail.formId,
          openId: tripJson.userid,
          utid: tripJson.utid,
          tripId: tripJson.tripid
        },
        header: {
          // 'content-type': 'application/json' // 默认值
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        method: "POST",
        success: function (res) {
           console.log("成功添加用户的formid")
        }
      })
    }, 3000)
   
            
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})