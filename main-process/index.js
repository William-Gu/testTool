const { ipcMain } = require('electron')
var fs = require("fs");
var path = require("path");

function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      // console.log(path.dirname(dirname)); 
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
        console.log('在' + path.dirname(dirname) + '目录创建好' + dirname + '目录');
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
ipcMain.on('gogogo', (event, arg) => {
  console.log("gogogo");
})
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(12,'asynchronous-message');
  arg.path.forEach(item => {
    let path = arg.folder + "/" + item
    // console.log(path);
    mkdirsSync(path)
  });
  event.sender.send('asynchronous-reply', 200)
})

