import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '../../common/js/config'
import { shuffle } from './util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(this.playlist)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = { //与引进的组件的共享所有状态
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode () { //播放模式切换
      // console.log('old', this.sequenceList)
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        // 利用shuffle函数对列表进行打乱
        list = shuffle(this.playlist)
      } else {
        list = this.playlist
      }
      this.resetCurrentIndex(list)
      //对播放列表进行重置
      this.setPlayList(list)
      // this.set
    },
    resetCurrentIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      console.log(index)
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (!this.isFavorite(song)) {
      console.log('run')
        this.saveFavoriteList(song)
      } else {
        this.deleteFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    isFavorite(song) {
      const idx = this.favoriteList.findIndex(item => item.id === song.id)
      return idx > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAYLIST',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'setPlayingState'
    ])
  }
}


export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
    ])
  },
  methods: {
    blurInput () {//滑动之前将移动端键盘收起
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      // console.log('run')
      //本地缓存选中的Key
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) { //监听search输入框的输入文字改变事件
      // console.log('run123')
      this.query = query
    },
    addQuery (query) {
      //调用组件暴露的函数 向输入框中填入关键词
      // console.log(this.$refs.searchBox)
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  },
}
