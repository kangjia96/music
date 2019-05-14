import originJSONP from 'jsonp'

export default function jsonp(url, data, option) { //封装jsonp
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  console.log(url)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) { //拼接数据
  let url = ""
  for (let key in data) {
    let val = data[key] !== undefined ? data[key] : ""
    url += `&${key}=${encodeURIComponent(val)}`
  }
  // console.log(url)
  return url ? url.substring(1) : ''
}
