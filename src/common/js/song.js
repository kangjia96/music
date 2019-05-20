import { getMusicUrl } from '../../api/song'


class Song {
  constructor ({id, mid, singer,
  name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

function filterSinger(singer) {
  let res = []
  // console.log(singer)
  if (!singer) {
    return ''
  }

  singer.forEach((singer) => {
    res.push(singer.name)
  })
  return res.join('/')
}

//  function getPlayurl(songmid) {

//   getMusicUrl(songmid).then(res => {
//     // debugger;
//     const lurl = res.req.data.freeflowsip[0]
//     const purl = res.req_0.data.midurlinfo[0].purl
//     const url = lurl + purl
//     console.log(url)
//     return url
//   })

// }

export function createSong(musicData) { //获取歌曲资料
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    url: '',
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    lyric: '',
  })
}


