const { app, ipcMain } = require("electron"),
  {
    mkdirsSync,
    copyDir,
    delDir,
    uploadFile
  } = require("./tool.js"),
  fs = require("fs"),
  os = require("os"),
  path = require("path"),
  tempSpace = path.join(app.getPath("documents"), "TesterCaseTool");

ipcMain.on("getDefaultDocumentsPath", (event, arg) => {
  event.returnValue = path.join(app.getPath("documents"), "cut")
})

// 创建项目、目录
ipcMain.on("createProject", (event, arg) => {
  let data = arg;
  // 没有截图文件夹即创建
  if(!fs.existsSync(data.screenshotFolder)){
    mkdirsSync(data.screenshotFolder);
  }

  // 初始化目标文件夹
  if (!fs.existsSync(tempSpace)) {
    fs.mkdirSync(tempSpace);
  } else if (data.initialInput) {
    delDir(tempSpace);
  }

  data.caseList.split("\n").forEach(item => {
    let filePath = path.join(tempSpace, item);
    mkdirsSync(filePath);
  });
  event.returnValue = { code: 200, data: data };
});

ipcMain.on("toggleCurrentCase", (event, arg, isClose) => {
  let data = arg;
  let targetFolder = path.join(tempSpace, data.currentCase);

  if (fs.existsSync(targetFolder)) {
    // 1. 将截图目录中的文件拷贝到case目录
    console.log("1. 将截图目录中的文件拷贝到case目录", targetFolder);
    copyDir(data.screenshotFolder, targetFolder, function() {
      // 2. 清空截图目录
      console.log("2. screenshotFolder", data.screenshotFolder);
      delDir(data.screenshotFolder);
      // 3. 将case目录中的文件上传到server
      let paths = fs
        .readdirSync(targetFolder)
        .map(item => targetFolder + "\\" + item);

      console.log(3, paths);
      if (paths.length > 0) {
        let username = os.userInfo().username || "null";
        Promise.all(
          paths.map(item => {
            let params = {
              userName: username,
              projectName: data.projectName,
              caseName: data.currentCase,
              file: fs.createReadStream(item)
            };
            return uploadFile(params);
          })
        )
          .then(res => {
            let data = res.findIndex(item => item.code !== 200)
            if( data === -1){
              delDir(targetFolder);
              event.sender.send("onSuccess_toggleCurrentCase", {
                code: 200,
                data: res.map(i => i.data)
              });
              if(isClose){
                app.exit(0);
              }
            }else{
              throw new Error(data[0])
            }
          })
          .catch(err => {
            event.sender.send("onSuccess_toggleCurrentCase", {
              code: 500,
              data: "文件上传错误:" + err
            });
          })
      }else{
        if(isClose){
          app.exit(0);
        }
        event.sender.send("onSuccess_toggleCurrentCase", {
          code: 200,
          data: []
        });
      }
    });
  }
});
ipcMain.on("close", (event, arg) => {
  app.quit();
});
