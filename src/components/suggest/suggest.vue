<template>
  <Scroll class="suggest"
          :data="res"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="suggest"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">

    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)"  v-for="item of res" :key="item.songmid">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="" />
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !res.length">
      <no-result title="暂无搜索结果" />
    </div>
  </Scroll>
</template>


<script>
  import { search } from '../../api/search'
  import { ERR_OK } from '../../api/config';
  import { createSong } from '../../common/js/song'
  import Scroll from '../../base/scroll/scroll'
  import NoResult from '../../base/no-result/no-result'
  import Loading from '../../base/loading/loading'
  import Singer from '../../common/js/singer'
  import { mapMutations, mapActions } from 'vuex';

  const TYPE_SINGER = 'singer'
  const perpage = 20


  export default {
    props: {
      query: {
        type: String,
        default: '',
      },
      showSinger: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
        page: 1,
        res: [],
        pullup: true, //触发的scrollend的事件发生
        hasMore: true,
        beforeScroll: true,
      }
    },
    methods: {
      getDisplayName(item) { //获取搜索歌曲名称
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      refresh(){
        this.$refs.suggest.refresh()
      },
      selectItem(item) {
        // console.log('run')
        if (item.type === TYPE_SINGER) {
          // console.log(item)
          const singer = new Singer({
            id: item.singermid,
            name: item.singername,
          })
          //路由跳转
          this.$router.push({
            path: `/search/${singer.id}`
          }),
          //触发store数据改变 渲染singer-detail页面
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        // console.log('run')
        //向上触发事件 进行缓存数据
        this.$emit('select')
      },
      getIconCls(item) { //搜索歌曲样式
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      searchMore() { //加载更多数据
        if (!this.hasMore) { //没有获取更多数据
          return
        }
        // console.log('run')
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._checkMore(res.data)
            this.res = this.res.concat(this._genRes(res.data)) //进行拼接扩充
            // console.log(this.res)
          }
        })
      },
      listScroll() { //向上触发即将滚动事件
        this.$emit('listScroll')
      },
      _search() {
        //滑动在中间时输入框进行搜索 需要进行重置 因为query是新的 所以需要重新进行请求
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        //
        this.hasMore = true
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._checkMore(res.data)
            this.res = this._genRes(res.data)
            // console.log(this.res)
          }
        })
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) { //当数据已无法再扩充
          this.hasMore = false
        }
      },
      _genRes(data) { //对请求到的数据机型处理
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizelist(data.song.list))
        }
        return ret
      },
      _normalizelist(list) { //数据处理
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() { //当query发生任何就去实时请求服务端 抓取检索数据
        this._search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  .suggest
    height 100%
    overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
    .icon
      flex 0 0 30px
      width 30px
      [class^="icon-"]
        font-size 14px
        color: $color-text-d
    .name
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text
        no-wrap()
  .no-result-wrapper
    position: absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
