const fs = require("fs"),
  path = require("path"),
  request = require("request");

// 创建文件夹
function mkdirs(dirname, callback) {
  fs.exists(dirname, function(exists) {
    if (exists) {
      callback();
    } else {
      // console.log(path.dirname(dirname));
      mkdirs(path.dirname(dirname), function() {
        fs.mkdir(dirname, callback);
        console.log(
          "在" + path.dirname(dirname) + "目录创建好" + dirname + "目录"
        );
      });
    }
  });
}
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
// 删除文件夹
function delDir(path, isCurrent){
  let files = [];
  if(fs.existsSync(path)){
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()){
        delDir(curPath, true); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    if(isCurrent){
      fs.rmdirSync(path);
    }
  }
}
// 拷贝文件夹
function copyDir(src, dist, fn){
  let paths = fs.readdirSync(src); //同步读取当前目录
  let pathsLength = paths.length;
  let n = 0;
  paths.forEach(function(path){
    var _src = src + '/' + path;
    var _dist = dist + '/' + path;
    fs.stat(_src, function(err, stats){ //stats 该对象 包含文件属性
      if(err) throw err;
      if(stats.isFile()){ //如果是个文件则拷贝
        let readable = fs.createReadStream(_src);//创建读取流
        let writable = fs.createWriteStream(_dist);//创建写入流
        writable.on('finish', function() {
          n++;
          if(n === pathsLength && fn){
            console.log('copyDir end');
            fn();
          }
        });
        readable.pipe(writable)
      }else if(stats.isDirectory()){ //是目录则 递归
        checkDirectory(_src, _dist, copyDir);
      }
    });
  });
}
// 检查文件夹
var checkDirectory = function(src, dist, callback){
  fs.access(dist, fs.constants.F_OK, (err) => {
    if(err){
      fs.mkdirSync(dist);
      callback(src, dist);
    }else{
      callback(src, dist);
    }
   });
};

var uploadFile = function(form){
  return new Promise((res,rej)=>{
    request.post({
      url:"http://10.18.40.195:6700/upload/testcase",
      formData: form
    },function(err, resp, data){
      if(err){
        rej(err)
      }else{
        res(JSON.parse(data))
      }
    })
  })
}

module.exports = {
  mkdirs,
  mkdirsSync,
  delDir,
  copyDir,
  uploadFile
};
