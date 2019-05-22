import { commonParams, options } from './config.js'
import Axios from 'axios';
import jsonp from '../common/js/jsonp'


export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
  })


  return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) {
  const url = 'api/search'

  const data = Object.assign({}, commonParams, {
    '_': +new Date(),
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf - 8',
    format: 'json',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    uin: 0,
    remoteplace: 'txt.mqq.all',
  })

  return Axios.get(url, {
    params: data
  }).then(res => {
    var ret = res.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      console.log(matches)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    return Promise.resolve(res.data)
  })
}
