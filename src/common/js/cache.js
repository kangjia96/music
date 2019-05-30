
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15 //最大存储空间
const PLAY_KEY = '__play__' //最近播放
const PLAY_KEY_LENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_KEY_LENGTH = 200

function insertArray(arr, val, compator, maxlen) {
  const index = arr.findIndex(compator)
  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1)
  }

  arr.unshift(val)

  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
  // console.log(arr)
}

export function saveSearch(query) {
//localstorage信息存储
  let searches = storage.get(SEARCH_KEY, []) //查询关键词  如果有内容就是查出继续添加  不然则返回新数组

  insertArray(searches, query, item => item === query, SEARCH_MAX_LENGTH)
  //进行数组添加
  storage.set(SEARCH_KEY, searches)
  //设置localstorage

  return searches
}

export function loadSearch() {
  return  storage.get(SEARCH_KEY, [])

}

function deleteFromArray(arr, compator) {
  const idx = arr.findIndex(compator)
  if (idx > -1) {
    arr.splice(idx, 1)
  }
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) //查询关键词  如果有内容就是查出继续添加  不然则返回新数组
  deleteFromArray(searches, item => item === query)
  storage.set(SEARCH_KEY, searches)
  //设置localstorage

  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, item => item.id === song.id, PLAY_KEY_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, item => item.id === song.id, FAVORITE_KEY_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  console.log(songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => item.id === song.id)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
