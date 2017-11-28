# isexe
Minimal module to check if a file is executable, and a normal file.检查文件是否可执行的最小模块和普通文件。
Uses `fs.stat` and tests against the `PATHEXT` environment variable on Windows.在Windows上使用fs.stat和测试PATHEXT环境变量。

## USAGE

```javascript
var isexe = require('isexe')
isexe('some-file-name', function (err, isExe) {
  if (err) {
    console.error('probably file does not exist or something', err)
  } else if (isExe) {
    console.error('this thing can be run')
  } else {
    console.error('cannot be run')
  }
})

// same thing but synchronous, throws errors 同样的事情，但是是同步的，抛出错误
var isExe = isexe.sync('some-file-name')

// treat errors as just "not executable"将错误视为不可执行的
isexe('maybe-missing-file', { ignoreErrors: true }, callback)
var isExe = isexe.sync('maybe-missing-file', { ignoreErrors: true })
```

## API

### `isexe(path, [options], [callback])`

Check if the path is executable.  If no callback provided, and a
global `Promise` object is available, then a Promise will be returned.（检查路径是否可执行。如果不提供回调函数，提供了全局的Promise对象，返回Promise对象）

Will raise whatever errors may be raised by `fs.stat`, unless
`options.ignoreErrors` is set to true.（除非‘optinons.ignoreErrors'设置为true，fs.stat可能会引发各种错误）

### `isexe.sync(path, [options])`

Same as `isexe` but returns the value and throws any errors raised.和isexe模块相同，但是会返回值和抛出任何发现的错误

### Options

* `ignoreErrors` Treat all errors as "no, this is not executable", but
  don't raise them.（对待所有错误都视为是不可执行的，但是不要引发错误）
* `uid` Number to use as the user id（一个数作为用户的ID）
* `gid` Number to use as the group id（用作group ID）
* `pathExt` List of path extensions to use instead of `PATHEXT`
  environment variable on Windows.（‘pathExt’作为路径的扩展列表使用,代替在windows上‘PATHEXT’环境变量）
