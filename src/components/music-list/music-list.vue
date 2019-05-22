<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="bgStyle" ref="filter" style="backgroundSize: cover"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll @scroll="scroll" :probeType="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <SongList :rank="rank" :songs="songs" @select="selectItem" />
      </div>
    </Scroll>
    <div class="loading-container" v-show="!songs.length">
      <Loading />
    </div>
  </div>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import SongList from '../../base/song-list/song-list'
  import Loading from '../../base/loading/loading'
  // import { getMusicUrl } from '../../api/song.js'
  import { mapActions } from 'vuex'
  import { getPurUrl } from '../../common/js/getSongData'
  import { playlistMixin } from '../../common/js/mixin'

  const RESERVED_HEIGHT = 40

  export default {
    mixins: [playlistMixin], //mixin的应用 store的playlist数据变化就会调用定义的handlePlaylist函数 组件同名方法会覆盖mixins
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: null,
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false,
      }
    },
    data(){
      return {
        scrollY: 0,
        url: []
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      // console.log(this.songs)
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = - this.imgHeight + RESERVED_HEIGHT
      //因为向上滑动是负值 所以需要算出最多的滚动距离 即上部最少需要 RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imgHeight}px`

      //对列表的top值进行设置  让图片显示出来
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        // console.log(pos)
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      async selectItem(song, idx){ //选中的歌曲idx
        // debugger;
        let list = await getPurUrl(this.songs, idx)
        // let lyric = await getMLyric(song)
        // console.log(lyric)
        // 不能通过下面方式直接修改 songs 直接给store返回一个新的数组
        // await getMusicUrl(song.mid).then(res => {
        //   // console.log(res)
        //   const lurl = res.req.data.freeflowsip[0]
        //   const purl = res.req_0.data.midurlinfo[0].purl
        //   const url = lurl + purl
        //   song.url = url
        // })
        // console.log(song.url)
        this.selectPlay({
          list: list, //整个歌单
          idx: idx
        })
      },
      random() {
        this.randomPlay({
          list: this.songs,
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newVal) {
        let translateY = Math.max(this.minTranslateY, newVal)
        let zIndex = 0
        let scale = 1
        let blur = 0

        // console.log(this.minTranslateY, newVal)
        this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
        const percent = Math.abs(newVal / this.imgHeight)
        if (newVal > 0) {
          scale = 1 + percent
          //向下滚动图片进行放大效果
          zIndex = 10
        } else {
          blur = Math.min(60 * percent, 60)
        }
        this.$refs.filter.style.filter = `blur(${blur}px)`

        //列表滚动的同时对layer元素的对象移动
        if (newVal < this.minTranslateY) {
          //当列表滑动到顶部 对图片进行设置 让图片的z-index大于列表的高度 同时也对图片的高度进行设置 即最少的RESEVER_HEIGHT
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          //当列表滑动正在滑动的时候 让padding撑起图片的宽高比
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        //正常滑动图片z-index为0
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.transform = `scale(${scale})`
        // console.log(zIndex, scale)
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>


<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        transform-origin: top
        width: 100%
        height: 100%
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      // overflow: hidden
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

