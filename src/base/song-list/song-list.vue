<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, idx)" :key="song.mid" v-for="(song, idx) in songs" class="item">
        <div class="content">
          <h2 class="name">
            {{song.name}}
          </h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    props: {
      songs: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectItem(item, idx){ //选中的歌曲传递下标
        this.$emit('select', item, idx)
      },
      getDesc(song) {
        // console.log(song)
        return `${song.singer}·${song.album}`
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  ul
    margin: 0
    padding: 0
    border: 0
    font-size: 100%
    font-weight: 400
    vertical-align: baseline
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          display: -webkit-box
          -webkit-line-clamp: 1
          -webkit-box-orient: vertical
          margin-top: 4px
          color: $color-text-d
</style>

