import Vue from 'vue'
import Router from 'vue-router'
// import Rank from './components/rank/rank'
// import Search from './components/search/search'
// import Singer from './components/singer/singer'
// import Recommend from './components/recommend/recommend'
// import SingerDetail from './components/singer-detail/singer-detail'
// import Disc from './components/disc/disc'
// import TopList from './components/top-list/top-list'
// import UserCenter from './components/user-center/user-center'

Vue.use(Router)

const Rank = () => import("./components/rank/rank")
const Search = () => import("./components/search/search")
const Singer = () => import("./components/singer/singer")
const Recommend = () => import("./components/recommend/recommend")
const SingerDetail = () => import("./components/singer-detail/singer-detail")
const Disc = () => import("./components/disc/disc")
const TopList = () => import("./components/top-list/top-list")
const UserCenter = () => import("./components/user-center/user-center")



export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc,
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList,
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
