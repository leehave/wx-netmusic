// pages/recom/recom.js
var bsurl = require("../../utils/baseurl.js");
var common = require('../../utils/util.js');
var async = require("../../utils/async.js");
var nt = require("../../utils/nt.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loading: true
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
    this.playList()
  },
  /* 
  时间戳转化
   */
  addTime: function (m) { return m < 10 ? '0' + m : m },
  formatTime: function (time) {
    var time = new Date(time);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return this.addTime(m) + '月' + this.addTime(d) + '日';
  },
  /* 
  热歌榜
   */
  playList: function () {
    var that = this
    wx.request({
      url: bsurl + "playlist/detail?id=3778678",
      data: { cookie: app.globalData.cookie },
      success: function (res) {
        let singlist = res.data.playlist.tracks;
        let createTime = res.data.playlist.updateTime;
        var format = that.formatTime(createTime);
        that.setData({
          list: res.data,
          singlist: singlist,
          updataTime: format
        })
      }
    })
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
