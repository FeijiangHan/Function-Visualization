export default function create_hierarchyGraph(d3,json,place){
    // console.log(document.querySelector("#draw").innerHTML)
    document.querySelector(place).innerHTML = '';
    var w = 1500;
    var dr;
        var padding = 20;
        var r = 8;
        var rate = 1.5; //调控连边缩进的比例
        //控制绘制曲线
        var curve=1.5;  
        var homogeneous=1.2; 
        var constant = 12;
        var maxLength = 7; //截断函数名
        var maxFrequency = 1; //最大调用次数
        var frequency = d3.scaleLinear()
                        // .domain([0,3,9,12])
                        // .range([1,3.5,4.5,5.5]);
                        .domain([1,2,8,12])
                        .range([1,2.5,4.5,5.5]);

        var nodes = new Map(); //所有节点
        var links = new Map();
            var data = json[0];

            //分层
            const root = d3.hierarchy(data, d => d.children);
            root.count();  //统计某个节点下的节点数
            // console.log("root",root)
            let val=root.descendants().length;
            let width=800;
            let h=800;
            if(val>100){
                width=2200;
            }else if(val>50){
                width=1200;
            }
            
            // console.log("val", root.descendants())
            d3.partition()
                .size([width, h*width/800])
                .padding(1)
                .round(false)(root);  //什么写法


            //获取所有节点(不要层次性的数据结构)
            root.descendants()
                .forEach(d=>{
                    var calls ;
                    let callPair = d.data.caller + "-" + d.data.name;
                    let newvar = new Node(d.data.name,d.data.caller,d.data.call_num,d.x0,d.y0,d.x1,d.y1);
                    if(d.data.call_num != undefined) calls = d.data.all_index.split(",");
                    nodes.set(d.data.name, newvar);

                    if(calls == undefined){
                        links.set(callPair, 1);
                    }else{
                        if(maxFrequency < calls.length) maxFrequency = calls.length;
                        links.set(callPair, calls.length);
                    }
                    // links.set(callPair, d.data.call_num);
                    
                    // console.log(calls);
                })
                // console.log(nodes);
            //转换数据形式
            nodes = Array.from(nodes);
            links = Array.from(links);
            // console.log(links);
                // console.log("nodes",nodes)
            //获取每一层的高度差
            var height = nodes[1][1].y0 - nodes[0][1].y0;
            //颜色
            var color = d3.scaleSequential([-40, 70], d3.interpolateBlues);
            //连边宽度
            // var frequency = d3.scaleLinear()
            //                 .domain([1, maxFrequency])
            //                 .range([1, 5]);

            //创建svg
            var svg = d3.select(place)
                        .append("svg")
                        .attr("width", w)
                        .attr("height", 1200);
            var tmpg = svg.append('g').attr("transform", "translate(-40, 0)")
            var innerg=tmpg.append('g');
            svg.call(d3.zoom().scaleExtent([0.1, 8]).on('zoom', function() {
                // console.log(d3.event)
                var scale = d3.event.transform.k,
                translate = [d3.event.transform.x, d3.event.transform.y]
            
                innerg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
            }))
            tmpg=innerg;
            //defs
            var defs = tmpg.append("defs");
            //marker
            // var arrow = defs.append("marker")
            //             .attr("id", "arrow")
            //             .attr("markerUnits", "userSpaceOnUse")
            //             .attr("markerWidth", 7)
            //             .attr("markerHeight", 7)
            //             .attr("viewBox", "0 -5 10 10")
            //             .attr("refX", 20)
            //             .attr("refY", 0)
            //             .attr("orient", "auto");
            
            // //箭头
            // var arrow_path = "M0,-5L10,0L0,5"
            // arrow.append("path")
            //     .attr("d", arrow_path)
            //     .attr("fill", "#AAA");
            var arrowMarker=defs.append("marker")  
                .attr("id", "arrow")  
                .attr("viewBox", "0 0 10 10")  
                .attr("refX", 6)  
                .attr("refY", 6)  
                .attr("markerUnits","userSpaceOnUse")
                .attr("markerWidth", 11)  
                .attr("markerHeight", 11)  
                .attr("orient", "auto")  
                .append("path")  
                .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
                .attr("fill","#696969")

            //连边
            tmpg.append("g")
                // .attr("transform", "translate(20, 20)")
                .selectAll("path")
                .data(links)
                .enter()
                .append("path")
                // .attr("d",d=>{
                //     let caller = d[0].split("-")[0];
                //     let callee = d[0].split("-")[1];
                //     let srcX, srcY, trgX, trgY;

                //     //main 返回
                //     if(callee == "__main__") return;

                //     for(let i=0; i<nodes.length;i++){
                //         if(caller == nodes[i][0]) {
                //             srcX = (nodes[i][1].x0+nodes[i][1].x1)/2;
                //             srcY = (nodes[i][1].y0+nodes[i][1].y1)/2;
                //         }
                //         if(callee == nodes[i][0]){
                //             trgX = (nodes[i][1].x0+nodes[i][1].x1)/2;
                //             trgY = (nodes[i][1].y0+nodes[i][1].y1)/2;
                //         }
                //     }
                //     return "M" + srcX + "," + srcY +
                //     "L" + trgX +","+ trgY;
                // })
                .attr("d", d=>{
                    let caller = d[0].split("-")[0];
                    let callee = d[0].split("-")[1];
                    let srcX, srcY, trgX, trgY;

                    //main 返回
                    if(callee == "__main__") return;

                    for(let i=0; i<nodes.length;i++){
                        if(caller == nodes[i][0]) {
                            srcX = (nodes[i][1].x0+nodes[i][1].x1)/2;
                            srcY = (nodes[i][1].y0+nodes[i][1].y1)/2;
                        }
                        if(callee == nodes[i][0]){
                            trgX = (nodes[i][1].x0+nodes[i][1].x1)/2;
                            trgY = (nodes[i][1].y0+nodes[i][1].y1)/2;
                        }
                    }
                    //修正偏移
                    let dx = Math.abs(trgX-srcX);
                    let dy = Math.abs(trgY-srcY);
                    let distance = Math.sqrt(dx*dx+dy*dy);
                    let biasX = r/distance*dx;
                    let biasY = r/distance*dy;
                    let X = srcX>trgX?trgX+rate*biasX:trgX-rate*biasX;
                    let Y = srcY>trgY?trgY+rate*biasY:trgY-rate*biasY;

                    //计算是否相交
                    let k = (srcY-trgY)/(srcX-trgX);
                    let b = srcY-k*srcX;
                    let dis; //圆心距离直线的距离
                    let cross = false;
                    let sweep = 1;
                    let crossNum = 0;
                    for(let i=0;i<nodes.length; i++){
                        dis = Math.abs((k*((nodes[i][1].x0+nodes[i][1].x1)/2)-((nodes[i][1].y0+nodes[i][1].y1)/2)+b)/Math.sqrt(k*k+1));
                        cross = dis <r?true:false;
                        if(cross) crossNum++;
                    }
                    if(caller == "call_user_func" && callee == "readlink" || caller == "call_user_func" && callee == "usort" ||
                    caller == "call_user_func" && callee == "rawurlencode" || caller == "call_user_func" && callee == "mb_strlen")  
                    return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + sweep + (trgX-r*0.6) + "," + (trgY-r*1.3);
                    //特殊情况 在同一层
                    if(srcX == trgX && srcY > trgY){
                        dr = Math.sqrt(dx*dx+dy*dy)*(constant-8+homogeneous)/(curve*homogeneous);
                        return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + sweep + (trgX+0.6*r) + "," + (trgY+rate*r);
                    }
                    if(srcX == trgX && srcY < trgY){
                        dr = Math.sqrt(dx*dx+dy*dy)*(constant-8+homogeneous)/(curve*homogeneous);
                        return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + sweep + (trgX-0.6*r) + "," + (trgY-rate*r);
                    }

                    if(crossNum>2){ //与其他节点相交
                        dr = Math.sqrt(dx*dx+dy*dy)*(constant-crossNum+homogeneous)/(curve*homogeneous);
                        //根据目标方位判断
                        //左上
                        if(trgX<srcX&&trgY<srcY){
                          return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + sweep + (trgX+r) + "," + (trgY+r*1.3);   
                        }
                        //右下
                        if(trgX>srcX&&trgY>srcY){
                            return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + sweep + (trgX-r) + "," + (trgY-r*1.3);
                        }
                        //左下
                        if(trgX<srcX&&trgY>srcY){
                          return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + 0 + (trgX+r) + "," + (trgY-r*1.35);   
                        }
                        //右上
                        if(trgX>srcX&&trgY<srcY){
                          return "M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 0," + 0 + (trgX-r) + "," + (trgY+r*1.3);   
                        }
                    }

                    //自调用
                if(caller == callee){  
                    dr = 20;  
                    return"M" + srcX + "," + srcY + "A" + dr + "," + dr + " 0 1,1 " + (srcX+1.2*r) + "," + (srcY+r);  
                }

                    return "M" + srcX + "," + srcY + "L" + X + "," + Y;
                })
                .attr("stroke", "#aaa")
                .attr("stroke-width",d=>{
                        return frequency(Math.log2(d[1]));
                })
                .attr("marker-end", "url(#arrow)")
                .attr("fill", "none");


            //节点
            tmpg.append("g")
                // .attr("transform", "translate(20, 20)")
                .selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("cx", d=>(d[1].x0+d[1].x1)/2)
                .attr("cy", d=>(d[1].y0+d[1].y1)/2)
                .attr("r", r)
                .attr("stroke", d=>{
                    // if(d[0] == "__main__") return "rgb(176,0,0)";
                    return "#aaa";
                })
                .attr("stroke-width", 2)
                .attr("fill", d=>{
                    // if(d[0] == "__main__") return "#fff";
                    return "#F6F6F6";
                });

            //文字
            var textGroup = tmpg.append("g")
                // .attr("transform", "translate(20, 20)")
                .selectAll("g")
                .data(nodes)
                .enter()
                .append("g");

            var shadow = textGroup.append("text")
                        .text(d=>d[0])
                        .attr("dx", 12)
                        .attr("dy", 4)
                        .attr("class", "shadow")
                        .attr("x", d=>(d[1].x0+d[1].x1)/2)
                        .attr("y", d=>(d[1].y0+d[1].y1)/2)
                        // .style('writing-mode','tb-rl');
            var text = textGroup.append("text")
                        // .text(d=>d[0].slice(0,maxLength))
                        .text(d=>d[0])
                        .attr("dx", 12)
                        .attr("dy", 4)
                        .attr("font-size", "12px")
                        .attr("fill", "#000")
                        .attr("x", d=>(d[1].x0+d[1].x1)/2)
                        .attr("y", d=>(d[1].y0+d[1].y1)/2)
                        // .style('writing-mode','tb-rl');


        // function getData(x){        
        //     if(x.children == undefined || x == undefined) return;
        //     for(var i=0; i < x.children.length; i++){ //一次循环开始代表进入了下一层
        //         if(maxFrequency < x.children[i].call_num) maxFrequency = x.children[i].call_num;
                
        //         temp = x.children[i];
        //         getData(temp);           
        //     }
        //     return;
        // }

        //构造函数
        function Node(name, caller, call_num, x0, y0, x1, y1){
            this.name = name;
            this.caller = caller;
            this.call_num = call_num;
            this.x0 = y0;
            this.y0 = x0;
            this.x1 = y1;
            this.y1 = x1;
        }
    }