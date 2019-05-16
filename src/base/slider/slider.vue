<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :key="idx" v-for="(item, idx) in dots" :class="{active: currentPageIndex == idx}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll"
import { addClass } from '../../common/js/dom.js'
// import { clearInterval } from 'timers';
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0,
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        console.log('run')
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      //当宽度发生变化 让其重新计算 _initSlider
      this.slider.refresh()
    })
  },

  methods: {
    _setSliderWidth (isResize) {//设置轮播图的宽度
      this.children = this.$refs.sliderGroup.children
      //所有请求到轮播图资源 将其放到this上 其他函数容易访问
      console.log(this.children.length)

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      //获取祖先元素slider宽度

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item') //添加类名

        child.style.width = sliderWidth + 'px' //使其宽度与祖先元素一般宽
        width += sliderWidth
      }

      if (this.loop && !isResize) { //为了无限滚动 使其多有连个轮播图的宽度 即7个dom对象 因为BScroll会根据loop 多复制两个dom
        width += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = width + 'px' //使其父元素的宽度与其一般宽
    },

    _initDots() {
      //设置轮播图的小圆点切换
      this.dots = new Array(this.children.length)
      console.log(this.dots)
    },

    _initSlider () {
      //设置轮播图的滚动
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, //循环滚动
          threshold: this.threshold,
          speed: this.speed,
        },
        // click: true,
      })

      this.slider.on('scrollEnd', () => {
        if (this.loop) {
          let pageIndex = this.slider.getCurrentPage().pageX
          // console.log(pageIndex)
          this.currentPageIndex = pageIndex
        }

        if (this.autoPlay) { //当自己手动滑动的时候 需要取消自动轮播 然后在重新运行 防止手动自动在一起
          clearInterval(this.timer)
          this._play()
        }
      })
    },

    _play() { //自动轮播
      this.timer = setInterval(() => {
        // console.log(this.slider)
        this.slider.next()
      }, this.interval);
    }

  },

  destroyed () { //逐渐被销毁的时候 清理计时器函数 释放内存
    clearInterval(this.timer)
  }
}
</script>


<style lang="stylus">
@import '../../common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>

