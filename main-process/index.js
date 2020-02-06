const { ipcMain } = require('electron'),
  {mkdirsSync, delDir} = require("./tool.js"),
  fs = require("fs"),
  path = require("path");


ipcMain.on('gogogo', (event, arg) => {
  console.log("gogogo");
})
// 创建项目、目录
ipcMain.on('createProject', (event, arg) => {
  console.log(12,'createProject', arg );
  let tempSpace = path.resolve(__dirname,"../tempSpace")
  console.log(tempSpace, fs.existsSync(tempSpace));

  if(!fs.existsSync(tempSpace)){
    fs.mkdirSync(tempSpace);
  }else{
    delDir(tempSpace)
  }

  arg.caseList.forEach(item => {
    let filePath = tempSpace + "/" + item
    // console.log(filePath);
    mkdirsSync(filePath)
  });
  event.sender.send('createProjectResponse', {code: 200, data: arg})
})

ipcMain.on('toggleCurrentCase', (event, arg) => {
  console.log(arg);
})
