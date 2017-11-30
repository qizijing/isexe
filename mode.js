//暴露函数接口
module.exports = isexe
isexe.sync = sync

var fs = require('fs')
//fs.stat:获取文件信息
function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))//er为true返回false，er为false返回checkStat()
  })
}
//返回checkStat()方法，第一个参数为：fs.statSync()获取文件信息的同步方法
function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}
//如果checkMode函数为真，直接返回stat.isFile(),否则checkStat函数返回false
//stat.isFile()读取文件内容的函数
//将sync函数的参数带入，fs.statSync(path).isFile()
function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)//stat.isFile()为真，返回checkMode(),
}
//checkMode函数的作用是返回ret (true/false)
//mode:设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)。
function checkMode (stat, options) {
  var mod = stat.mode;
  var uid = stat.uid;
  var gid = stat.gid;
//!== > && > ? :
//如果options的用户ID值和类型不等于undefined，返回options的用户ID，否则返回（process.getuid && process.getuid()）的结果true or false
  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid();
//
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid();//getgid:获取group id

  var u = parseInt('100', 8)//64
  var g = parseInt('010', 8)//8
  var o = parseInt('001', 8)//1
  var ug = u | g//72
//() > === > & > && > ||
//先运算括号里的内容true or false 2. gid===myGid uid===myUid myUid===0(true/false) 3. (mod & g) && true/false 4. true/false || true/false || true/false || true/false
//(true/false) || (true/false) && true/false || (true/false) && true/false || (true/false) && true/false
  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret//ret 返回true or false
}
