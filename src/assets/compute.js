export function compute_fit_pos(svg,_svg){
    var max = {x : 0, y : 0},
                min = {x : 0, y : 0}
    //  遍历所有的节点
    var nodes=Array.from(_svg.getElementsByTagName('g'));
    nodes.forEach(function(elem) {
        let item={
            x:Object.values(elem.__data__)[2],
            y:Object.values(elem.__data__)[3]
        }
        // console.log(item)
        if(item.x > max.x) {
            max.x = item.x
        }
        if(item.y > max.y) {
            max.y = item.y
        }
        if(item.x < min.x) {
            min.x = item.x
        }
        if(item.y < min.y) {
            min.y = item.y
        }
    })
    //  改进SVG的视图区域
    var width = max.x - min.x,
        height = max.y - min.y;
    //  设置大小
    svg.attr('width', width)
    svg.attr('height', height)
    //  设置可见区域
    svg.attr('viewBox', 0 + ',' + 0 + ',' + width+100 + ',' + height+100)
}
export function compute_fit_pos_1(place){
    var _svg=document.getElementsByTagName('svg')[0];
            var svg=d3.select(place).select("svg");
    var max = {x : 0, y : 0},
                min = {x : 0, y : 0}
    //  遍历所有的节点
    var nodes=Array.from(_svg.getElementsByTagName('g'));
    nodes.forEach(function(elem) {
        let item={
            x:Object.values(elem.__data__)[2],
            y:Object.values(elem.__data__)[3]
        }
        if(item.x > max.x) {
            max.x = item.x
        }
        if(item.y > max.y) {
            max.y = item.y
        }
        if(item.x < min.x) {
            min.x = item.x
        }
        if(item.y < min.y) {
            min.y = item.y
        }
    })
    //  改进SVG的视图区域
    var width = max.x - min.x,
        height = max.y - min.y;
    //  设置大小
    svg.attr('width', width+200)
    svg.attr('height', height+100)
    //  设置可见区域
    svg.attr('viewBox', 0 + ',' + 0 + ',' + width+200 + ',' + height+100)
}
export function compute_fit_pos_2(place){
    var _svg=document.getElementById(place.slice(1)).getElementsByTagName('svg')[0];
            var svg=d3.select(place).select("svg");
    var max = {x : 0, y : 0},
                min = {x : 0, y : 0}
    //  遍历所有的节点
    var nodes=Array.from(_svg.childNodes);
    // console.log(nodes)
    nodes.forEach(function(elem) {
        let rect=elem.getBoundingClientRect();
        // console.log(rect)
        let item={
            x:rect.width,
            y:rect.height,
        }
        if(item.x > max.x) {
            max.x = item.x
        }
        if(item.y > max.y) {
            max.y = item.y
        }
        if(item.x < min.x) {
            min.x = item.x
        }
        if(item.y < min.y) {
            min.y = item.y
        }
    })
    //  改进SVG的视图区域
    // console.log(max,min)
    var width = max.x-min.x
        ,height = max.y-min.y;
    //  设置大小
    // svg.attr('width', width)
    // svg.attr('height', height)
    //  设置可见区域
    return {
        'width':width,'height':height,
    }
}
export function fitin(place){
    var svg=d3.select(place).select("svg").select("g");
        //  计算左上角的点与右下角的点
    var div=document.getElementById(place.slice(1));
    // console.log(div)
    // div.onmouseover =function(){
    //     compute_fit_pos_2("#draw");
    // }
    // var cur=compute_fit_pos_2(place);
    var _svg=document.getElementById(place.slice(1)).getElementsByTagName("svg")[0].getElementsByTagName("g")[0];
    var cur={width:_svg.getBoundingClientRect().width+40,height:_svg.getBoundingClientRect().height}
    // console.log("cur",cur)
    var prim={width:div.clientWidth-20,height:div.clientHeight-20};
    // svg.attr('width', "100%")
    // svg.attr('height', "100%")
    // svg.attr('viewBox', 0 + ',' + 0 + ',' + prim.width + ',' + prim.height)
    //如果长宽都比父容器小，需要放大
    
    //如果长宽有一个比父容器小，不用放缩
    //如果长宽都比父容器大：1.固定一边放缩到和父容器一样，另一边按二者比例缩小
    //原则：填满：比较短的一边固定，留空：比较长的一边固定
    //先按照填满规则来
    // console.log("prim",prim);
    // console.log("real",cur);
    if(cur.width<prim.width && cur.height<prim.height){
        //长宽居中
        // console.log("小图片")
        // let wval=(prim.width-cur.width)/2;
        // let hval=(prim.height-cur.height)/2;
        // svg.attr('transform',"translate("+wval+","+hval+')');
        let factor=0.8;
        if(prim.width/cur.width>1&& prim.width/cur.width<1.4 || prim.height/cur.height>1&&prim.height/cur.height<1.4){
            let wval=(prim.width-cur.width)/2;
            let hval=(prim.height-cur.height)/2;
            svg.attr('transform',"translate("+wval+","+hval+')');
        }else
        if(factor*prim.width/cur.width>1){
            //按高，宽居中
            // console.log("1")
            while(factor*prim.width/cur.width>1.5){
                factor*=0.9
            }   
            let val1=(1-factor)*prim.width/2;
            let val2=(prim.height-cur.height*prim.width/cur.width*factor)/2;
            val1=Math.abs(val1)
            val2=Math.abs(val2)
            // console.log(val1,val2)
            svg.attr('transform',"translate("+val1+","+val2+')'+'scale('+factor*prim.width/cur.width+')');
        }else if(factor*prim.height/cur.height>1){
            while(factor*prim.height/cur.height>1.6){
                factor*=0.9
            } 
            // console.log("2")
            let val1=(1-factor)*prim.height/2;
            let val2=(prim.width-cur.width*prim.height/cur.height*factor)/2;
            val1=Math.abs(val1)
            val2=Math.abs(val2)
            // console.log(val1,val2)
            svg.attr('transform',"translate("+val2+","+val1+')'+'scale('+factor*prim.height/cur.height+')');
        }else{
            // console.log("3")
            let wval=(prim.width-cur.width)/2;
            let hval=(prim.height-cur.height)/2;
            svg.attr('transform',"translate("+wval+","+hval+')');
        }
    }
    if(cur.width>prim.width && cur.height>prim.height){
        if(cur.width<cur.height){
            //按高，宽居中
            // console.log("1")
            let val=(prim.width-cur.width*prim.height/cur.height)/2;
            if(val>0){
                svg.attr('transform',"translate("+val+',0)'+'scale('+prim.height/cur.height+')');
            }else{
                //尝试按宽，高居中
                val=(prim.height-cur.height*prim.width/cur.width)/2;
                svg.attr('transform',"translate(0,"+val+')'+'scale('+prim.width/cur.width+')');
            }
        }else{
            // console.log("2")
            let val=(prim.height-cur.height*prim.width/cur.width)/2;
            if(val>0){
                svg.attr('transform',"translate(0,"+val+')'+'scale('+prim.width/cur.width+')');
            }
            else{
                val=(prim.width-cur.width*prim.height/cur.height)/2;
                svg.attr('transform',"translate("+val+',0)'+'scale('+prim.height/cur.height+')');
            }
        }
    }else if(cur.width>prim.width || cur.height>prim.height){
        if(cur.height>prim.height){
            // console.log("一边长，按高")
            let val=(prim.width-cur.width*prim.height/cur.height)/2;
            svg.attr('transform',"translate("+val+',0)'+'scale('+prim.height/cur.height+')');
        }else{
            // console.log("一边长，按宽")
            let val=(prim.height-cur.height*prim.width/cur.width)/2;
            svg.attr('transform',"translate(0,"+val+')'+'scale('+prim.width/cur.width+')');
        }
    }
    // else if(cur.width<prim.width && cur.height<prim.height){
    //     if(cur.width>cur.height){
    //         //按宽，高居中
    //         console.log("3")
    //         let val=(prim.height-cur.height*prim.width/cur.width)/2;
    //         svg.attr('transform',"translate(0,"+val+')'+'scale('+prim.width/cur.width+')');
    //     }else{
    //         console.log("4")
    //         //按高，宽居中
    //         let val=(prim.width-cur.width*prim.height/cur.height)/2;
    //         svg.attr('transform',"translate("+val+',0)'+'scale('+prim.height/cur.height+')');
    //     }
    // }
}