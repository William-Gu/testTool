const {ipcRenderer, remote} = require('electron')

const btn_end = document.getElementById('btn_end')

btn_end.addEventListener('click', (e) => {
  // e.preventDefault();
  // console.log(textarea.value.split("\n"))
  // let obj = {
  //   folder: folder.value,
  //   path: textarea.value.split("\n")
  // }
  // ipcRenderer.send('asynchronous-message', obj)
})

ipcRenderer.on('createProjectResponse', (event, arg) => {
  console.log(arg);
  if(arg.code === 200){
    let caseList = arg.data.caseList;
    console.log(caseList);

    let caseListDom = caseList.map(function(item){
      return "<option value='" + item + "'>" + item + "</option>"
    }).join("")

    $("#section_2 #select_case").html(caseListDom).val(caseList[0])
    toggleSection("section_2")
    remote.getCurrentWindow().setSize(800, 600)
  }
})
