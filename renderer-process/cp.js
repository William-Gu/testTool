const {ipcRenderer, remote} = require('electron')

const $select_case = $("#select_case");
let formData={};
/**
 * 选择case改选项
 * 前、后按钮操作：是否disabled
 * @params {String|Number} 0:前一个; 1:后一个; "":选择的;
 * @return 
 */
function caseValitor(params){
  let $btn_preview=$("#btn_preview"),
    $btn_next=$("#btn_next"),
    $select_case = $("#select_case")
    caseList= $("#select_case option").map((k,i)=>i.value).selector,
    caseList_currentIndex = $select_case.get(0).selectedIndex,
    caseList_length = $select_case.get(0).length,
    caseList_first = caseList.slice(0,1)[0],
    caseList_last = caseList.slice(-1)[0],
    value = $select_case.val();

  if(
    caseList_length === 0 || 
    params === 0 && caseList_currentIndex === 0 || 
    params === 1 && caseList_currentIndex + 1 === caseList_length
  ){
    return false;
  }

  if(params === 0 || params === 1){
    if(params === 0 ){
      let v = $("#select_case option").get(caseList_currentIndex-1).value;
      $("#select_case").val(v);
      if(caseList_currentIndex - 1 === 0){
        $btn_preview.attr("disabled", true)
      }else{
        $btn_preview.removeAttr('disabled')
      }
      $btn_next.removeAttr('disabled')
      return v;
    }
    if(params === 1){
      let v = $("#select_case option").get(caseList_currentIndex+1).value;
      $("#select_case").val(v);
      $btn_preview.removeAttr('disabled')
      if(caseList_currentIndex + 2 === caseList_length){
        $btn_next.attr("disabled", true)
      }else{
        $btn_next.removeAttr('disabled')
      }
      return v;
    }
  }
  if(typeof(params) === "string"){
    if(caseList_currentIndex === 0){
      $btn_preview.attr("disabled", true)
      if(caseList_length <= 1){
        $btn_next.attr("disabled", true)
      }else{
        $btn_next.removeAttr('disabled')
      }
    }else if(caseList_currentIndex + 1 === caseList_length){
      if(caseList_length <= 1){
        $btn_preview.attr("disabled", true)
      }else{
        $btn_preview.removeAttr('disabled')
      }
      $btn_next.attr("disabled", true)
    }else{
      $btn_preview.removeAttr('disabled')
      $btn_next.removeAttr('disabled')
    }
    return params;
  }

}
$("#btn_preview").on('click', function(e){
  let v = caseValitor(0);
  console.log(formData);
  ipcRenderer.send('toggleCurrentCase', formData)
  formData.currentCase = v;
})
$("#btn_next").on('click', function(e) {
  let v = caseValitor(1);
  ipcRenderer.send('toggleCurrentCase', formData)
  formData.currentCase = v;
})

$("#select_case").on('change', function(e){
  let v = caseValitor($(this).val());
  ipcRenderer.send('toggleCurrentCase', formData)
  formData.currentCase = v;
})
$("#btn_end").on('click', (e) => {

})

ipcRenderer.on('createProjectResponse', (event, arg) => {
  if(arg.code === 200){
    formData = arg.data;
    let caseList = arg.data.caseList;
    // 1. 创建第二窗口
    let caseListDom = caseList.map(function(item){
      return "<option value='" + item + "'>" + item + "</option>"
    }).join("");

    $("#section_2 #select_case").html(caseListDom)
    formData.currentCase = caseList[0];
    caseValitor(caseList[0]);
    toggleSection("section_2")
    // 2.调整窗口大小
    remote.getCurrentWindow().setSize(800, 600)
  }
})
