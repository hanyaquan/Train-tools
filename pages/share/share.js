// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xingcheng: '',
    shareImgSrc: '',
    isshow: true,
    mmm: true,
    start: '',
    end: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var parmJson = JSON.parse(options.parmJson);
    that.setData({
      xingcheng: parmJson,//options为页面路由过程中传递的参数
      start: parmJson.ss,
      end: parmJson.es,
    })
  },
  redictIndex: function () {
    wx.vibrateShort();
    wx.redirectTo({
      url: '../index/index'
    });

  },
  redictToKaquan: function () {
    wx.navigateToMiniProgram({
      appId: 'wx048c468142e94ab2',
      path: 'pages/index/index?merchantId=19',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  shareToFriend: function () {
    var that = this;
    //4. 当用户点击分享到朋友圈时，将图片保存到相册
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgSrc,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，去发圈噻~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                isshow: true,
                mmm: false
              })
            }
          }
        })
      }
    })
  },
  genhaibao: function () {
    var that = this;
    that.setData({
      mmm: true
    })
    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('myCanvas');
    var bgImgPath = '../../img/shareback.png';
    ctx.drawImage(bgImgPath, 40, 30, 270, 450);
    ctx.setFillStyle('white')
    ctx.fillRect(40, 400, 270, 80);
    ctx.setFontSize(17)
    ctx.setFillStyle('#111111')
    ctx.fillText('经历', 60, 180)
    ctx.setFontSize(17)
    ctx.setFillStyle('#111111')
    ctx.fillText('历时', 60, 220)
    ctx.setFontSize(17)
    ctx.setFillStyle('#111111')
    ctx.fillText('我从', 60, 260)
    ctx.setFontSize(17);
    if (that.data.start.length + that.data.start.length > 8) {
      ctx.setFillStyle('#111111');
      ctx.fillText("来到", 60, 300);
    } else {
      ctx.setFillStyle('#111111');
      ctx.fillText("来到", 150 + 22 * (that.data.start.length - 2), 260);
    }
    ctx.setFontSize(21)
    ctx.setFillStyle('#0085d0')
    ctx.fillText(that.data.xingcheng.num + '站', 105, 180)
    ctx.fillText(that.data.xingcheng.time, 105, 220)
    ctx.fillText(that.data.xingcheng.ss, 105, 260)
    if (that.data.start.length + that.data.start.length > 8) {
      ctx.setFontSize(21);
      ctx.setFillStyle('#0085d0');
      ctx.fillText(that.data.xingcheng.es, 105, 300);
    } else {
      ctx.setFontSize(21);
      ctx.setFillStyle('#0085d0');
      ctx.fillText(that.data.xingcheng.es, 190 + 22 * (that.data.start.length - 2), 260);
    }
    ctx.setFontSize(20)
    ctx.setFillStyle('#FF8C69')
    // ctx.fillText('我在' + that.data.xingcheng.es + '，有空来约', 70, 430)
    ctx.fillText('长按图片体验智能旅行', 70, 430);
    ctx.draw()
    wx.canvasToTempFilePath({
      x: 40,
      y: 30,
      width: 270,
      height: 450,
      destWidth: 810,
      destHeight: 1350,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          shareImgSrc: res.tempFilePath
        })

      },
      fail: function (res) {
        console.log(res)
      }
    })
    that.setData({
      isshow: false,
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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