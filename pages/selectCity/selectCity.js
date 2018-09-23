// pages/selectCity/selectCity.js
// 引入组件js 文件
// const CityIndexList = require('../../wx-list-index/List-index.js')
const CityIndexList = require('../../wx-list-index/wx-list-index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var city = new CityIndexList(this);


    // 数据格式 （严格）
    let arr = [
      {
        title: "⭐",
        item: [
          {
            name: "123",
            key: "A"
          }
        ]

      },
      {
        title: "A",
        item: [
          {
            name: "234",
            key: "B"
          }
        ]

      }
    ]
    // 重置数据
    city.setting(function (set) {
      // set.data(arr); 
    })
    // 点击事件
    city.tap(function (e) {
      console.log(e)
    })

    console.log(city.api)
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