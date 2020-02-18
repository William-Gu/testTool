const { app, ipcMain } = require("electron"),
  {
    mkdirsSync,
    copyDir,
    delDir,
    uploadFile
  } = require("./tool.js"),
  fs = require("fs"),
  os = require("os"),
  path = require("path");

// 创建项目、目录
ipcMain.on("createProject", (event, arg) => {
  let data = arg,
    tempSpace = path.resolve(__dirname, "../tempSpace");
  console.log(data, tempSpace, fs.existsSync(tempSpace));

  if (!fs.existsSync(tempSpace)) {
    fs.mkdirSync(tempSpace);
  } else if (data.initialInput) {
    delDir(tempSpace);
  }

  data.caseList.split("\n").forEach(item => {
    let filePath = path.join(__dirname, "../tempSpace", item);
    mkdirsSync(filePath);
  });
  event.sender.send("createProjectResponse", { code: 200, data: data });
});

ipcMain.on("toggleCurrentCase", (event, arg) => {
  // {
  //   caseList: [ 'case1', 'case2', 'case3', 'case4', 'case5' ],
  //   currentCase: 'case1',
  //   projectName: 'CRM',
  //   screenshotFolder: 'C:\\Users\\gujj\\Documents\\cut'
  // }
  console.log("0. toggleCurrentCase: ", arg);
  let data = arg;
  let targetFolder = path.resolve( __dirname, "../tempSpace/" + data.currentCase);

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
              username: username,
              projectName: data.projectName,
              caseName: data.currentCase,
              file: fs.createReadStream(item)
            };
            return uploadFile(params);
          })
        )
          .then(res => {
            console.log(4.1, res);
            let data = res.findIndex(item => item.code !== 200)
            if( data === -1){
              event.sender.send("onSuccess_toggleCurrentCase", {
                code: 200,
                data: res.map(i => i.data)
              });
            }else{
              throw new Error(data[0])
            }
          })
          .catch(err => {
            console.log(4.2, err);
            event.sender.send("onSuccess_toggleCurrentCase", {
              code: 500,
              data: "文件上传错误"
            });
          })
          .finally(data => {
            console.log(4.3, data);
          });
      }else{
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
