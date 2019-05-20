function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) { //返回一个新的数组
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
    // console.log(i, j,'run')
  }
  return _arr
}


export function findSongIndex(song, newlist) {
  // console.log(song, idx, newlist)
  return newlist.findIndex(it => it.id === song.id)
}
