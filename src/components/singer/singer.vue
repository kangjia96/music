<template>
  <div class="singer" ref="singer">
    <ListView @select="selectSinger" ref="list" :data="singers"></ListView>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getSingerList } from '../../api/singer'
  import { ERR_OK } from '../../api/config'
  import Singer from '../../common/js/singer'
  import ListView from '../../base/listview/listview'
  import { mapMutations } from 'vuex'
  import { playlistMixin } from '../../common/js/mixin'

  const HOT_NAME = "热门"
  const HOT_SINGER_LEN = 20


  export default {
    mixins: [playlistMixin], //组件同名方法会覆盖mixins
    data() {
      return {
        singers: []
      }
    },

    created() {
      this._getSingerList()//实例创建渲染之后  就需要把数据传给子组件
    },

    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer){
        //监听到select事件 发生路由渲染  sing-detail页面
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            //拿到歌手数据
            // debugger;
            // console.log(this.singers)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        list.forEach((item, idx) => {
          //热门数据筛选
          if (idx < HOT_SINGER_LEN && idx > 10) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }

          const key = item.Findex
          //正常数据
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
          }))
        })

        //为了得到有序的列表 需要处理得到数据map
        let hot = [] //热门
        let ret = []  //正常
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //正常数据进行排序
        ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
      })
    },

    components: {
      ListView,
    }
  }
</script>

<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>


