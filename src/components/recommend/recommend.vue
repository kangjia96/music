<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper">
        <slider>
          <div :key="item.id" v-for="item of recommends">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" />
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Slider from "../../base/slider/slider"
  import { getRecommend, getDiscList } from "../../api/recommend"
  import { ERR_OK } from '../../api/config'

  export default {
    data() {
      return {
        recommends: []
      }
    },
    created() {
      this._getRecommend() //在组件实例创建之后才请求数据
      this._getDiscList()
    },
    methods: {
      _getRecommend() { //封装jsonp请求 得到数据
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            console.log(res)
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            // this.recommends = res.data.slider
            console.log(res.data.list)
          }
        })
      }
    },
    components: {
      Slider,
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

</style>


