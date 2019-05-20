<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>


<script>
  const progressBtnWidth = 16

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX //开始触摸的x轴坐标
        this.touch.left = this.$refs.progress.clientWidth //开始的进度条宽度
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX //偏移量
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)) //计算出宽度  不能大于整个进度条的宽度
        this._offset(offsetWidth)

      },
      progressTouchEnd() { //拖动结束之后就调用 就触发改变歌曲播放进度
        this.touch.initiated = false
        this._trigggerPrecent()
      },
      progressClick(e) { //点击进度条改变歌曲播放进度
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        //这里点击 progressBtn的时候 e.offsetX  获取不对
        // this._offset(e.offsetX)
        this._trigggerPrecent()
      },
      _trigggerPrecent() { //向上触发改变歌曲进度事件
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      _offset(offsetWidth) { //进度条的宽度的改变
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        // console.log(offsetWidth)
        this.$refs.progress.style.width = `${offsetWidth}px`
      }
    },
    watch: {
      percent(newVal) { //进度条进行进度改变 播放按钮
        if (newVal >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newVal * barWidth
          // console.log(offsetWidth)
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>


<style lang="stylus" scoped>
  @import '../../common/stylus/variable'

   .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme

</style>
