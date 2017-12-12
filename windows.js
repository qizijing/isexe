//暴露isexe和sync两个函数
module.exports = isexe
isexe.sync = sync

var fs = require('fs')//引用文件模块
//定义一个checkPathExt函数,在函数中定义一个变量pathext
function checkPathExt (path, options) {
  //当options.pathExt!==undefined为true时,返回options.pathExt,否则返回process.env.PATHEXT(当前环境变量)
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true//若pathext为false，返回true
  }

  pathext = pathext.split(';')//用;将pathext分割
  if (pathext.indexOf('') !== -1) {
    return true//如果pathext中空字符不存在，返回true
  }
  for (var i = 0; i < pathext.length; i++) {//遍历pathext
    var p = pathext[i].toLowerCase()//将pathext中的大写字符全部转换成小写字符，然后传给p
    if (p && path.substr(-p.length).toLowerCase() === p){//在path对象中从尾部截取长度为p.length的字符串，并将它们都转换为小写之后，与p进行比较
      return true//当p为true且从右向左截取的path小写字符等于p时,返回true
    }
  }
  return false//否则返回false
}

function checkStat (stat, path, options) {//定义一个checkStat函数
  if (!stat.isSymbolicLink() && !stat.isFile()) {//如果stat既不是软连接也不是文件时
    return false//返回false
  }
  return checkPathExt(path, options)//否则返回checkPathExt函数
}

function isexe (path, options, cb) {//定义一个isexe函数，检查路径是否可执行
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))//在回调函数中，如果er为真返回false，为假则返回checkStat函数
  })
}

function sync (path, options) {//定义一个sync函数
  return checkStat(fs.statSync(path), path, options)//返回checkStat函数
}
