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

export function filterSinger(singer) {
  let res = []
  // console.log(singer)
  if (!singer) {
    return ''
  }

  if (typeof singer === 'string') {
    return singer
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
function filterImage(image) {
  if (image.length > 20) {
    console.log(image)
    return image
  } else {
    return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${image}.jpg?max_age=2592000`
  }
}

export function createSong(musicData, Boolean) { //获取歌曲资料
  if (Boolean == true) {
    return musicData
  } else {
    return new Song({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      album: musicData.albumname,
      duration: musicData.interval,
      url: musicData.url ? musicData.url : '',
      image: filterImage(musicData.albummid),
      lyric: '',
    })

  }
}


