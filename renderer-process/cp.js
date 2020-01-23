const {ipcRenderer} = require('electron')

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
