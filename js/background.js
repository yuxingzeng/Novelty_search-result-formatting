
var selText="";

var copyElement = document.createElement("textarea");
/*
copyElement.maxLength = "5000";
copyElement.setAttribute("rows", "5");
copyElement.setAttribute("cols", "50");
copyElement.setAttribute("name", 'copy');
*/
document.body.appendChild(copyElement); //此句很重要，否则复制不了 	 


chrome.contextMenus.create({
    'type':'normal',
    'title':'查新格式化复制(D)',
    'contexts':['selection'],
    'id':'cn',
    'onclick':NSCopy
});

function NSCopy(info, tab){
	copyElement.value="未成功";
	if(tab.title.indexOf("厦漳泉")!=-1) 
	    copyElement.value=formatXQZPatent(selText);   
    else if(tab.title.indexOf("大为")!=-1)
	{	
		copyElement.value=formatInnojoyPat(selText);   	
	}
	else if(tab.title.indexOf("润桐")!=-1)
	{	
		copyElement.value=formatRainPat(selText);   	
	}
	else if(tab.url.indexOf("cnki")!=-1)
	{
		copyElement.value=formatCnkiData(selText);
	}
	else if(tab.url.indexOf("wanfang")!=-1)
	{
		copyElement.value=formatWanfangData(selText);
	}
	else{
		var CxFormatMsg="";
	    var fourspace='    ';
	    CxFormatMsg+=tab.title;
		CxFormatMsg+="[EB/OL].["+getrefDate()+"]."+tab.url+".\n";
		CxFormatMsg+=fourspace+"摘要:"+selText+"\n";
		copyElement.value=CxFormatMsg; 
	}
	copyElement.select(); 
	document.execCommand('copy');  
    //console.log(copyElement.value);     	
     
};
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    selText=message;
});
function formatXQZPatent(msg)
{
	var lines=msg.split('\n');
	if(lines[0]=="")
		lines=lines.slice(1,lines.length);
	var CxPatMsg ='';
	var fourspace='    ';
	if(lines.length<4)
            return '';
    
	if(lines[1].indexOf('申请号')==-1 || lines[2].indexOf('主分类')==-1)
		    return '';
	
    try{
            var authors=lines[4].replace('发明人：','').trim().split('\xa0'); //不是通常的空格，\x2
			var tcount=authors.length;
			if(tcount > 3)
			{	
                for(var  idx=0;idx<3;idx++)
                    CxPatMsg+=authors[idx]+',';
                CxPatMsg =CxPatMsg +'等.';
			}
            else
			{	
		        for(var  idx=0;idx<tcount;idx++)
				{
                    if(idx< tcount-1)
                        CxPatMsg += authors[idx] + ',';
                    else
                        CxPatMsg += authors[idx] + '.';
				}
			}
            CxPatMsg = CxPatMsg +lines[0].replace('翻译','').trim()+':' ;
            var line1=lines[1].split('：');
            if(line1[5].indexOf('无')==-1)//有公告号
                CxPatMsg = CxPatMsg +'CN'+line1[5].replace('公告日','')+'[P].';
            else
                CxPatMsg = CxPatMsg +'CN'+ line1[1].replace('申请日','')+'[P].';

            //申请日
            CxPatMsg = CxPatMsg +  line1[2].replace('公开号','') +'.\n';
            //申请人;
            CxPatMsg = CxPatMsg +fourspace+lines[3].replace('：',':').trim().replace('\xA0',';')+'\n';
			//摘要
            var tmp = lines[5].replace('：', ':');
            CxPatMsg=CxPatMsg+fourspace+tmp.replace('翻译','')+'\n';
            
	}
    catch(e)  
    { 
	console.log('error');   
	CxPatMsg ='';
	}
	
    return  CxPatMsg;
} 

//大为专利
function formatInnojoyPat(msg)
{
    var lines=msg.split('\n');
	if(lines[0]=="")
		lines=lines.slice(1,lines.length);
	var CxPatMsg ='';
	var fourspace='    ';
        if(lines.length < 4)
            return "";
        if(lines[1].indexOf("申请号") == -1)
            return "";
        try{
			var line3="";
			if(lines[2].indexOf("发明(设计)人:")!=-1)
			    line3=lines[2].split("发明(设计)人:");
			else
				line3=lines[2].split("发明（设计）人:");
            var authors = line3[1].trim().split(";");
            var tcount=authors.length;
            if(tcount > 3)
			{	
                for(var idx=0; idx<3;idx++)
                    CxPatMsg = CxPatMsg + authors[idx] + ",";
                CxPatMsg = CxPatMsg + "等.";
			}
            else
			{
                for(var idx=0; idx<tcount;idx++)
                    if(idx < tcount - 1)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    else
                        CxPatMsg = CxPatMsg + authors[idx] + ".";
			}
            var line1=lines[0].split("[");
            var idx=line1[0].indexOf(" ");
            var tmp=line1[0].slice(idx,line1[0].length);
            CxPatMsg = CxPatMsg + tmp.trim()+ ":";//加标题

            var line2=lines[1].split(" ");
            CxPatMsg = CxPatMsg + line2[2].split(":")[1].split("\t")[0] + "[P].";
            CxPatMsg = CxPatMsg + line2[1].split(":")[1] + ".\n";
            //申请人
            tmp = line3[0].split(":");
            idx=tmp[1].indexOf (";");
            var tmp1=tmp[1].slice(idx+1,tmp[1].length);//#remove [country]
            CxPatMsg = CxPatMsg + fourspace + "申请人:" + tmp1.trim() + "\n";

            // 摘要
            CxPatMsg = CxPatMsg +fourspace + "摘要:" + lines[4].replace("查看大图","").replace("点击","") + "\n";

            return CxPatMsg;
		}
        catch(except)
		{
           return "";
		}
}

function formatRainPat(msg)
{
    var lines=msg.split('\n');
	if(lines[0]=="")
		lines=lines.slice(1,lines.length);
	var CxPatMsg ='';
	var fourspace='    ';
    if(lines.length < 4)
            return "";
    if(lines[1].indexOf("申请号")==-1)
            return "";
        try
		{
            if(lines[3].indexOf("当前法律状态") != -1)//中文专利
			{   //#发明人
               var tmp = lines[7].split("\t");
               var authors = tmp[1].trim().split(";");
               var  tcount = authors.length;
                if(tcount > 3)
                {   for(var idx=0; idx<3;idx++)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    CxPatMsg = CxPatMsg + "等.";
				}
                else
				{
                    for(var idx=0; idx<tcount;idx++)
                        if( idx < tcount - 1)
                            CxPatMsg = CxPatMsg + authors[idx] + ",";
                        else
                            CxPatMsg = CxPatMsg + authors[idx] + ".";
				}

                CxPatMsg = CxPatMsg + lines[0].trim() + ":";//  # 加标题

                //#文献号及申请日期
                var tmp=lines[2].split("\t");
                CxPatMsg = CxPatMsg + tmp[1].trim() + "[P].";
                tmp = lines[1].split("\t");
                CxPatMsg = CxPatMsg + tmp[3].trim() + ".\n";

                //#申请人
                tmp = lines[5].split("\t");
                CxPatMsg=CxPatMsg+fourspace+"申请人:"+tmp[1].slice(0,tmp[1].length-1)+"\n";

                //#摘要
                CxPatMsg = CxPatMsg + fourspace +  "摘要:" + lines[11] + "\n";
			}
            else//外文专利
			{	
                var idxfmr = 3;
                while(idxfmr <lines.length)
				{
                    if( lines[idxfmr].indexOf("分类号") != -1)
                        break;
                    else
                        idxfmr += 1;
                }
                var tmp = lines[idxfmr + 2].split("\t");//  #分解发明人
                var authors = tmp[1].trim().split(";");
                var tcount =authors.length;
                if(tcount > 3)
                {    for(var idx=0; idx<3;idx++)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    CxPatMsg = CxPatMsg + "等.";
				}
                else
				{
                    for(var idx=0; idx<tcount;idx++)
                        if( idx < tcount - 1)
                            CxPatMsg = CxPatMsg + authors[idx] + ",";
                        else
                            CxPatMsg = CxPatMsg + authors[idx] + ".";
				}
                CxPatMsg = CxPatMsg + lines[0].trim() + ":";//  # 加标题

                tmp = lines[1].split("\t");
                CxPatMsg = CxPatMsg + tmp[1].trim() + "[P].";
                CxPatMsg = CxPatMsg + tmp[3].trim() + ".\n";

                tmp = lines[idxfmr + 1].split("\t");//  # 分申请人
                CxPatMsg = CxPatMsg + fourspace + "申请人:" + tmp[1].slice(0,tmp[1].length) + "\n";

                //# 摘要
                CxPatMsg = CxPatMsg + fourspace + "摘要:" + lines[idxfmr+5] + "\n";
            }
            return CxPatMsg;
		}
		catch(e)
		{
			console.log("format rainpat error!");
			return "";
		}
}

function formatCnkiData(msg)
{
	var lines=msg.split('\n');
	if(lines[0]=="")
		lines=lines.slice(1,lines.length);
	if(lines[0].indexOf("[J]") != -1)
	{
		return formatCnkiJdata(lines);
	}
	else if(lines[0].indexOf("[D]") != -1)
	{
		 return formatCnkiDdata(lines);
	}
	else if(lines[0].indexOf("[C]") != -1)
	{
		 return formatCnkiCdata(lines);
	}
	else if(lines[0].indexOf("[Z]") != -1)
	{
		return formatCnkiZdata(lines);
	}
        
       
}
function formatCnkiJdata(lines)
{
	    var CxPatMsg ='';
	    var fourspace='    ';
    
        if(lines.length<3)
            return CxPatMsg;
        try
		{
            var tmp = lines[0].split(".");
            var tidx = tmp[0].indexOf("]");
            var authors = tmp[0].slice(tidx + 1,tmp[0].length).trim().split(",");
            var tcount = authors.length;
            if( tcount > 3)
			{
                for( var  idx=0;idx<3;idx++)
					CxPatMsg = CxPatMsg + authors[idx] + ",";
                CxPatMsg = CxPatMsg + "等."
			}
            else
			{
                 for( var  idx=0;idx<tcount;idx++)
				 {  
			        if( idx < tcount - 1)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    else
                        CxPatMsg = CxPatMsg + authors[idx] + ".";
				 }
			}

            //
			for(var idx=1;idx<tmp.length;idx++)
                    CxPatMsg = CxPatMsg + tmp[idx].trim();
            //出处
            CxPatMsg = CxPatMsg + "\n";

            CxPatMsg = CxPatMsg +fourspace+ lines[1] + "\n";
            CxPatMsg = CxPatMsg +fourspace+ lines[2] + "\n";
            return CxPatMsg;
		}
        catch(e)
		{
          console.log("format cnki paper error!");
		  return "";
		}
}

function formatCnkiDdata(lines)
{
		var CxPatMsg ='';
	    var fourspace='    ';
    
        if(lines.length<3)
            return CxPatMsg;
        try
		{
            var tmp = lines[0].split(".");
			var tidx = tmp[0].indexOf("]");
			var lines0 = lines[0].slice(tidx + 1,lines[0].length);
            CxPatMsg = CxPatMsg + lines0+"\n";
            CxPatMsg = CxPatMsg +fourspace+ lines[1] + "\n";
            CxPatMsg = CxPatMsg +fourspace+ lines[2] + "\n";
            return CxPatMsg;
		}
        catch(e)
		{
          console.log("format cnki paper error!");
		  return "";
		}
}
function formatCnkiCdata(lines)
{
		var CxPatMsg ='';
	    var fourspace='    ';
    
        if(lines.length<2)
            return CxPatMsg;
        try
		{
            	
			var tmp=lines[0].split(".");

            var tidx = tmp[0].indexOf("]");
            var authors = tmp[0].slice(tidx + 1,tmp[0].length).trim().split(",");
            var tcount = authors.length;
            if( tcount > 3)
			{
                for( var  idx=0;idx<3;idx++)
					CxPatMsg = CxPatMsg + authors[idx] + ",";
                CxPatMsg = CxPatMsg + "等."
			}
            else
			{
                 for( var  idx=0;idx<tcount;idx++)
				 {  
			        if( idx < tcount - 1)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    else
                        CxPatMsg = CxPatMsg + authors[idx] + ".";
				 }
			}

            CxPatMsg = CxPatMsg + tmp[1]+ ".";
            CxPatMsg = CxPatMsg + tmp[3] + ".";
            CxPatMsg = CxPatMsg + tmp[4] + ".\n";
            CxPatMsg = CxPatMsg +fourspace+lines[1]+"\n";
			
			return CxPatMsg;
			
			
		}
        catch(e)
		{
          console.log("format cnki paper error!");
		  return "";
		}	
}
function formatCnkiZdata(lines)
{
	var CxPatMsg ='';
	    var fourspace='    ';
    
        if(lines.length<2)
            return CxPatMsg;
        try
		{
           		
			var tmp=lines[0].split(".");

            var tidx = tmp[0].indexOf("]");
            var authors = tmp[0].slice(tidx + 1,tmp[0].length).trim().split(",");
            var tcount = authors.length;
            if( tcount > 3)
			{
                for( var  idx=0;idx<3;idx++)
					CxPatMsg = CxPatMsg + authors[idx] + ",";
                CxPatMsg = CxPatMsg + "等."
			}
            else
			{
                 for( var  idx=0;idx<tcount;idx++)
				 {  
			        if( idx < tcount - 1)
                        CxPatMsg = CxPatMsg + authors[idx] + ",";
                    else
                        CxPatMsg = CxPatMsg + authors[idx] + ".";
				 }
			}

            var cop= tmp[1].trim();
            CxPatMsg = CxPatMsg +tmp[2].trim();
            var No=tmp[3].trim();
            if(No.length>10)
                CxPatMsg = CxPatMsg+No;

            var Jdcop = tmp[4].trim();
            if(Jdcop.length>8)
                CxPatMsg = CxPatMsg +Jdcop;

            var Jdate=tmp[5].trim();
            if( Jdate.length<8)
                Jdate="";
            CxPatMsg = CxPatMsg +Jdate +"\n";

            CxPatMsg = CxPatMsg +fourspace+"第一完成人:"+cop+"\n";
            CxPatMsg = CxPatMsg +fourspace+lines[1]+"\n";
			
			return CxPatMsg;
			
			
		}
        catch(e)
		{
          console.log("format cnki paper error!");
		  return "";
		}	
}
function formatWanfangData(msg)
{
	var lines=msg.split('\n');
	if(lines[0]=="")
		lines=lines.slice(1,lines.length);
	if(lines[0].indexOf("[J]") != -1)
	{
		return formatwanfangJdata(lines);
	}
	else if(lines[0].indexOf("[D]") != -1)
	{
		 return formatwanfangDdata(lines);
	}
	else if(lines[0].indexOf("[C]") != -1)
	{
		 return formatwanfangCdata(lines);
	}
	else if(lines[0].indexOf("[Z]") != -1)
	{
		return formatwanfangZdata(lines);
	}
	
}
function formatwanfangJdata(lines)
{
    var idxs=lines[0].indexOf("]");
    var idxe=lines[0].indexOf("DOI");
    var CxPatMsg ='';
	    var fourspace='    ';
    if(lines.length<3)
            return CxPatMsg;
    try{
	CxPatMsg +=lines[0].slice(idxs+1,idxe)+"\n";
	CxPatMsg +=fourspace+lines[1]+"\n";
	CxPatMsg +=fourspace+lines[2].replace(/\./g,"。").replace(/\,/g,"，")+"\n";
	return CxPatMsg;
	}
	catch(e)
	{
		console.log("format wanfang pager error!");
		return "";
	}
}
function formatwanfangDdata(lines)
{
	var idxs=lines[0].indexOf("]");
    var CxPatMsg ='';
	    var fourspace='    ';
    if(lines.length<3)
            return CxPatMsg;
    try{
	CxPatMsg +=lines[0].slice(idxs+1,lines[0].length)+"\n";
	CxPatMsg +=fourspace+lines[1]+"\n";
	CxPatMsg +=fourspace+lines[2]+"\n";
	return CxPatMsg;
	}
	catch(e)
	{
		console.log("format wanfang degree pager error!");
		return "";
	}
}
function formatwanfangCdata(lines)
{
	var idxs=lines[0].indexOf("]");
    var CxPatMsg ='';
	    var fourspace='    ';
    if(lines.length<3)
            return CxPatMsg;
    try{
	CxPatMsg +=lines[0].slice(idxs+1,lines[0].length)+"\n";
	CxPatMsg +=fourspace+lines[1]+"\n";
	CxPatMsg +=fourspace+lines[2].replace(/\./g,"。").replace(/\,/g,"，")+"\n";
	return CxPatMsg;
	}
	catch(e)
	{
		console.log("format wanfang  meeting pager error!");
		return "";
	}
}
function formatwanfangZdata(lines)
{
	if(lines.length>=3)
	{
    	var idxs=lines[0].indexOf("]");
		var idxe=lines[0].indexOf("[Z]");
		var CxPatMsg ='';
			var fourspace='    ';
		try{
		CxPatMsg +=lines[0].slice(idxs+1,idxe+3)+lines[0].slice(-5,lines[0].length)+"\n";
		CxPatMsg +=fourspace+lines[1]+"\n";
		CxPatMsg +=fourspace+lines[2]+"\n";
		return CxPatMsg;
		}
		catch(e)
		{
			console.log("format wanfang chengguo pager error!");
			return "";
		}
	}
	else{
		var idxs=lines[0].indexOf("]");
		var idxe=lines[0].indexOf("[Z]");
		var idxjg=lines[0].indexOf("机构");
		var CxPatMsg ='';
			var fourspace='    ';
		try{
		CxPatMsg +=lines[0].slice(idxs+1,idxe+3)+"\n";
		CxPatMsg +=fourspace+lines[0].slice(idxjg,lines[0].length)+"\n";
		CxPatMsg +=fourspace+lines[1]+"\n";
		return CxPatMsg;
		}
		catch(e)
		{
			console.log("format wanfang chengguo pager error!");
			return "";
		}	
	}
}

function getrefDate()
{
	var oDate=new Date();
	var oYear=oDate.getFullYear(); 
	var oMonth=oDate.getMonth()+1; 
    if(oMonth<10)
		oMonth="0"+oMonth;
	if(oDate<10)
		oDate="0"+oDate;
	var oDay=oDate.getDate(); 
	return oYear+"-"+oMonth+"-"+oDay;
}
