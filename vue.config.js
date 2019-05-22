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
          proxyReq.setHeader('origin', 'https://y.qq.com');
          proxyReq.setHeader('referer', 'https://y.qq.com/portal/player.html');
        },
        pathRewrite: {
          '^/api/getMusicUrl': ''
        }
      },
      '/api/getMusicLyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        changeOrigin: true,
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('origin', 'https://y.qq.com');
          proxyReq.setHeader('referer', 'https://y.qq.com/portal/player.html');
        },
        pathRewrite: {
          '^/api/getMusicLyric': ''
        }
      },
      '/api/getMusicDisc': {
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        changeOrigin: true,
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('origin', 'https://y.qq.com');
          proxyReq.setHeader('referer', `https://y.qq.com/n/yqq/playsquare/${req.disstid}.html`);
        },
        pathRewrite: {
          '^/api/getMusicDisc': ''
        }
      },
      '/api/getTopList': {
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
        changeOrigin: true,
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('origin', 'https://m.y.qq.com');
          proxyReq.setHeader('referer', 'https://m.y.qq.com/');
        },
        pathRewrite: {
          '^/api/getTopList': ''
        }
      },
      '/api/search': {
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        changeOrigin: true,
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('origin', 'https://m.y.qq.com');
          proxyReq.setHeader('referer', 'https://m.y.qq.com/');
        },
        pathRewrite: {
          '^/api/search': ''
        }
      },
    }
  }
}
