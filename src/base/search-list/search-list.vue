<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="item in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>


<script>
  export default {
    props: {
      searches: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all .3s
      &.list-enter-active, &.list-leave-active
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-medium
          color: $color-text-d
</style>

