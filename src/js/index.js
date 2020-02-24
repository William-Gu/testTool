const {ipcRenderer, remote} = require('electron')


var app = new Vue({
  el: '#app',
  data: {
    isLoading: false,
    currentPage: 1,
    form: {
      screenshotFolder: "",// 截图工具目录
      projectName:"", //项目名称
      caseList: "",// 测试用例case列表
      initialInput: true,
      currentCase:""
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
      if(oldVal){
        this.toggleCase(oldVal);
      }
    }
  },
  created(){
    this.form = this.getConfig();
  },
  methods:{
    getConfig(){
      let data = window.localStorage.getItem("baseConfig");
      if(data){
        data = JSON.parse(data);
      }else{
        let config = ipcRenderer.sendSync('getDefaultDocumentsPath')
        let baseConfig = {
          screenshotFolder: config,
          projectName:"",
          caseList: "case1\ncase2\ncase3\ncase4",
          initialInput: true,
          currentCase:""
        }
        data = baseConfig;
        window.localStorage.setItem("baseConfig", JSON.stringify(data))
      }
      return data;
    },
    createProject(){
      this.$refs.form.validate((valid)=>{
        if(valid){
          let params = this.form;
          
          let data = ipcRenderer.sendSync('createProject', this.form)
          if(data.code === 200){
            remote.getCurrentWindow().setSize(390, 250);

            window.localStorage.setItem("baseConfig", JSON.stringify(this.form))

            this.form.currentCase = this.caseList2.length > 0 ? this.caseList2[0] : "";
            this.currentPage = 2;
          }
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
    toggleCase(val){
      let form = Object.assign({}, this.form);
      form.currentCase = val;
      
      this.isLoading = true;
      ipcRenderer.send('toggleCurrentCase', form)
    },
    showMessage(str = "", duration = 500 ){
      this.$message({
        type: "error",
        duration: duration,
        showClose: true,
        message: str
      })
    },
    close(){
      this.isLoading = true;      
      ipcRenderer.send('toggleCurrentCase', this.form, true)
      // ipcRenderer.send('close')
    }
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

ipcRenderer.on('onError', (event, arg) => {
  app.showMessage(arg, 5000)
})