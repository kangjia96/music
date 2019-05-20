<template>
  <div class="recommend" ref="recommend">
    <Scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- 没有叨叨数据的情况下 会先加载Loading组件 让用户进行等待 -->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div :key="item.id" v-for="item of recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.dissid" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading />
      </div>
    </Scroll>
  </div>
</template>

<script>
  import Loading from "../../base/loading/loading"
  import Slider from "../../base/slider/slider"
  import Scroll from "../../base/scroll/scroll"
  import { getRecommend, getDiscList } from "../../api/recommend"
  import { ERR_OK } from '../../api/config'
  import { playlistMixin } from '../../common/js/mixin'

  export default {
    mixins: [playlistMixin], //组件同名方法会覆盖mixins
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend() //在组件实例创建之后才请求数据
      this._getDiscList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() { //封装jsonp请求 得到数据
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            // console.log(res)
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            // this.recommends = res.data.slider
            this.discList = res.data.list
            console.log(res.data.list)
          }
        })
      },
      loadImage() {
        if (!this.checkloaded) {
          this.$refs.scroll.refresh()
          this.checkloaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading,
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable.styl'
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        // height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          display: flex
          align-items: center
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          text-align: left
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>


