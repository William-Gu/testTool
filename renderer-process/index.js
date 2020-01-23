const {ipcRenderer} = require('electron')

const form = document.getElementById('form')
const folder = document.getElementById('folder')
const textarea = document.getElementById('textarea')
const gogogo = document.getElementById('gogogo')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(textarea.value.split("\n"))
  let obj = {
    folder: folder.value,
    path: textarea.value.split("\n")
  }
  ipcRenderer.send('asynchronous-message', obj)
})
// gogogo.addEventListener('click', (e) => {
//   ipcRenderer.send('gogogo', "")
// })
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   const message = `${arg}`
//   document.getElementById('async-reply').innerHTML = message
// })
