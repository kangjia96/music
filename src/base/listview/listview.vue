<template>
  <Scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType = "probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref="listGroup">
        <h2 class="list-title">
          {{group.title}}
        </h2>
          <ul>
            <li v-for="item in group.items" :key="item.id" class="list-item">
              <img class="singer-avatar" v-lazy="item.avatar" />
              <span class="singer-name">{{item.name}}</span>
            </li>
          </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchmove">
      <ul>
        <li v-for="(item, idx) of shortcutList"
            :key="item"
            :class="{'current': currentIndex === idx}"
            class="shortcut-item"
            :data-index="idx">
          {{item}}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import { getData } from '../../common/js/dom.js'

  const ANCHAR_HEIGHT = 18

  export default {
    data() {
      return {
        ScrollY: -1,
        currentIndex: 0
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },

    props: {
      data: {
        type: Array,
        default: null,
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchmove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHAR_HEIGHT | 0
        let anchorIndex = +this.touch.anchorIndex + delta
        // console.log(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.ScrollY = pos.y
        console.log(pos.y)
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        //拿到所有分类dom元素的实例
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          //获取其元素的高度
          this.listHeight.push(height)
          //将其存放在数组中
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          // console.log('run')
          this._calculateHeight()
        }, 20)
      },
      ScrollY(newY) {
        // 保留listHeight
        if (newY >= 0) {
          this.currentIndex = 0
          return
        }
        const listHeight = this.listHeight
        // console.log(listHeight)
        // 遍历listHeight 判断一个元素的
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY > height1 && -newY < height2)) {
            this.currentIndex = i
            // console.log(this.currentIndex)
            return
          }
        }
      }
    },
    components: {
      Scroll,
    },
  }
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        color: $color-text-d
        font-size: $font-size-medium
        background: #333
      .list-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .singer-avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .singer-name
          margin-left: 20px
          color: $color-text-d
          font-size: $font-size-medium
  .list-shortcut
    position: absolute
    top: 50%
    right: 0
    color: $color-text-d
    z-index: 20
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    text-align: center
    border-radius: 10px
    font-family: Helvetica
    font-size: $font-size-small
    background: rgba(0,0,0,.3)
    .shortcut-item
      padding: 3px
      line-height: 1
  .current
    color: $color-theme
  .list-fixed
    position: absolute
    width: 100%
    top: -1px
    .fixedtitle
      width: 100%
      height: 30px
      line-height: 30px
      padding-left: 20px
      color: $color-text-d
      font-size: $font-size-medium
      background: #333
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>




