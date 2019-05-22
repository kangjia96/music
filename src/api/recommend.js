import jsonp from '../common/js/jsonp.js'
import { commonParams, options } from './config.js'
import Axios from 'axios';

export function getRecommend() { //recommend.vue调用jsop 并返回数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platfrom: 'h5',
    uin: 0,
    needNewCode: 1
  })
  console.log(data)

  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = "/api/getDiscList"

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    format: 'json',
    needNewCode: 0,
    categoryId: 10000000,
    g_tk: 1928093487,
    rnd: Math.random(),
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSonglist(disstid) {
  const url = '/api/getMusicDisc'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: `${disstid}`,
    g_tk: 1186940298,
    loginUin: 1477129230,
    hostUin: 0,
    format: 'json',
    outCharset: 'utf - 8',
    platform: 'yqq.json',
    needNewCode: 0,
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })

}
