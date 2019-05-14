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
    rnd: Math.random(),
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
