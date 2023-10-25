export default function create_graph(d3,csv,place){
    document.querySelector(place).innerHTML = '';
    var w = 1500;
    var h = 1500;
    var padding = 20;
    var r = 8;
    var rate = 1.5; //调控连边缩进的比例
    //控制绘制曲线
    var curve=1.5;  
    var homogeneous=1.2; 
    var consant = 1;

    var dataset = {
        nodes: [],
        links: []
    }
    var funcs = new Set();
    var linkGroup = new Set(); //记录调用对
    var linkCount = new Map();  //记录调用次数
    var linkLoop = new Set();  //记录成环的调用
    document.querySelector(place).innerHTML = '';
    // console.log(csv)
    //颜色
    var color = d3.scaleSequential([-40, 70], d3.interpolateBlues);
        //获取调用关系
        for(let i=0; i<csv.length; i++){
            let relation = csv[i].source + "-" + csv[i].target;
            linkGroup.add(relation);
            funcs.add(csv[i].source);
            funcs.add(csv[i].target);

            if(linkCount.has(relation)){
                let value = linkCount.get(relation);
                value++;
                linkCount.set(relation, value);
            }else{
                linkCount.set(relation, 1);
            }
        }

        //迭代所有调用对 记录成环调用
        for(let link of linkGroup){
            let arr = link.split("-");
            let reverse = arr[1] + "-" + arr[0];
            if(linkGroup.has(reverse)){
                linkLoop.add(link);
            }
        }

        // console.log(linkLoop);            
        linkGroup = Array.from(linkGroup);
        linkCount = Array.from(linkCount);
        funcs = Array.from(funcs);

        //节点
        var nodeObj;            
        for(let i=0; i<funcs.length; i++){
            nodeObj = new Object();
            nodeObj.name = funcs[i];
            dataset.nodes.push(nodeObj);
        }

        //编号
        var linkObj;

        for(let i=0; i< linkGroup.length; i++){
            let arr = linkGroup[i].split("-");
            linkObj = new Object();
            for(var j=0; j<dataset.nodes.length; j++){
                if(dataset.nodes[j].name == arr[0]){
                    linkObj.source = j;
                }
                if(dataset.nodes[j].name == arr[1]){
                    linkObj.target = j;
                }
            }
            dataset.links.push(linkObj);
        }

        //处理成最终格式
        dataset.links.splice(0,0,dataset.links[0]);  //我也不知道为什么第一个会empty
        // dataset.links[0].index=0;
        // console.log("dataset",dataset);

        //宽度
        var maxFrequency = d3.max(linkCount, d=>d[1]);
        var frequency = d3.scaleLinear()
                        .domain([0,4,9,12])
                        .range([1,3.5,4.5,5.5]);

        //svg
        
        var svg = d3.select(place)
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        var tmpg = svg.append('g').attr("transform", "translate(100,80)");
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
        //defs
        tmpg=innerg;
        var defs = tmpg.append("defs");
        var arrowMarker=defs.append("marker")  
                .attr("id", "arrow")  
                .attr("viewBox", "0 0 10 10")  
                .attr("refX", 7)  
                .attr("refY", 6)  
                .attr("markerUnits","userSpaceOnUse")
                .attr("markerWidth", 11)  
                .attr("markerHeight", 11)  
                .attr("orient", "auto")  
                .append("path")  
                .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
                .attr("fill","#696969")

        var simulation = d3.forceSimulation(dataset.nodes)
                            .force("charge", d3.forceManyBody().strength(-120))
                            .force("link", d3.forceLink(dataset.links).distance(130))
                            .force("center", d3.forceCenter(w/4, h/6))
                            // .force("x", d3.forceX(w / 2).strength(0.07))
                            // .force("y", d3.forceY(h / 2).strength(0.07))
                            .on("tick", ticked);
        function firstUpdate() {

            while (simulation.alpha() > simulation.alphaMin() * 80) {
                // console.log("first")
                simulation.tick();
            }

        }
        function ticked() {
            path.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            nodes.attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }
        firstUpdate();
        var lnkColor=d3.scaleSequential([0,dataset.links.length+10], d3.interpolateOrRd)
        //换用path 边
        var path = tmpg.selectAll("path")
                        .data(dataset.links)
                        .enter()
                        .append("path")
                        .attr("stroke", d=>lnkColor(d.index+10))
                        .attr("stroke-width", d=>{
                        let key = d.source.name + "-" + d.target.name;
                        for(let i=0; i<linkCount.length; i++){
                            if(linkCount[i][0] == key) return frequency(Math.log2(linkCount[i][1]));
                        }
                    })
                        .attr("marker-end", "url(#arrow)")
                        // .attr("transform", "translate(500,500)")
                        .attr("fill", "none");


        //点
        var nodes = tmpg.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("circle")
            .attr("r", r)
            // .attr("transform", "translate(500,500)")
            .attr("stroke", d=>{
                // if(d.name == "__main__") return "rgb(176, 0 ,0)";
                return "#aaa";
            })
            .attr("stroke-width", 2)
            .attr("fill", d=>{
                // if(d.name == "__main__") return "#fff";
                return "#F6F6F6"; 
            })
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

        //文字
        var textGroup = tmpg.selectAll("g")
            .data(dataset.nodes)
            .enter()
            .append("g");

        //添加文字阴影
        var shadow = textGroup.append("text")
                    .text(d=>d.name)
                    .attr("class", "shadow")
                    // .attr("transform", "translate(500,500)");

        var text = textGroup.append("text")
                    .text(d=>d.name)
                    // .attr("font-size", "12px")
                    // .attr("transform", "translate(500,500)");
                    
        simulation.on("tick", function(){

        path.attr("d", function(d) {
            var dx = Math.abs(d.target.x - d.source.x);  
            var dy = Math.abs(d.target.y - d.source.y);  
            var distance = Math.sqrt(dx*dx + dy*dy);
            var dr = Math.sqrt(dx*dx+dy*dy)*(20+homogeneous)/(curve*homogeneous);

            //修正偏移
            var biasX = r / distance * dx;
            var biasY = r / distance * dy;
            var X = d.source.x>d.target.x? d.target.x + rate*biasX:d.target.x-rate*biasX;
            var Y = d.source.y>d.target.y?d.target.y+rate*biasY:d.target.y-rate*biasY;

            //自调用
            if(d.target.x == d.source.x && d.target.y == d.source.y){
                dr = 20;  
                return"M" + d.source.x + "," + d.target.y + "A" + dr + "," + dr + " 0 1,1 " + (d.source.x+1.2*r) + "," + (d.source.y+r);  
            }
            
            var relation = d.source.name + "-" + d.target.name;
            //相对 但函数不同
            if(linkLoop.has(relation)){  
                dr = Math.sqrt(dx*dx+dy*dy)*(consant+homogeneous)/(curve*homogeneous);  
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + X + "," + Y;  
            }

            //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;  
            return "M" + d.source.x + "," + d.source.y + "L"  + X + "," + Y;  
        }); 

            nodes.attr("cx", function(d) {return d.x;})
                .attr("cy", function(d){return d.y;})
                
            shadow.attr("x", d=>d.x+10)
                    .attr("y", d=>d.y+4);

            text.attr("x", function(d) {return d.x+10;})
                .attr("y", function(d){return d.y+4;});
            })

        //拖拽事件
        function dragstarted(d){
            if(!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragged(d){
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d){
            if(!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
}