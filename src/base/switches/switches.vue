<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, idx) in switches"
        :key="item.name" :class="{'active': currentIndex === idx}"
        @click="switchItem(idx)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches:{
        type: Array,
        default: null
      },
      currentIndex: {//根据传参进行切换
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(idx) {
        console.log('switch')
        this.$emit('switchItem', idx)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable'

  .switches
    display flex
    align-items center
    width 240px
    margin 0 auto
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>


