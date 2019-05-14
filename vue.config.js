// const axios = require('axios')

module.exports = {
  devServer: {
    proxy: {
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        changeOrigin: true,
        ws: true,
        headers: {
          host: 'c.y.qq.com',
          referer: 'https: //c.yy.qq.com'
        }
      }
    }
  }
}
