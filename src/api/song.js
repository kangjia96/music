import { commonParams } from './config'
import Axios from 'axios'

export function getMusicUrl (songmid) { //请求歌曲的url

  const url = "/api/getMusicUrl"

  const data = Object.assign({}, commonParams, {
    '-': `getplaysongvkey${(Math.random() + '').replace('0.', '')}`,
    g_tk: 5381,
    loginUin: 1477129230,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"9275346628","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"9275346628","songmid":["${songmid}"],"songtype":[0],"uin":"1477129230","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
    })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicLyric(songmid) {
  const url = '/api/getMusicLyric'
  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: songmid,
    g_tk: 1186940298,
    loginUin: 1477129230,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf - 8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
