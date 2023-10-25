//打乱数组
export function shuffle(arr){
    var len = arr.length;
    for(var i = 0; i < len -1; i++){
        var index = parseInt(Math.random()*(len-i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }
    return arr;
}
export function timeFormat(val){
    // console.log(val);
    let totalTime=val;
    let hour= parseInt(totalTime/3600) >= 10 ? parseInt(totalTime/3600) : '0' + parseInt(totalTime/3600);
    let afterHour=parseInt(totalTime - hour*3600)
    let min = parseInt(afterHour/60) >= 10 ? parseInt(afterHour/60) : '0' + parseInt(afterHour/60) // 计算整数分
    let afterMin = parseInt(afterHour - min*60) // 取得算出分后剩余的秒数
    // console.log(min,afterMin);
    let sec = parseInt(afterMin) >= 10 ? parseInt(afterMin) : '0' + parseInt(afterMin) // 计算整数秒
    let lastTime = hour+":"+min + ':' + sec;
    // console.log(lastTime)
    return lastTime;
}
export function getFiles(filePath){
    let files = [] //遍历的文件全push进这个数组，方便后续操作（记住，push进去的是文件路径，后续需读取）
    var fso=new ActiveXObject("Scripting.FileSystemObject");//创建文件系统对象
		var s=fso.GetFolder(filePath);//获取文件夹对象
		var fn=new Enumerator(s.files);
		// var s="";
		for(;!fn.atEnd();fn.moveNext()){
			// s=s+fn.item()+"\n";
            files.push(fn.item())
		}
	return files;
  }
  