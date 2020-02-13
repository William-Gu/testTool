const { ipcMain } = require('electron'),
  {mkdirsSync, copyDir, delDir, uploadFile} = require("./tool.js"),
  fs = require("fs"),
  path = require("path");


ipcMain.on('gogogo', (event, arg) => {
  console.log("gogogo");
})
// 创建项目、目录
ipcMain.on('createProject', (event, arg) => {
  // console.log(12,'createProject', arg );
  let tempSpace = path.resolve(__dirname,"../tempSpace")
  console.log(arg);
  console.log(tempSpace, fs.existsSync(tempSpace));

  if(!fs.existsSync(tempSpace)){
    fs.mkdirSync(tempSpace);
  }else if(arg.initialInput){
    delDir(tempSpace)
  }

  arg.caseList.forEach(item => {
    let filePath = path.join(__dirname,"../tempSpace",item)
    console.log(filePath,fs.existsSync(filePath));
    // console.log(filePath);
    mkdirsSync(filePath)
  });
  event.sender.send('createProjectResponse', {code: 200, data: arg})
})

ipcMain.on('toggleCurrentCase', (event, arg) => {
  // {
  //   caseList: [ 'case1', 'case2', 'case3', 'case4', 'case5' ],
  //   currentCase: 'case1',
  //   projectName: 'CRM',
  //   screenshotFolder: 'C:\\Users\\gujj\\Documents\\cut'       
  // }
  console.log(1,arg);
  let data = arg;
  let targetFolder = path.resolve(__dirname, "../tempSpace/" + data.currentCase)

  if(fs.existsSync(targetFolder)){
    // 1. 将截图目录中的文件拷贝到case目录
    copyDir(data.screenshotFolder, targetFolder, function(){
      // 2. 清空截图目录
      delDir(data.screenshotFolder)
      // 3. 将case目录中的文件上传到server
      let paths = fs.readdirSync(targetFolder).map(item => {
        return targetFolder + '\\' + item;
      })
      
      uploadFile(paths[0])
    });
  }
})
