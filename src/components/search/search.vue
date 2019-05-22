<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <Scroll ref="scroll" class="shortcut" :data="[Math.random()]">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.n">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text" v-html="'搜索历史'"></span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory" />
          </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query" />
    </div>
    <confirm ref="confirm"
             text="是否清空所有所有搜索历史"
             confirmBtnText="清空"
             @confirm="clearSearchHistoty"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import { getHotKey } from '../../api/search'
  import { ERR_OK } from '../../api/config';
  import Suggest from '../suggest/suggest'
  import { mapActions, mapGetters } from 'vuex';
  import SearchList from '../../base/search-list/search-list'
  import Confirm from '../../base/confirm/confirm'
  import Scroll from '../../base/scroll/scroll'
  import { playlistMixin } from '../../common/js/mixin'

  export default {
    mixins: [playlistMixin],
    created() { //组件被渲染之后 请求热点数据
      this._getHotKey()
    },
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    computed: {
      shortcut() {
        console.log('run')
        return this.hotKey.concat(this.searchHistory).slice()
      },
      ...mapGetters([
        'searchHistory',
      ])
    },
    methods: {
       handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.scroll.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      onQueryChange(query) { //监听search输入框的输入文字改变事件
        // console.log('run123')
        this.query = query
      },
      addQuery(query) {
        //调用组件暴露的函数 向输入框中填入关键词
        // console.log(this.$refs.searchBox)
        this.$refs.searchBox.setQuery(query)
      },
      blurInput() {//滑动之前将移动端键盘收起
        this.$refs.searchBox.blur()
      },
      saveSearch() {
        // console.log('run')
        //本地缓存选中的Key
        this.saveSearchHistory(this.query)
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      _getHotKey() {//获取热点
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = (res.data.hotkey).slice(0, 10) //截取前十条数据
          }
        })
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistoty'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => this.$refs.scroll.refresh(), 20)
        }
      }
    },
    components: {
      searchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .searchAnimation-enter-active
    transition: all .5s
  .searchAnimation-enter
    transform: translate3d(0, 1000%, 0)
  .search
    position fixed
    width 100%
    top 88px
    bottom 0
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>


