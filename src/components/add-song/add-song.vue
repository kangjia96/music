<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <!-- 阻止冒泡到父组件 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <searchBox ref="searchBox" aria-placeholder="搜索歌曲" @query="onQueryChange" />
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switchItem="switchItem" :switches="switches" :currentIndex="currentIndex" />
        <!-- 切换最近播放和搜索历史 -->
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <Songlist @select="selectSong" :songs="playHistory" />
            </div>
          </scroll>
          <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1"
          :data="searchHistory">
          <!-- searchHistory在其mixins中以声明 -->
            <div class="list-inner">
              <searchlist @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory" />
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest @listScroll="blurInput" @select="selectItem" :query="query" :showSinger="showSinger" />
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text" v-html="'一首歌曲已添加到播放队列'"></span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>


<script>
  import searchBox from '../../base/search-box/search-box'
  import suggest from '../suggest/suggest'
  import { searchMixin } from '../../common/js/mixin'
  import switches from '../../base/switches/switches'
  import Scroll from '../../base/scroll/scroll'
  import { mapGetters, mapActions } from 'vuex';
  import Songlist from '../../base/song-list/song-list'
  import { createSong } from '../../common/js/song'
  import Searchlist from '../../base/search-list/search-list'
  import TopTip from '../../base/top-tip/top-tip'
  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'},
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
        ])
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            //将其强制刷新  让其可以进行滚动
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20);
      },
      hide() {
        this.showFlag = false
      },
      selectItem() {
        this.saveSearch()
        this.showTip()
        // this.$emit('hide')
      },
      switchItem(idx) {
        this.currentIndex = idx
      },
      selectSong(song, idx) {
        if (idx !== 0) {
          this.insertSong(createSong(song, true))
        }
        this.showTip()
      },
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      searchBox,
      suggest,
      switches,
      Scroll,
      Songlist,
      Searchlist,
      TopTip
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 12px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        position: relative
        z-index: 500
        font-size: $font-size-medium
        color: $color-text
</style>
