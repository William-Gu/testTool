const fs = require("fs"),
  path = require("path");

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

module.exports = {
  mkdirs,
  mkdirsSync,
  delDir
};
