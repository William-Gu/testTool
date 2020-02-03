let sectionList = $("[id^='section_']").map((key,item)=>item.id);

let toggleSection = function(id){
    if(id && $('#' + id) && $('#' + id).length > 0){
        let _isHidden = $('#' + id).css("display") === "none";

        if(_isHidden){
            sectionList = $("[id^='section_']").map((key,item) => item.id);
            sectionList.forEach(item => {
                if(item === id){
                    $('#' + item).show();
                }else{
                    $('#' + item).hide();
                }
            });
        }
    }
}