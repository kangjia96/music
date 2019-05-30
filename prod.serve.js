const express = require('express')
const axios = require('axios')

const bodyParser = require('body-parser')
var port = process.env.PORT || 8000

var app = express()

// var volData = require('./data.json')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


// app.use(express.static('./dist'))

const apiRoutes = express.Router()

apiRoutes.get('/getDiscList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.yy.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})



apiRoutes.get('/getMusicUrl', (req, res) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      origin: 'https://y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})


apiRoutes.get('/getMusicLyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      origin: 'https://y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})



apiRoutes.get('/getMusicDisc', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: `https://y.qq.com/n/yqq/playsquare/${req.disstid}.html`,
      origin: 'https://y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})




apiRoutes.get('/getTopList', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      referer: `https://m.y.qq.com/`,
      origin: 'https://m.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})


apiRoutes.get('/search', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: `https://m.y.qq.com/`,
      origin: 'https://m.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})


app.use('/api', apiRoutes)

app.use(express.static('./dist'))


module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
