(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-47b29076"],{"42ba":function(t,s,e){"use strict";e.d(s,"b",function(){return o}),e.d(s,"a",function(){return c}),e.d(s,"c",function(){return l});var n=e("5693"),i=e("da71"),a=e("bc3a"),r=e.n(a);function o(){var t="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",s=Object.assign({},i["b"],{platfrom:"h5",uin:0,needNewCode:1});return console.log(s),Object(n["a"])(t,s,i["c"])}function c(){var t="/api/getDiscList",s=Object.assign({},i["b"],{platform:"yqq.json",hostUin:0,sin:0,ein:29,sortId:5,format:"json",needNewCode:0,categoryId:1e7,g_tk:1928093487,rnd:Math.random()});return r.a.get(t,{params:s}).then(function(t){return Promise.resolve(t.data)})}function l(t){var s="/api/getMusicDisc",e=Object.assign({},i["b"],{type:1,json:1,utf8:1,onlysong:0,new_format:1,disstid:"".concat(t),g_tk:1186940298,loginUin:1477129230,hostUin:0,format:"json",outCharset:"utf - 8",platform:"yqq.json",needNewCode:0});return r.a.get(s,{params:e}).then(function(t){return Promise.resolve(t.data)})}},5362:function(t,s,e){"use strict";var n=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"music-list"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),e("h1",{staticClass:"title",domProps:{innerHTML:t._s(t.title)}}),e("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[e("div",{staticClass:"play-wrapper"},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length>0,expression:"songs.length > 0"}],ref:"playBtn",staticClass:"play",on:{click:t.random}},[e("i",{staticClass:"icon-play"}),e("span",{staticClass:"text"},[t._v("随机播放全部")])])]),e("div",{ref:"filter",staticClass:"filter",staticStyle:{backgroundSize:"cover"},style:t.bgStyle})]),e("div",{ref:"layer",staticClass:"bg-layer"}),e("Scroll",{ref:"list",staticClass:"list",attrs:{probeType:t.probeType,"listen-scroll":t.listenScroll,data:t.songs},on:{scroll:t.scroll}},[e("div",{staticClass:"song-list-wrapper"},[e("SongList",{attrs:{rank:t.rank,songs:t.songs},on:{select:t.selectItem}})],1)]),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.songs.length,expression:"!songs.length"}],staticClass:"loading-container"},[e("Loading")],1)],1)},i=[],a=(e("96cf"),e("3b8d")),r=e("cebc"),o=e("e9fc"),c=e("99f1"),l=e("1cb8"),g=e("2f62"),u=(e("afc0"),e("510f")),f=40,d={mixins:[u["b"]],props:{bgImage:{type:String,default:""},songs:{type:Array,default:null},title:{type:String,default:""},rank:{type:Boolean,default:!1}},data:function(){return{scrollY:0,url:[]}},computed:{bgStyle:function(){return"background-image: url(".concat(this.bgImage,")")}},created:function(){this.probeType=3,this.listenScroll=!0},mounted:function(){this.imgHeight=this.$refs.bgImage.clientHeight,this.minTranslateY=-this.imgHeight+f,this.$refs.list.$el.style.top="".concat(this.imgHeight,"px")},methods:Object(r["a"])({handlePlaylist:function(t){var s=t.length>0?"60px":"";this.$refs.list.$el.style.bottom=s,this.$refs.list.refresh()},scroll:function(t){this.scrollY=t.y},back:function(){this.$router.back()},selectItem:function(){var t=Object(a["a"])(regeneratorRuntime.mark(function t(s,e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.selectPlay({list:this.songs,idx:e});case 1:case"end":return t.stop()}},t,this)}));function s(s,e){return t.apply(this,arguments)}return s}(),random:function(){this.randomPlay({list:this.songs})}},Object(g["b"])(["selectPlay","randomPlay"])),watch:{scrollY:function(t){var s=Math.max(this.minTranslateY,t),e=0,n=1,i=0;this.$refs.layer.style.transform="translate3d(0, ".concat(s,"px, 0)");var a=Math.abs(t/this.imgHeight);t>0?(n=1+a,e=10):i=Math.min(60*a,60),this.$refs.filter.style.filter="blur(".concat(i,"px)"),t<this.minTranslateY?(e=10,this.$refs.bgImage.style.paddingTop=0,this.$refs.bgImage.style.height="".concat(f,"px"),this.$refs.playBtn.style.display="none"):(this.$refs.bgImage.style.paddingTop="70%",this.$refs.bgImage.style.height=0,this.$refs.playBtn.style.display=""),this.$refs.bgImage.style.zIndex=e,this.$refs.bgImage.style.transform="scale(".concat(n,")")}},components:{Scroll:o["a"],SongList:c["a"],Loading:l["a"]}},m=d,h=(e("eaf1"),e("2877")),b=Object(h["a"])(m,n,i,!1,null,"4a526635",null);s["a"]=b.exports},"7eef":function(t,s,e){},b4b5:function(t,s,e){"use strict";var n=e("7eef"),i=e.n(n);i.a},d5a7:function(t,s,e){},eaf1:function(t,s,e){"use strict";var n=e("d5a7"),i=e.n(n);i.a},f5be:function(t,s,e){"use strict";e.r(s);var n=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("transition",{attrs:{name:"slider"}},[e("MusicList",{attrs:{title:t.title,"bg-image":t.bgImage,songs:t.songs}})],1)},i=[],a=(e("7f7f"),e("ac6a"),e("cebc")),r=e("5362"),o=e("2f62"),c=e("42ba"),l=e("da71"),g=e("f5de"),u={data:function(){return{songs:[]}},computed:Object(a["a"])({title:function(){return this.disc.dissname},bgImage:function(){return this.disc.imgurl}},Object(o["c"])(["disc"])),created:function(){this._getSonglist()},methods:{_getSonglist:function(){var t=this;this.disc.dissid?Object(c["c"])(this.disc.dissid).then(function(s){s.code===l["a"]&&(t.songs=t._normalizeSongs(s.cdlist[0].songlist),console.log(s.cdlist[0]))}):this.$router.push("/recommend")},_normalizeSongs:function(t){var s=[];return t.forEach(function(t){if(t.id&&t.mid){var e={songid:t.id,songmid:t.mid,singer:t.singer,songname:t.name,albumname:t.album.name,interval:t.interval,albummid:t.album.mid};s.push(Object(g["a"])(e))}}),s}},components:{MusicList:r["a"]}},f=u,d=(e("b4b5"),e("2877")),m=Object(d["a"])(f,n,i,!1,null,"2d328a38",null);s["default"]=m.exports}}]);
//# sourceMappingURL=chunk-47b29076.aac5035e.js.map