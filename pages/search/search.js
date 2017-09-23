// pages/search/search.js
var bsurl = require("../../utils/baseurl.js");
var common = require('../../utils/util.js');
var async = require("../../utils/async.js");
var nt = require("../../utils/nt.js");
var searchlist = require("../../utils/searchtypelist.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: { tab: searchlist[0].type, index: 0 },
    value: "",
    tabs: searchlist,
    recent: wx.getStorageSync("recent") || [],
    loading: false,
    prevalue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var v = options.key;
    v && this.search(v)
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

  },
  // search
  httpsearch: function (name, offset, type, cb, err) {
    wx.request({
      url: bsurl + 'search',
      data: {
        keywords: name,
        offset: offset,
        limit: 20,
        type: type
      },
      method: 'GET',
      success: function (res) {
        // console.log(cb),
          cb && cb(res.data.result)
      },
      fail: function () {
        err && err();
      }
    })
  },
  inputext: function (e) {
    var name = e.detail.value;
    this.setData({ value: name });
  },
  /* tabtypelist */
  tabtype: function (e) {
    var index = e.currentTarget.dataset.index;
    var curtab = this.data.tabs[index];
    var type = e.currentTarget.dataset.tab;
    var that = this;
    var tl = that.data.tabs;
    if (!curtab.loading) {
      this.httpsearch(this.data.prevalue, curtab.offset, type, function (res) {
        curtab.relist = res;
        curtab.loading = true;
        var playcount = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || [];
        for (let i = 0; i < playcount.length; i++){
          playcount[i].playCount = common.numToStr(playcount[i].playCount);
        };
        console.log(playcount);
        var resultarry = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || [];
        curtab.offset = resultarry.length
        var size = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
        size = size ? size : 0;
        curtab.none = curtab.offset >= size ? true : false;
        // console.log(resultarry);
        tl[index] = curtab;
        that.setData({
          tabs: tl,
          playcount: playcount
        })
      }, function () {
        curtab.loading = true;
        curtab.none = true;
        tl[index] = curtab;
        that.setData({
          tabs: playcount
        })
      })
    }
    this.setData({
      tab: {
        tab: type,
        index: index
      }
    })
  },
  search: function (name) {
    if (!name || (name == this.data.prevalue)) return;
    var index = this.data.tab.index;
    var tl = searchlist;
    this.setData({
      tabs: tl,
      prevalue: name,
      value: name,
      loading: true
    });
    var curtab = this.data.tabs[index]
    var that = this;
    tl = this.data.tabs;
    this.httpsearch(name, curtab.offset, this.data.tab.tab, function (res) {
      curtab.relist = res;
      curtab.loading = true;
      var resultarry = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || []
      curtab.offset = resultarry.length
      var size = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
      size = size ? size : 0;
      curtab.none = curtab.offset >= size ? true : false;
      tl[index] = curtab;
      var recent = that.data.recent;
      var curname = recent.findIndex(function (e) { return e == name });
      if (curname > -1) {
        recent.splice(curname, 1)
      }
      recent.unshift(name);
      wx.setStorageSync('recent', recent)
      that.setData({
        tabs: tl,
        loading: true,
        recent: recent,
        prevalue: name
      });

    }, function () {
      curtab.loading = true;
      curtab.none = true;
      tl[index] = curtab;
      that.setData({
        tabs: tl
      })
    })
  },
  searhFrecent: function (e) {
    this.search(e.currentTarget.dataset.value)
  },
  searhFinput: function (e) {
    this.search(e.detail.value.name)
  },
  onReachBottom: function (e) {
    var tl = this.data.tabs,
      that = this;
    var curtab = tl[this.data.tab.index];
    if (curtab.none) { return; }
    curtab.loading = false;
    tl[this.data.tab.index] = curtab
    this.setData({
      tabs: tl
    })
    this.httpsearch(this.data.prevalue, curtab.offset, this.data.tab.tab, function (res) {
      curtab.loading = true;
      var resultarry = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || [];
      var size = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
      size = size ? size : 0;
      var length = resultarry.length
      curtab.offset = curtab.offset + length;
      curtab.none = curtab.offset >= size ? true : false;
      curtab.relist.songs = curtab.relist.songs ? curtab.relist.songs.concat(resultarry) : null;
      curtab.relist.artists = curtab.relist.artists ? curtab.relist.artists.concat(resultarry) : null;
      curtab.relist.albums = curtab.relist.albums ? curtab.relist.albums.concat(resultarry) : null;
      curtab.relist.playlists = curtab.relist.playlists ? curtab.relist.playlists.concat(resultarry) : null;
      curtab.relist.mvs = curtab.relist.mvs ? curtab.relist.mvs.concat(resultarry) : null;
      curtab.relist.djprograms = curtab.relist.djprograms ? curtab.relist.djprograms.concat(resultarry) : null;
      curtab.relist.userprofiles = curtab.relist.userprofiles ? curtab.relist.userprofiles.concat(resultarry) : null;
      tl[that.data.tab.index] = curtab
      that.setData({
        tabs: tl
      })
    }, function () {
      curtab.loading = true;
      curtab.none = true;
      tl[that.data.tab.index] = curtab
      that.setData({
        tabs: tl
      })
    })
  },
  // 点击叉叉取消搜索
  clear_kw: function () {
    this.setData({
      value: "",
      loading: false,
      tabs: searchlist,
      prevalue: ""
    })
  },
  // 清除历史记录
  del_research: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.recent.splice(index, 1);
    this.setData({
      recent: this.data.recent
    })
    wx.setStorageSync('recent', this.data.recent)
  }
})