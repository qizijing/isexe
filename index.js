var fs = require('fs')//引用文件模块
var core//定义一个core变量

//如果当前程序的宿主运行环境是win32,那么core值为引用后缀名为windows.js的文件;否则，core值为引用后缀名为mode.js的文件
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = require('./windows.js')
} else {
  core = require('./mode.js')
}

//暴露isexe和sync两个函数
module.exports = isexe
isexe.sync = sync

//定义一个isexe函数，如果options的类型为函数类型,那么将options赋值给cb,再将空值赋值给options
function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  //如果cb回调函数不为真并且promise的类型不为function的情况下，抛出新的错误类型，显示“未提供回调”
  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }
    //返回新的promise对象
    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {//调用isexe函数
        if (er) {//如果er值为真
          reject(er)//失败，返回错误er
        } else {
          resolve(is)//已完成,返回is
        }
      })
    })
  }
 
  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
      //若options为true,返回options.ignoreErrors,此时若er.code===‘EACCES’为true,则最终结果为true;若er.code==='EACCES'为false则返回options.ignoreErrors,此时若options.ignoreErrors为true,则结果为true
      //若options为false，返回options，此时若er.code==='EACESS'为true，则最终结果为true
      
        er = null//er被赋值为null
        is = false//is被赋值为false
      }
    }
    cb(er, is)//调用cb回调函数
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {//此处try catch起着过滤的作用
    return core.sync(path, options || {})//返回core.sync函数
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
    //若options为true时，返回options.ignoreErrors,此时若options.ignoreErrors为true，则最终结果为true;若options.ignoreErrors为false时，返回er.code==='EACCES',此时若er.code==='EACCES'为true时，则结果为true
    //若options为false，返回er.code==='EACCES',此时若er.code==='EACCES'为true，则结果为true
    
      return false//返回false
    } else {
      throw er//抛出er参数
    }
  }
}
