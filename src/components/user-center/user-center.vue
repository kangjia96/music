<template>
  <transition name="slide" >
    <div class="user-center">
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <Switches @switchItem="switchItem" :currentIndex="currentIndex" :switches="switches" />
      </div>
      <div ref="playBtn" class="play-btn">
        <i class="icon-play"></i>
        <span class="text" @click.stop="random">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll :data="Songs" ref="scroll" class="list-scroll">
            <div class="list-inner">
              <Songlist :songs="Songs" @select="selectItem"/>
            </div>
        </scroll>
        <div v-show="!Songs.length" class="no-result-wrapper">
          <NoResult :title="NRtext"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Switches from '../../base/switches/switches'
  import { mapGetters, mapActions } from 'vuex';
  import Scroll from '../../base/scroll/scroll'
  import Songlist from '../../base/song-list/song-list'
  import { createSong } from '../../common/js/song'
  import { playlistMixin } from '../../common/js/mixin'
  import NoResult from '../../base/no-result/no-result'

  export default {
    mixins: [ playlistMixin ],
    data () {
      return {
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'},

        ]
      }
    },
    computed: {
      Songs() {
        if (this.currentIndex === 1) {
          return this.playHistory
        } else {
          return this.favoriteList
        }
      },
       NRtext() {
        if (this.currentIndex === 0) {
          return '你还没收藏过歌曲哦'
        } else {
          return '你还没听过歌曲哦'
        }
      },
      ...mapGetters([
        'playHistory',
        'favoriteList'
      ])
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      switchItem(idx) {
        //切换选择
        this.currentIndex = idx
      },
      back() {
        this.$router.push('/')
      },
      selectItem(song, idx) {
        let Song = createSong(song, true)
        this.insertSong(Song)
      },
      random() {
        if (!this.Songs.length) {
          return
        }
        let list = this.Songs.map(it => createSong(it, true))
        this.randomPlay({
          list,
        })
      },

      ...mapActions([
        'insertSong',
        'randomPlay',
      ])
    },
    components: {
      Switches,
      Scroll,
      Songlist,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(-100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>


