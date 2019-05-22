import { commonParams, options } from './config.js'
import Axios from 'axios';
import jsonp from '../common/js/jsonp'

export function getTopList() {
  const url = '/api/getTopList'

  const data = Object.assign({}, commonParams, {
    '-': +new Date(),
    format: 'json',
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    page: 'detail',
    type: 'top',
    tpl:3,
    // uin: 0,
    g_tk: 1928093487,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
