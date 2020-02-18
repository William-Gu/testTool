const {ipcRenderer, remote} = require('electron')


var app = new Vue({
  el: '#app',
  data: {
    isLoading: false,
    currentPage: 1,
    form: {
      screenshotFolder: "C:\\Users\\gujj\\Documents\\cut",// 截图工具目录
      projectName:"CRM", //项目名称
      caseList: "case1\ncase2\ncase3\ncase4\ncase5",// 测试用例case列表
      initialInput: true,
      currentCase:"case1"
    },
    formRules:{
      screenshotFolder: {required: true, message: "请输入文件目录地址"},
      projectName: {required: true, message: "请输入文件目录地址"},
      caseList: {required: true, message: "请输入case列表"},
    }
  },
  computed:{
    caseList2(){
      return this.form.caseList.split("\n")
    },
    btn_disabled_preview(){
      if(this.caseList2.length > 0 && 
        this.caseList2.indexOf(this.form.currentCase) === 0){
        return true;
      }else{
        return false;
      }
    },
    btn_disabled_next(){
      if(this.caseList2.length > 0 && 
        this.caseList2.indexOf(this.form.currentCase) === this.caseList2.length-1){
        return true;
      }else{
        return false;
      }
    }
  },
  watch:{
    "form.currentCase":function(val,oldVal){
      this.toggleCase(val, oldVal);
    }
  },
  methods:{
    createProject(){      
      this.$refs.form.validate((valid)=>{
        if(valid){
          let params = this.form;
          
          ipcRenderer.send('createProject', this.form)
          
          this.form.currentCase = this.caseList2.length > 0 ? this.caseList2[0] : "";
          this.currentPage = 2;
        }
      })
    },
    toggleCase_preview(){
      let index = this.caseList2.indexOf(this.form.currentCase)
      this.form.currentCase = this.caseList2[index-1];
    },
    toggleCase_next(){
      let index = this.caseList2.indexOf(this.form.currentCase)
      this.form.currentCase = this.caseList2[index+1];
    },
    toggleCase(val, oldVal){
      let form = Object.assign({}, this.form);
      form.currentCase = oldVal;
      
      this.isLoading = true;
      ipcRenderer.send('toggleCurrentCase', form)
    },
    showMessage(str = ""){
      this.$message({
        type: "error",
        duration: 500,
        showClose: true,
        message: str
      })
    },
    close(){
      this.toggleCase("", this.currentCase)

      // ipcRenderer.send('close')
    }
  }
})
ipcRenderer.on('createProjectResponse', (event, arg) => {  
  if(arg.code === 200){
    remote.getCurrentWindow().setSize(800, 600)
  }
})

ipcRenderer.on('onSuccess_toggleCurrentCase', (event, arg) => {
  console.log(arg);
  app.isLoading = false;
  if(arg.code === 200){

  }else{
    app.showMessage(arg.data)
  } 
})