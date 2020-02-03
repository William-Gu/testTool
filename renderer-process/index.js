const {ipcRenderer, remote} = require('electron')

// 表单当前信息
var formData = {
  screenshotFolder: "", // 截图工具目录
  projectName: "", //项目名称
  caseList: [], // 测试用例case列表
};

function valiateForm(){
  let screenshotFolder = $("#screenshotFolder").val(),
    projectName = $("#projectName").val(),
    caseList = $("#caseList").val().split("\n").filter(i => i != "")

  if(!screenshotFolder){
    alert("请输入文件目录地址")
    return false;
  }
  if(!projectName){
    alert("请输入项目名称")
    return false;
  }
  if( !caseList || caseList.length === 0){
    alert("请输入case列表")
    return false;
  }

  return {
    screenshotFolder: screenshotFolder,
    projectName: projectName,
    caseList: caseList
  }
}

$("#form").on('submit', (e) => {
  e.preventDefault();
  
  let obj = valiateForm();
  if(!obj){
    return false;
  }else{
    formData = obj;
  }
  ipcRenderer.send('createProject', obj)
})
