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
            <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-item">
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
    <div :class="{'list-fixed': ScrollY <= 0}" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <Loading />
    </div>
  </Scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import { getData } from '../../common/js/dom.js'
  import Loading from "../loading/loading"

  const ANCHAR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    data() {
      return {
        ScrollY: -1,
        currentIndex: 0,
        diff: -1
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
      },
      fixedTitle() {
        if (this.ScrollY > 0) {
          return
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      refresh() {
        this.$refs.listview.refresh()
      },
      selectItem(item) {
        //点击到的歌手 向上派发事件
        this.$emit('select', item) //派发出去
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        //得到dom元素的属性值
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        //将开始触摸的值和获取的index值储存
        this._scrollTo(anchorIndex)
        //歌手列表联动跳转到相同下标位置
      },
      onShortcutTouchmove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHAR_HEIGHT | 0
        let anchorIndex = +this.touch.anchorIndex + delta
        // console.log(this.touch)
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        //监听滚动事件 将ScrollY赋值
        this.ScrollY = pos.y
      },
      _scrollTo(index) {
        if (index === null) {
          //处理顶部和底部的边缘情况
          return
        }

        if (index < 0) {
          //拖动超出顶部 < 0
          index = 0
        } else if (index > this.listHeight.length - 2) {
          //拖动超出底部
          index = this.listHeight.length - 2
        }
        this.ScrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        // 清空
        this.listHeight = []
        // console.log('run')
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
      ScrollY(newY) {
        //观察ScrollY变化 即scroll事件
        //当滚动到顶部向上 newY是大于0的
        this._calculateHeight()

        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 保留listHeight
        const listHeight = this.listHeight
        // 遍历listHeight 判断一个元素的滚动高度是否符合listHeight的任意相邻的两元素的上下限 符合就将currentIndex 设为数组的下标
        // console.log(listHeight)
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          // console.log(height1, height2)
          //滚动在顶部以下
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i

            this.diff = height2 + newY
            //通过移动进行计算上移与下一个索引的距离
            // console.log('newY:', newY, 'height:', height2)
            // 右边小下标索引联动
            return
          }
        }
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        //通过差距计算需要移动的距离
        // console.log(fixedTop)
        if (this.fixedTop === fixedTop) {
          return
        }
        // console.log(fixedTop, this.fixedTop)
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading,
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
    .fixed-title
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




