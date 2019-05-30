<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >

      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
            @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove"
            @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middlel">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>


          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <!-- 歌词 -->
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current' : currentLineNum === idx}"
                   :key="line.time"
                   v-for="(line, idx) in currentLyric.lines">
                   {{line.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar @percentChange="onProgressBarChange" :percent="percent" />
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click.stop="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)"
                  @click="toggleFavorite(currentSong)" ></i>
            </div>
          </div>

        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFull">
        <div class="icon" :class="cdCls">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <ProgressCircle :radius="32" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          <!-- 阻止冒泡 因为父元素有click事件-->
          </ProgressCircle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i  class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <PlayList ref="playlist" />
    <audio ref="audio" :src="currentSong.url"
           @play="ready" @error="error"
           @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>


<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import animations from 'create-keyframe-animation'
  import { getPurUrl,  } from '../../common/js/getSongData.js'
  import ProgressBar from '../../base/progress-bar/progress-bar'
  import ProgressCircle from '../../base/progress-circle/progress-circle'
  import { playMode } from '../../common/js/config'
  import { getMLyric } from '../../common/js/getSongData'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll/scroll'
  import PlayList from '../playlist/playlist'
  import { playerMixin } from '../../common/js/mixin'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '' //正在播放的歌词
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      cdCls() { //cd盘动画
        return this.playing ? 'play' : 'play-pause'
      },
      playIcon() { //大 控制播放样式
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() { //同上  小
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() { //歌曲url没有换src没有ready 让其按钮变灰色
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      back() { //播放器最小化
        this.setFullScreen(false)
      },
      openFull() { //小播放器切换大播放器
        this.setFullScreen(true)
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        animations.registerAnimation({ // 注册动画
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done) // 运行动画
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = '' // 清除动画
      },
      leave(el, done) { // 离开时的动画 回到原来的小唱片位置
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() { // 清空所有的动画
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform = ''
      },
      togglePlaying() { //播放/暂停
        this.setPlayingState(!this.playing)
        if(this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      end() {
        if (this.mode === playMode.loop) {//单曲循环模式判断
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if(this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      async next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let idx = this.currentIndex
          idx++
          if (idx === this.playlist.length) {
            idx = 0
          }

        const list = await getPurUrl(this.playlist, idx)

        this.setPlayList(list)

        if (!this.playlist[idx].url) {
          return
        } else {
          this.setCurrentIndex(idx)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      async prev() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let idx = this.currentIndex
        idx--
        if (idx === this.playlist.length) {
          idx = 0
        }

        const list = await getPurUrl(this.playlist, idx)
        this.setPlayList(list)

        if (!this.playlist[idx].url) { //待优化
          return
        } else {
          this.setCurrentIndex(idx)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error() { //待完善
        this.songReady = true
      },
      updateTime(e) { //获取歌曲正在的播放时间
        // console.log(this.percent)
        this.currentTime = e.target.currentTime
      },
      format(interval) { //时间转换
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      onProgressBarChange(percent) { //改变歌曲播放进度
        let currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if(this.currentLyric) {
          //歌词跳转
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      async getLyric(song) { //歌词
        try {
          let lyric = await getMLyric(song)
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        } catch (e) {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLyric = 0
        }
        // console.log(this.currentLyric)
      },
      handleLyric({lineNum, txt}) { //歌词滚动
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        // console.log(txt)
        //正在播放的歌词
        this.playingLyric = txt
      },
      //歌词与cd的切换
      middleTouchStart(e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style.transitionDuration = '0ms'
        this.$refs.middlel.style.opacity = 1 - this.touch.percent
        this.$refs.middlel.style.transitionDuration = '0ms'
      },
      middleTouchEnd() {
        let offsetWidth, opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric' //切换cd和歌词
          } else {
            this.offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.8) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style.transitionDuration = '300ms'
        this.$refs.middlel.style.opacity = opacity
        this.$refs.middlel.style.transitionDuration = '300ms'

      },
      showPlaylist() {
        this.$refs.playlist.show()
      },
      _pad(num, n = 2) {//秒数补零
        let len = num.toString().length
        while(len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      _getPosAndScale() { // 小唱片的位置
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width // 对比缩放比例
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      ...mapActions({
        savePlayHistory: 'savePlayHistory'
      })
    },
    watch: {
      currentSong(newSong, oldSong) { //当点击时去修改store currentSong也就被修改播放选中歌曲
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          // this.playing()
          return
        }
        // console.log(this.currentSong) //此处监听currentSong的变化进行播放歌曲
        if (this.currentLyric) { //将上首歌的歌词清空
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        clearTimeout(this.timer) //防止快速切歌  需要把上次的活动清除
        this.timer = setTimeout(() => {//dom异常 在调用dom的时候 src还没有ready 又去调用所以产生异常 所以进行异步处理  下同
          this.getLyric(this.currentSong) //后去当前歌词
          this.$refs.audio.play()
        }, 1000)
      },
      playing(newPlaying) { //播放/暂停
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
  }
</script>


<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: 150
      background: $color-background
      .background
        width: 100%
        height: 100%
        position: absolute
        left: 0
        top: 0
        z-index: -1
        opacity: .6
        -webkit-filter: blur(20px)
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: 22px
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          font-size: $font-size-large
          color: $color-text
          white-space: nowrap
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-ll
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      position: fixed
      display: flex
      bottom: 0
      left: 0
      width: 100%
      height: 60px
      align-items: center
      background: $color-highlight-background
      z-index: 180
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          margin-bottom: 2px
          font-size: $font-size-medium
          color: $color-text
        .desc
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>


