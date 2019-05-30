<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <!-- 仅仅阻止冒泡 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click.stop="changeMode"></i>
            <span class="text" v-html="modeText"></span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <Scroll class="list-content" ref="listContent" :refreshDelay="refreshDelay" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item, idx) of sequenceList" :key="idx" @click="selectItem(item, idx)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)" >
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" ref="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <Confirm @confirm="confirmClear" ref="confirm" text="是否清空此列表" confirmBtnText="清空" />
      <AddSong ref="addsong"  />
    </div>
  </transition>
</template>

<script>
  import { mapActions } from 'vuex';
  import Scroll from '../../base/scroll/scroll'
  import { playMode } from '../../common/js/config'
  import Confirm from '../../base/confirm/confirm'
  import { playerMixin } from '../../common/js/mixin'
  import AddSong from '../add-song/add-song'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 100, //需要重新传递refresh的刷新时间 强制其刷新
      }
    },
    computed: {
      modeText() {
        if (playMode.random === this.mode) {
          return '随机播放'
        } else if (playMode.loop === this.mode) {
          return '单曲循环'
        } else {
          return '顺序播放'
        }
      }
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      },
      show() {//当dom重新渲染 需要重新的计算scroll 才可以滚动
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      getCurrentIcon(item) { //当前播放歌曲
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      deleteOne(item) {
        console.log(item)
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
      },
      selectItem(item,idx) {
        console.log(item, idx)
        // if (this.mode === playMode.random) {
        //   idx = this.playlist.findIndex(song => song.id = item.id)
        //   console.log(this.playlist, idx)
        // }
        let index = this.sequenceList.findIndex(song => song.id === item.id)
        this.selectPlay({
          list: this.sequenceList,
          idx: index,
          Boolean: true,
        })
      },
      scrollToCurrent(current) {
        //渲染的是最近播放列表 所以需要在最近播放列表中找下标
        const idx = this.sequenceList.findIndex(song => current.id === song.id)
        this.$refs.listContent.scrollToElement(this.$refs.listItem[idx - 1], 300)
      },
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
      addSong() {
        this.$refs.addsong.show()
      },
      ...mapActions([
        'selectPlay',
        'deleteSong',
        'deleteSongList'
      ])
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag) {
          return
        }
        // console.log
        // if (newSong.id === oldSong.id) {
        //   return
        // }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity .3s
      .list-wrapper
        transtion: all .3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.3s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
