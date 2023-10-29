const fs = require('fs')
const path = require('path')
const vite = require('vite')

const loadEnv = vite.loadEnv
/*
    将path2合并到path1
    同名跳过
*/

const root = process.cwd()
const env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)

const startPath1 = env.VITE_OUT_DIR || 'dist'
const startPath2 = 'dist-h5'

class Trigger {
  constructor(targetNum, callback) {
    this.targetNum = targetNum
    this.ending = callback.bind(this)
    this.state = 0
  }
  // 累加
  trigger() {
    this.state++
    if (this.state === this.targetNum) {
      this.ending()
    }
  }
  // 结束时触发
  ending() {
    console.log('结束复制')
  }
}

// combine(startPath1, startPath2)
async function combine(dirPath1, dirPath2) {
  try {
    console.log('Start', dirPath2, 'to', dirPath1)
    const dirMap1 = await readDir(dirPath1)
    const dirMap2 = await readDir(dirPath2)
    await compareMap(dirMap1, dirMap2)
  } catch (e) {
    console.log('combine Error:')
    console.log(e)
  }
}

// 合并
function compareMap(map1, map2) {
  let resolve = null
  const promise = new Promise((res) => {
    resolve = res
  })
  const trigger = new Trigger(map2.file.length + map2.dir.length, () => {
    resolve()
  })
  // 对比文件
  map2.file.forEach(async (file) => {
    if (!map1.file.includes(file)) {
      // 获取不存在的文件
      await filePipe(path.resolve(map1.path, file), path.resolve(map2.path, file))
    }
    trigger.trigger()
  })
  // 对比文件夹
  map2.dir.forEach(async (dir) => {
    if (!map1.dir.includes(dir)) {
      // 不存在该目录则直接拷贝
      await copyDir(path.resolve(map1.path, dir), path.resolve(map2.path, dir))
    } else {
      // 存在目录则继续比对
      await combine(path.resolve(map1.path, dir), path.resolve(map2.path, dir))
    }
    trigger.trigger()
  })
  return promise
}
// 文件传输（copyFile）
function filePipe(path1, path2) {
  return new Promise(async (res, rej) => {
    try {
      await createFile(path1)
      const ws = fs.createWriteStream(path1)
      const rs = fs.createReadStream(path2)
      ws.on('finish', function () {
        console.log(`已拷贝文件${path1}`)
        res()
      })
      rs.pipe(ws)
    } catch (e) {
      console.log('Error filePipe', path1, path2)
      console.log(e)
      rej(e)
    }
  })
}
// 拷贝目录
async function copyDir(path1, path2) {
  await createDir(path1)
  const dirMap = await readDir(path2)
  // 拷贝文件
  dirMap.file.forEach(async (file) => {
    await filePipe(path.resolve(path1, file), path.resolve(path2, file))
  })
  // 拷贝目录
  dirMap.dir.forEach(async (dir) => {
    await copyDir(path.resolve(path1, dir), path.resolve(path2, dir))
  })
}
// 创建文件夹
async function createDir(path) {
  console.log(`尝试创建目录:${path}`)
  return new Promise((resolve, reject) => {
    fs.exists(path, (exists) => {
      if (!exists) {
        // 不存在
        fs.mkdir(path, (err) => {
          if (err) {
            console.log(`创建目录失败:${path}`)
            console.log(err)
            reject()
          }
          resolve()
        })
      } else {
        console.log(`已存在文件夹:${path}`)
        resolve()
      }
    })
  })
}
// 获取目录内容
function readDir(dirPath) {
  const map = {
    path: path.resolve(root, dirPath),
    relativePath: dirPath,
    dir: [],
    file: []
  }
  return new Promise((res, rej) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.log('Error readdir', err)
        rej(err)
        return
      }
      !files.length && res(map)
      let i = 0
      files.forEach((f) => {
        const curPath = path.resolve(dirPath, f)
        fs.stat(curPath, (err, stat) => {
          if (stat.isDirectory()) {
            // 文件夹
            map.dir.push(f)
          } else {
            // 文件
            map.file.push(f)
          }
          i++
          i === files.length && res(map)
        })
      })
    })
  })
}

// 创建空文件
function createFile(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err) {
        fs.writeFile(path, '', (e) => {
          if (e) {
            reject(e)
          } else {
            resolve('success')
          }
        })
      } else {
        resolve('existed')
      }
    })
  })
}

// 合并文件夹
combine(startPath1, startPath2)
