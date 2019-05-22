import { getMusicUrl, getMusicLyric } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { Base64 } from 'js-base64'
// import Lyric from 'lyric-parser'

export async function getPurUrl (playlist, idx) {
  if (idx < 0) {
    return []
  }
  let song = playlist[idx]
  if (!song.url) {
    return await getMusicUrl(song.mid).then(res => {
        // console.log('runnnnn')
        if (res.code === ERR_OK) {
          const lurl = res.req.data.freeflowsip[0]
          const purl = res.req_0.data.midurlinfo[0].purl
          const url = lurl + purl
          const list = playlist.map((it, index) => {
            if (index === idx) {
              return {
                ...it,
                url: url
              }
            } else {
              return it
            }
          })
          // console.log(list)
          return list
        }
      })
  } else {
    return playlist.slice()
  }

}

export async function getMLyric(song) {
  return await getMusicLyric(song.mid).then(res => {
    if (res.code === ERR_OK) {
      let lyric = Base64.decode(res.lyric)
      // console.log(lyric)
      return lyric
    }
  })
}
