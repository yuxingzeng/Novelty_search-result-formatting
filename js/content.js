var selectionText="";
window.onmouseup = function(){
   var selection =window.getSelection();
	//console.log(selection.toString());
	if(selection.anchorOffset != selection.extentOffset){
        chrome.runtime.sendMessage(selection.toString());
		//console.log("ddd");
    }
}
