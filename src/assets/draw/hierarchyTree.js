export default function hierarchyTree(d3,data,csv,place){
    document.querySelector(place).innerHTML = '';
    var width =2800 ,//195-3200
            height = 650;

        /*var linear=d3.scale.linear()
            .domain([0.5,7])
            .range([0.6,2]);*/

        var svg = d3.select(place).append("svg")
            .attr("width", width+80)
            .attr("height", 1200)
            //.attr("viewBox",[0,0,width*2,height*2])
            // .attr("transform", "translate(100,100)")
        var tmpg = svg.append('g').attr("transform", "translate(-40, -20)")
        var innerg=tmpg.append('g')
        svg.call(d3.behavior.zoom().scaleExtent([0.1, 8]).on('zoom', function() {
            // console.log(d3.event)
            var scale = d3.event.scale
            var translate = d3.event.translate
        
            innerg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
        }))
        svg=innerg;    

        var z = d3.scale.ordinal()
              //.domain(data.columns.slice(1))
              .domain(["CALL","SYS","ZEND","STR","ARRAY","CODE","FILE","NET","ENV","COMP","OTHER","USER"])
              .range(["#F1A069", "#D04040", "#AD93B0", "#9DC7A1","#63A3A5","#D0E9CC","#703DAD","#BF9484","#705F4F","#F0F4A7","#D0CECE","#F0D668"])
        var defs = svg.append("defs");
        var clipWrapper = defs.append("g").attr("class", "clip-group-wrapper");
        var filter = defs.append("filter")
         .attr("width", "300%")
         .attr("x", "-150%")
         .attr("height", "300%")
         .attr("y", "-150%")
         .attr("id","glow");
        filter.append("feGaussianBlur")
         .attr("class", "blur")
         .attr("stdDeviation","1.5")
         .attr("result","coloredBlur");


        //pilot data/c7731c18c9cff9dde3c7775c43bfade9_36158d68f39cf53ac1c2c932eeab7c71.json
        //ac6440efd0d224d0437c2e56bba9a789_d9c087b9afef970361fe61ae918d1388.json

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
            var key_type="type_list";
            data[key_type]=[];

            //var root=data[0]; //数据外面有中括号
            var root=data[0]; 
            // console.log(data);
            getData(root);
            // console.log(maxFrequency);
            
            var tree1 = d3.layout.tree()
                .size([width-100, height - 100])
                .separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2)/a.depth;
                });

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.y, d.x];
                });

            var nodes1 = tree1.nodes(root);
            var links1 = tree1.links(nodes1);

            var newnode=[]


            var obj={};
            var objnum={};

            for(var ni=1;ni<nodes1.length;ni++){
                var item=nodes1[ni].depth;
                if(obj[item]){
                    obj[item]=(obj[item]+1)
                }else{
                    obj[item]=1;
                }
            }
            function getobjvalue(objnum) {
                var values = [];
                for (var property in obj)
                    values.push(obj[property]);
                return values;
            }
            var values=getobjvalue(obj)
            var keys=[];
            for (var property in obj){
                if(obj[property]==values){
                    keys.push(property)
                }else{continue;}
            }

            // console.log("obj: ");
            // console.log(obj);

            var tree_h=Object.keys(obj).length;

            
            var maxargc=d3.max(values)
            // console.log(maxargc)
            // var maxwidth = maxargc*35/2.2;
            var maxwidth = maxargc*55/2.2;
            // console.log(obj[1]<maxargc&&objnum[2]<maxargc);
            if(obj[1]<maxargc&&obj[2]<maxargc&&obj[3]<maxargc){
                //maxwidth = maxargc*46/2.2;
                maxwidth = maxargc*65/2.2;
            }else if(obj[1]<maxargc/*&&objnum[2]<maxargc*/){
                //50
                maxwidth = maxargc*70/2.2;
            }else{
                maxwidth = maxargc*70/2.2;
            }
            // console.log(maxwidth);


            var tree = d3.layout.tree()
                .size([maxwidth*2,tree_h*140])
                .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
            var nodes = tree.nodes(root);
            var links = tree.links(nodes);
            // console.log("csv",csv.length)
            var lnkColor=d3.scale.quantize()
            .domain(d3.range(0,csv.length))
            // .range(['#12008c','#8c00a7','#8e00a7','#e26260','#f88f39'])
            // .range(['#1bf17c','#00dbaa','#00c2c8','#1d9fe0','#4770e0','#6647c1','#6f3bac'])
            // .range(['#d5e400','#99db2a','#41c26b','#18ae80','#12958b','#217e8f','#2c6990','#3d468b','#48247a'])
            // .range(['#fae248','#d5c163','#b3a973','#8d8877','#7d7974','#3f4e6d','#073069'])
            // .range(['#fee0b7','#fdd19e','#fdb37d','#fc9f6b','#f57a51','#ef6948','#d12a1c','#aa0503','#800000'])
            .range(['#423088','#3a82f8','#2be0b6','#b6f140','#f6c52a','#fe6f1a','#cd300d','#900b00'])
            // .interpolate(d3.interpolateLab)


            // console.log("w-h:",[maxwidth*2,tree_h*120]);

            var issame=0;

            // console.log(nodes);
            // console.log(links);

            //控制边宽度
            var frequency = d3.scale.linear()
                        // .domain([0,3,9,12])
                        // .range([1,2.5,4.5,5.5]);
                        .domain([1,2,8,12])
                        .range([1,2.5,4.5,5.5]);
            // 曲线连边
            // var arrow = defs.append("marker")
            //             .attr("id", "arrow")
            //             .attr("markerUnits", "userSpaceOnUse")
            //             .attr("markerWidth", 7)
            //             .attr("markerHeight", 7)
            //             .attr("viewBox", "0 -5 10 10")
            //             .attr("refX", 20)
            //             .attr("refY", 0)
            //             .attr("orient", "auto");
            // var arrow_path = "M0,-5L10,0L0,5"
            // arrow.append("path")
            //     .attr("d", arrow_path)
            //     .attr("fill", "#aaa");
            var arrowMarker=defs.append("marker")  
                .attr("id", "arrow")  
                .attr("viewBox", "0 0 10 10")  
                .attr("refX", 18)  
                .attr("refY", 6)  
                .attr("markerUnits","userSpaceOnUse")
                .attr("markerWidth", 11)  
                .attr("markerHeight", 11)  
                .attr("orient", "auto")  
                .append("path")  
                .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
                .attr("fill","#696969")
            function elbow(d) {
                let sourceX = d.source.y,
                    sourceY = d.source.x,
                    targetX = d.target.y,
                    targetY = d.target.x;
            
                return "M" + sourceX + "," + sourceY +
                    "L" + targetX +","+ targetY;
            }
            // console.log("links",links)
            var link = svg.selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("stroke",d=>{
                    // console.log(Math.min(...JSON.parse(d.target.all_index)),lnkColor(Math.min(...JSON.parse(d.target.all_index))))
                    // return lnkColor(Math.min(...JSON.parse(d.target.all_index)))
                    return "#aaa"
                })
                //.attr("marker-end", function(d) { return "url(#arrow)"; })
                // .attr("d", diagonal)
                .attr("d",elbow)
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", function(d) {
                    // console.log("FREQUENCY",JSON.parse(d.target.all_index)); 
                    return frequency(Math.log2(JSON.parse(d.target.all_index).length))
                    //return 0.6
                })
                .append("title")
                    .text(function(d){
                         return "all_index: "+d.target.all_index+"\ntotal callnum: "+d.target.call_num;
                });

            var node = svg.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                })

            node.append("circle")
                .attr("cx",function(d){
                    return 0;
                })
                .attr("cy",function(d){
                    return 0;
                })
                .attr("r", 8)
                .attr("fill", function(d){
                    // if(d.name == "__main__") return "#fff";
                    // return "rgb(211, 228, 243)";           
                    return "#F6F6F6"                                  
                })
                .attr("stroke", (d)=>{
                    // if(d.name == "__main__") return "rgb(176, 0, 0)"
                    // return "rgb(160, 202, 227)";
                    return "#AAA"
                })
                .attr("stroke-width", "0.6px")
                
            var gcircle = svg.append("g")
                // .attr("transform","translate(20,20)");
            
            // console.log("nodes",nodes);
            node.append("text")
                .text(d=>d.name)
                .attr("dx", 12)
                .attr("dy", 4)
                .attr("class", "shadow")
            node.append("text")
                .attr("dx", 12)
                .attr("dy", 4)
                .style("text-anchor", "start")
                // .style("font-size","12px")
                // .style('writing-mode','tb-rl') //竖着显示文字
                .text(d=>d.name)
                // .attr("transform", "rotate(-45)")
        var maxFrequency = 0;
        var temp;
        function getData(x){        
            if(x.children == undefined || x == undefined) return;
            for(var i=0; i < x.children.length; i++){ //一次循环开始代表进入了下一层
                if(maxFrequency < x.children[i].all_index.length) maxFrequency = x.children[i].all_index.length;
                temp = x.children[i];
                getData(temp);           
            }
            return;
        }
}