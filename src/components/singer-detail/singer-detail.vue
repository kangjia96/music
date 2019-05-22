<template>
  <transition name="slider">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from '../../api/singer'
  import { ERR_OK } from '../../api/config'
  import { createSong } from '../../common/js/song'
  import MusicList from '../music-list/music-list'
  // import { getMusicUrl } from '../../api/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer', //监听singer改变
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then(res => { //获取歌手的所有歌曲资料
          if (res.code === ERR_OK) {
            this.songs = this._normallizeSongs(res.data.list)

          }
        })
      },
      _normallizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        // ret.map(it => { //在此处替换url?
        //   getMusicUrl(it.songmid).then(res => {
        //     // console.log(res)
        //     const lurl = res.req.data.freeflowsip[0]
        //     const purl = res.req_0.data.midurlinfo[0].purl
        //     const url = lurl + purl
        //     console.log(url)
        //     it.url = url
        //     // return url
        //   })
        // })
        return ret
      }
    },
    components: {
      MusicList,
    }

  }
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable.styl'

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slider-enter-active, .slider-leave-active
    transition all .3s
  .slider-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)

</style>

