export default function create_hierarchyMatrix(d3,json,place){
    document.querySelector(place).innerHTML = '';
        var Line = 20;
        //函数名字高度
        var Height = 20;
        var block = Math.sqrt(2)/2*Height; //矩形的边长

        var w = 2800;
        var h = 2900;
        var padding = 20;
        var r = 5;
        var maxLength = 15; //最长调用长度
        //前置
        var depths=[1];
        var temp;
        var funcs = [{name:"__main__", caller:undefined}]; //记录所有函数名
        var loopRange = new Map(); //记录一个调用子树范围
        var callPair = new Array(); //记录调用对
        var maxValue = 0; //最大调用次数
        var name;
        //生成svg
        var svg = d3.select(place)
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    // .attr("transform", "translate(120, 50)");
        var tmpg = svg.append('g');
        var innerg=tmpg.append('g');
        svg.call(d3.zoom().scaleExtent([0.1, 8]).on('zoom', function() {
            // console.log(d3.event)
            var scale = d3.event.transform.k,
            translate = [d3.event.transform.x, d3.event.transform.y]
        
            innerg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
        }))
            // .append('g')
            // .attr('width', '100%')
            // .attr('height', '100%')
        svg=innerg;
        //加载json文件
        //design schema_eg3.json 178
        //byorder_6523ed998ffd028b6a30b335e3afff29_83903657c2c2827946a007dd3d45eefa.json 
        //../../pilot data/c7731c18c9cff9dde3c7775c43bfade9_36158d68f39cf53ac1c2c932eeab7c71.json

        //FCD01-f8a7ed64f4b70d7cb0b6473ae96b4e18_df4928ab81235c09e6a48ca9b288a582.json
        //FCD02-64c45bcbe96bd908d3829737cb1e7b13_79224f2b8677e4259089a82145fac350.json
        //FCD03-3836af0d37c76f043922470db37af5aa_638e7bef958618125d2b0be0c0796650-804.json
        //FCD04-efcfde24f7cf8383986cf4797aceaba3_6db2e4351d4790d1f437ef47852e60b9.json
        //FCD05-81c7178a6e5bd4f936a0d0f4d8e283aa_1e598807fe34a9d95677495007513a01.json
        //FCD06-ac6440efd0d224d0437c2e56bba9a789_92063b6c7e619045102d4326d3ba2e5c.json
        //FCD08-20dccba2eba7ec86990b699d2dca4dc2_a82a0625bae4b9fbcb0e5c0a85519646.json
        //FCD09-7aeb0f45e12e6efbf55147e587f2eda5_3e0ae99fd9b6c7c157e6c64560bfcf16.json

        //FCD2-01-01-efcfde24f7cf8383986cf4797aceaba3_6db2e4351d4790d1f437ef47852e60b9.json
        //FCD2-01-02-7c8d6cec8688bfe95ac2cb45e3559ea8_41976d52e034de62b2d008035050c5bd.json
        //FCD2-01-03-92f2fd60bd3d29ea0a488993fde14455_0ca5da64c060ed68cb2907c1f4c6413a.json
        //FCD2-01-04-a70863aa6eff896262e098ca9d50f0d4_c5efbd981cf89de69051c7ee8773e70a.json
        //FCD2-02-01-64c45bcbe96bd908d3829737cb1e7b13_874a58413070ec2a494df1dd2182f02c.json
        //FCD2-02-02-64c45bcbe96bd908d3829737cb1e7b13_160841eaeaad337432c0bb1ea42004a0.json
        //FCD2-02-03-64c45bcbe96bd908d3829737cb1e7b13_feb16a68bf048819c84cefcf50417c03.json
        //FCD2-02-04-ea203f6327ab21fbb783cda38805ef29_9d4eee68292842907722e73b1474d823.json
            var data = json[0];
            // console.log("1");
            // console.log(data);

            var maxDepth;

            getData(data, 1);
            // console.log("2");
            // console.log(callPair);
            //需要的数据
            maxDepth = d3.max(depths);
            loopRange = Array.from(loopRange);
            // console.log(maxLength);
            // console.log(loopRange);

            //颜色
            var len = funcs.length; //所有的函数名
            var color = d3.scaleSequential([-4, 8, maxValue+3], d3.interpolateBlues);


            //画最开始的圆点
            svg.append("g")
                .append("circle")
                .attr("cx", r)
                .attr("cy", Height*1.3-10)
                .attr("r",r)
                .attr("fill", "#CDCDCD");

            //画竖线
            var index;
            svg.append("g")
                .attr("class", "lines")
                .selectAll("line")
                .data(loopRange)
                .enter()
                .append("line")
                .attr("x1", d => {
                    return (d[1] - 1) * Line; 
                })
                .attr("y1", d => {
                    let caller = d[0].split("-")[0];
                    
                    for(let i=0; i<len; i++){
                        if(funcs[i].name == caller && d[1] == (depths[i])){
                            index = i;
                            break;
                        }
                    }
                    return (index + 1.3) * Height-10;
                })
                .attr("x2", d => {
                    return (d[1] - 1) * Line;
                })
                .attr("y2", d => {
                    let caller = d[0].split("-")[0];
                    let callee = d[0].split("-")[1];

                    for(let i=0; i<len; i++){
                        if(funcs[i].name == callee && d[1] == (depths[i] - 1) && funcs[i].caller == caller){
                            index = i;
                            break;
                        }
                    }
                    return (index + 1.3) * Height-10;
                })
                .attr("transform", "translate(" + padding + ",0)");
                //.attr("transform", "translate(" + padding*1.5 + ",0)");

            //画横线
            svg.append("g")
                // .attr("transform", "translate(" + padding*0.5 + ",0)")
                .attr("class", "lines")
                .selectAll("line")
                .data(depths)
                .enter()
                .append("line")
                .attr("x1", d => (d - 1)*Line)
                .attr("y1", (d, i) => (i+1.3) * Height-10)
                .attr("x2", maxDepth*Line+129)
                //.attr("x2", () => maxDepth*Line + 150)
                .attr("y2", (d, i) => (i+1.3)*Height-10)
            // svg.append('g')
            //     .attr('class','dlines')
            //     .selectAll("line")
            //     .data(depths)
            //     .enter()
            //     .append("line")
            //     .attr("x1", maxDepth*Line+130)
            //     .attr("y1", (d, i) => (i+1.3)*Height-10)
            //     .attr("x2", maxDepth*Line+135)
            //     //.attr("x2", () => maxDepth*Line + 150)
            //     .attr("y2", (d, i) => (i+1.3)*Height-5)
            //     .attr("stroke",'#ccc')
            //     .attr("stroke",(d,i)=>i==depths.length-1?"#fff":'#ccc')
            // svg.append('g')
            //     .attr('class','ulines')
            //     .selectAll("line")
            //     .data(depths)
            //     .enter()
            //     .append("line")
            //     .attr("x1", maxDepth*Line+130)
            //     .attr("y1", (d, i) => (i+1.3)*Height-10)
            //     .attr("x2", maxDepth*Line+135)
            //     //.attr("x2", () => maxDepth*Line + 150)
            //     .attr("y2", (d, i) => (i+1.3)*Height-15)
            //     .attr("stroke",(d,i)=>i==0?"#fff":'#ccc')
            svg.append("g")
                .attr("class",'endcircle')
                .selectAll("circle")
                .data(depths)
                .enter()
                .append("circle")
                .attr("cx",maxDepth*Line+130)
                .attr("cy",(d, i) => (i+1.3)*Height-10)
                .attr("r",2)
                .attr('fill','#ccc')
            //绘制函数
            var func=svg.append("g")
                .attr("class", "func")
                .selectAll("text")
                .data(funcs)
                .enter()
            function getBB(selection) {
                selection.each(function(d){d.bbox = this.getBBox();})
            }
            func.append("text")
                .text(d => d.name)
                // .attr("X", maxDepth*Line)
                .each(function(d, i){
                    //getBoundingClientRect() 获取text元素的长宽
                    d3.select(this)
                    .attr("x", -39)
                })
                .attr("y", (d, i) => {
                    return (i + 1)*Height;
                })
                .attr("transform", (d,i)=>{
                    // if(i==0) return "translate(" + ((2+depths[1])*Line ) + ",0)"
                    return "translate(" + ((2+depths[i])*Line ) + ",0)"
                })
                .call(getBB)
            func.insert("rect","text")
                .attr("width", function(d){return d.bbox.width})
                .attr("height", function(d){return d.bbox.height})
                .style("fill", "#fff")
                .attr('x',-39)
                .attr("y", (d, i) => {
                    return (i + 1)*Height;
                })
                .attr("transform", (d,i)=>{
                    // if(i==0) return "translate(" + ((2+depths[1])*Line ) + ",0)"
                    return "translate(" + ((2+depths[i])*Line ) + ",-12)"
                })
                
            //填充背景
            //计算总方块数 -Math.sqrt(2)/2*len*block
            var sum = 0;
            for(let i=1; i<len; i++){
                sum = sum + i;
            }

            var empty = new Array(sum);
            var Xindex = 0; //控制距离
            var Xstep = 1;
            var count;
            var rectGroup = svg.append("g")
                    .attr("transform", "translate("+ (maxDepth*Line+140-Math.sqrt(2)/2*len*block-1) +","+ (len*Height/2+16) +")rotate(-45)");

            rectGroup.selectAll("rect")
                    .data(empty)
                    .enter()
                    .append("rect")
                    .attr("width", block*0.9)
                    .attr("height", block*0.9)
                    // .attr('stroke', '#AAA')
                    // .attr('stroke-width', '1.5px')
                    .attr("fill","#F6F6F6");

            for(let i=0; i<len; i++){
                count = Xstep;
                rectGroup.selectAll("rect")
                    .select(function(d,i){ return Xindex <= i && i < (Xindex + Xstep) ? this : null;})
                    .attr("x", ()=>{
                        let distance = (len - count) * block;
                        count--;
                        return distance;
                    })
                    .attr("y", (Xstep-1)*block)

                Xindex = Xindex+Xstep;
                Xstep++;
            }

            //绘制频率
            svg.append("g")
                .attr("transform", "translate("+ (maxDepth*Line+140-Math.sqrt(2)/2*len*block-1) +","+ (len*Height/2+16) +")rotate(-45)")
                .selectAll("rect")
                .data(callPair)
                .enter()
                .append("rect")
                .attr("x", function(d){
                    let caller = d[0].split("-")[0];

                    for(let i=0; i<len; i++){
                        if(funcs[i].name == caller && d[1] == (depths[i])){
                            index = i;
                            break;
                        }
                    }
                    return block*(len-index-1);
                })
                .attr("y", function(d){
                    let caller = d[0].split("-")[0];
                    let callee = d[0].split("-")[1];

                    for(let i=0; i<len; i++){
                        if(funcs[i].name == callee && d[1] == (depths[i] - 1) && funcs[i].caller == caller){ //子函数一定在父函数后面
                            index = i;
                            break;
                        }
                    }
                    return block*(index-1);
                })
                .attr("width", block*0.9)
                .attr("height", block*0.9)
                .attr("fill", (d,i) => {
                    return color(d[2])})
                //.attr("fill-opacity", 0.8);


        //递归循环数据
        function getData(x,count){        
            if(x.children == undefined || x == undefined) return;
            for(var i=0; i < x.children.length; i++){ //一次循环开始代表进入了下一层
                if( i == 0 ) count++;

                if( i == x.children.length - 1){
                    var key = x.children[i].caller + "-" + x.children[i].name;

                    loopRange.set(key, count - 1 ); //记录调用父节点的深度
                }
                //if(maxValue < x.children[i].call_num) maxValue = x.children[i].call_num;

                var calls = 1;
                calls = x.children[i].all_index.split(",");
                if(maxValue < calls.length) maxValue = calls.length;

                var node = new Node(x.children[i].name,x.children[i].caller)
                depths.push(count);
                funcs.push(node);
                callPair.push([x.children[i].caller + "-" + x.children[i].name, count - 1, calls.length]);
                
                temp = x.children[i];
                getData(temp , count);           
            }
            return;
        }

                //构造函数
        function Node(name, caller){
            this.name = name;
            this.caller = caller;
        }
}