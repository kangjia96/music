import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types.js'
//将Mutation名称常量化
import createLogger from 'vuex/dist/logger'
//通过mutations修改state的变化日志
import { playMode } from '../common/js/config'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenList: [],
    mode: playMode.sequence,
    currentIndex: -1,
  },

  getters: {
    singer:  state => state.singer, //歌手
    playing: state => state.playing, //正在播放
    fullScreen: state => state.fullScreen, //全屏
    playlist: state => state.playlist, //播放列表
    sequenList: state => state.sequenList, //
    mode: state => state.mode, //播放模式
    currentIndex: state => state.currentIndex, //选中的下标
    currentSong: state => state.playlist[state.currentIndex] || {} //播放歌曲
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
      state.sequenList = list
    },
    [types.SET_PLAY_MODE] (state, mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX] (state, idx) {
      state.currentIndex = idx
    },
  },

  actions: {
    selectPlay: function({commit, state}, {list, idx}){
      commit(types.SET_SEQUENCE_LIST, list)
      commit(types.SET_PLAYLIST, list)
      commit(types.SET_CURRENT_INDEX, idx)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    }
  },

  strict: debug,
  plugins: debug ? [createLogger()] : []
})
