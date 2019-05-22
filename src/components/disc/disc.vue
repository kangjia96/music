<template>
  <transition name="slider">
    <!-- 复用musiclist组件 -->
    <MusicList :title="title" :bg-image="bgImage" :songs="songs"></MusicList>
  </transition>
</template>


<script>
  import MusicList from '../music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSonglist } from "../../api/recommend"
  import { ERR_OK } from '../../api/config'
  import { createSong } from '../../common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {//组件实例dom渲染之后就请求歌单内容
      this._getSonglist()
    },
    methods: {
      _getSonglist() {
        if (!this.disc.dissid) { //刷新跳转 因为无法触发请求数据事件
          this.$router.push('/recommend')
          return
        }
        getSonglist(this.disc.dissid).then(res => { //请求具体数据
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            console.log(res.cdlist[0])
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(song => {
          // console.log(song)
          if (song.id && song.mid) {
            const musicData = {
              songid: song.id,
              songmid: song.mid,
              singer: song.singer,
              songname: song.name,
              albumname: song.album.name,
              interval: song.interval,
              albummid: song.album.mid,
            }
            ret.push(createSong(musicData))
          }
        })
        // console.log(ret)
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  .slider-enter-active, .slider-leave-active
    transition all 0.3s

  .slider-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)
</style>

