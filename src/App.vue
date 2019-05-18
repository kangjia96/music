<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
  <!-- keep-alive 进行缓存-->
</template>

<script>
  import MHeader from './components/m-header/m-header'
  import Tab from "./components/tab/tab"
  import Player from './components/player/player'
  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>


<style scoped lang="stylus">
  @import './common/stylus/variable'
  //webpack已配置 可以直接以文件夹路径的形式访问

</style>
