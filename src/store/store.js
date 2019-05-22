import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types.js'
//将Mutation名称常量化
import createLogger from 'vuex/dist/logger'
//通过mutations修改state的变化日志
import { playMode } from '../common/js/config'
import { shuffle, findSongIndex } from '../common/js/util'
import { getPurUrl } from '../common/js/getSongData'
import { saveSearch, loadSearch, deleteSearch, clearSearch } from '../common/js/cache'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
  },

  getters: {
    singer:  state => state.singer, //歌手
    playing: state => state.playing, //正在播放
    fullScreen: state => state.fullScreen, //全屏
    playlist: state => state.playlist, //播放列表
    sequenceList: state => state.sequenceList, //最近播放列表
    mode: state => state.mode, //播放模式
    currentIndex: state => state.currentIndex, //选中的下标
    currentSong: state => state.playlist[state.currentIndex] || {}, //播放歌曲
    disc: state => state.disc,
    topList: state => state.topList,
    searchHistory: state => state.searchHistory,
  },

  mutations: {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
      state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_MODE] (state, mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX] (state, idx) {
      // getPurUrl(this.playlist, idx)
      // state.playlist = randomPlayList
      state.currentIndex = idx
    },
    [types.SET_DISC] (state, disc) {
      state.disc = disc
    },
    [types.SET_TOPLIST] (state, topList) {
      state.topList = topList
    },
    [types.SET_SEARCH_HISTORY] (state, history) {
      state.searchHistory = history
    }
  },

  actions: {
    selectPlay: async function({commit, state}, {list, idx, Boolean}){
      // console.log(idx)
      commit(types.SET_SEQUENCE_LIST, list)
      if (state.mode === playMode.random) {
        // debugger;
        let randomlist = shuffle(list)
        // console.log(list, idx)
        idx = findSongIndex(randomlist,list[idx])
        let randomPlayList = await getPurUrl(randomlist, idx) //根据歌单获取一个url 让其用户可以播放
        commit(types.SET_PLAYLIST, randomPlayList)
      } else {
        // console.log(list, idx)
        let PlayList = await getPurUrl(list, idx) //根据歌单获取一个url 让其用户可以播放
        commit(types.SET_PLAYLIST, PlayList)
      }
      commit(types.SET_CURRENT_INDEX, idx)
      !Boolean ? commit(types.SET_FULL_SCREEN, true) : ''
      commit(types.SET_PLAYING_STATE, true)

    },
    randomPlay: async function({commit}, {list}) {
      commit(types.SET_PLAY_MODE, playMode.random)
      commit(types.SET_SEQUENCE_LIST, list)
      let randomlist = shuffle(list)
      let randomPlayList = await getPurUrl(randomlist, 0) //根据歌单获取一个url 让其用户可以播放
      commit(types.SET_PLAYLIST, randomPlayList)
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    },
    insertSong: async function ({commit, state}, song) {
      let playlist = state.playlist.slice()
      let sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      // 记录当前歌曲
      let currentSong = playlist[currentIndex]
      // 查找当前列表中是否有待插入的歌曲并返回其索引
      // console.log(playlist, song)
      let fpIndex = findSongIndex(playlist, song)
      // console.log(fpIndex)
      // 因为是插入歌曲，所以索引+1
      currentIndex++
      // 插入当前歌曲到当前索引位置
      playlist.splice(currentIndex, 0, song)
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          playlist.splice(fpIndex, 1)
          currentIndex--
        } else {
          playlist.splice(fpIndex + 1, 1)
        }
      }

      let currentSIndex = findSongIndex(sequenceList, currentSong) + 1
      let fsIndex = findSongIndex(sequenceList, song)
      sequenceList.splice(currentSIndex, 0, song)
      if (fsIndex > -1) {
        if (currentIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }

      let PlayList = await getPurUrl(playlist, currentIndex)
      let SequenceList = await getPurUrl(sequenceList, currentSIndex)
      commit(types.SET_PLAYLIST, PlayList)
      commit(types.SET_SEQUENCE_LIST, SequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    },
    saveSearchHistory: function ({commit}, query) {
      commit(types.SET_SEARCH_HISTORY, saveSearch(query))
    },
    deleteSearchHistory: function ({commit}, query) {
      commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
    },
    clearSearchHistoty: function ({commit}) {
      commit(types.SET_SEARCH_HISTORY, clearSearch())
    },
    deleteSong: async function ({commit, state}, song) {
      let playlist = state.playlist.slice()
      let sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex

      let pIndex = findSongIndex(playlist, song)
      playlist.splice(pIndex, 1)

      let sIndex = findSongIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)

      // console.log(pIndex, sIndex)
      if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
      }
      // console.log(currentIndex)
      let PlayList = await getPurUrl(playlist, currentIndex)
      let SequenceList = await getPurUrl(sequenceList, currentIndex)
      commit(types.SET_PLAYLIST, PlayList)
      commit(types.SET_SEQUENCE_LIST, SequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)

     const playingState = playlist.length > 0
     commit(types.SET_PLAYING_STATE, playingState)
    },

    deleteSongList: function ({commit}) {
      commit(types.SET_PLAYLIST, [])
      commit(types.SET_SEQUENCE_LIST, [])
      commit(types.SET_CURRENT_INDEX, -1)
      commit(types.SET_PLAYING_STATE, false)
    }
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
