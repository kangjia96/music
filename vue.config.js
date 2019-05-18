// const axios = require('axios')
module.exports = {
  baseUrl: '/',
  devServer: {
    proxy: {
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        changeOrigin: true,
        onProxyReq(proxyReq, req, res){
          proxyReq.setHeader('host', 'c.y.qq.com');
          proxyReq.setHeader('referer', 'https://c.yy.qq.com');
        },
        pathRewrite: {
          '^/api/getDiscList': ''
        }
      },
      '/api/getMusicUrl': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true,
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('origin', 'y.y.qq.com');
          proxyReq.setHeader('referer', 'https://y.qq.com/portal/player.html');
        },
        pathRewrite: {
          '^/api/getMusicUrl': ''
        }
      }
    }
  }
}
