export default function icicle(d3,json,place){
    document.querySelector(place).innerHTML = '';
    var w = 700;
        var h = 950;
        var padding = 10;
        var fill = "#ccc";

        var minHeight = 20; //最小单元高度
        var minWidth = 180; //最小单元宽度
        var maxValue = 0;
        var temp;

        //../pilot data/c7731c18c9cff9dde3c7775c43bfade9_36158d68f39cf53ac1c2c932eeab7c71.json
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
            var data = json[0];

            getData(data);
            // console.log(maxValue);

            //分层
            const root = d3.hierarchy(data, d => d.children);
            root.count();  //统计某个节点下的节点数

            //为统一每个单元绝对高度 计算叶子的数目
            var leaves = root.leaves().length; //叶子个数
            var maxDepth = 0;
            root.descendants().forEach(d=>{

               if(maxDepth < d.depth) maxDepth = d.depth;
            })

            d3.partition()
                .size([leaves*minHeight, maxDepth*minWidth])
                .padding(1)
                .round(false)(root);  //什么写法

            //var color = d3.scaleSequential([0, root.children.length], d3.interpolateRainbow);
            var width = root.y1 - root.y0;            
            var color = d3.scaleSequential([-2, root.height+1], d3.interpolateBlues);
            var Color1 = d3.scaleSequential([-4, 8, maxValue+3], d3.interpolateBlues);
            //非分段函数
            //var Color1 = d3.scaleSequential([-60, maxValue+10], d3.interpolateBlues);
            var Width = d3.scaleLinear()
                            .domain([0, maxValue])
                            .range([0,width]);
            // console.log(width);
            // //增加下标
            root.children.forEach((child, i) => child.index = i); 

            //创建svg
            var svg = d3.select(place)
                        .append("svg")
                        .attr("width", 1400)
                        .attr("height", 2500)
                        // .attr("transform", "translate(120, 50)");
            var tmpg = svg.append('g');
            var innerg=tmpg.append('g').attr("transform","translate(20,20)");
            svg.call(d3.zoom().scaleExtent([0.1, 8]).on('zoom', function() {
                // console.log(d3.event)
                var scale = d3.event.transform.k,
                translate = [d3.event.transform.x, d3.event.transform.y]
            
                innerg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
            }))
                .append('g')
                .attr('width', '100%')
                .attr('height', '100%')
            svg=innerg;
            //方框
            svg.append("g")
                .selectAll("rect")
                .data(root.descendants())
                .enter()
                .append("rect")
                .attr("width", d => d.y1 - d.y0+10)
                .attr("height", d =>d.x1 - d.x0)
                .attr("stroke", (d,i) => {
                    // if(d.ancestors().reverse()[1] != undefined){
                    //     d.index = d.ancestors().reverse()[1].index;
                    // }
                    //return d.ancestors().reverse()[1]? color(d.index) : fill
                    // return color(d.depth);
                    // if(i==0) return "#8dc0dd"
                    return "#fff"
                })
                // .attr("stroke-width", "2px")
                .attr("fill", "#F6F6F6")
                .attr("transform", (d,i)=>{
                    if(i == 0){
                        return "translate(" + (d.y0+20 + width - 102) + "," + d.x0 + ")";
                    }
                    return "translate(" + (d.y0+10) + "," + d.x0 + ")";
                });

            //正方形
            svg.append("g")
                .selectAll("rect")
                .data(root.descendants())
                .enter()
                .append("rect")
                // .attr("width", d => Width(d.data.call_num))
                .attr("width", (d, i) => {
                    if(i == 0){
                        return 102
                    }
                    return d.y1 - d.y0+16
                })
                .attr("height", (d,i) =>{
                    if(i==0) return d.x1 - d.x0-1
                    return d.x1 - d.x0
                })
                .attr("fill", (d,i) => {
                    // if(d.ancestors().reverse()[1] != undefined){
                    //     d.index = d.ancestors().reverse()[1].index;
                    // }
                    // return d.ancestors().reverse()[1]? color(d.depth) : fill

                    // if(i==0) return "rgb(229, 239, 247)";
                    if(i==0) return "#F6F6F6";
                    //return Color1(d.data.call_num);
                    return Color1(d.data.all_index.split(",").length);
                })
                .attr("stroke", (d,i) => {
                    if(i==0) return "#aaa"
                })
                .attr("fill-opacity", 0.8)
                .attr("transform", (d,i)=>{
                    if(i == 0){
                        return "translate(" + (d.y0+16 + width - 102) + "," + (d.x0+0.5) + ")";
                    }
                    return "translate(" + (d.y0+(d.depth)*16) + "," + d.x0 + ")";
                });

            //添加标签 函数名
            svg.append("g")
                .attr("class", "func")
                .selectAll("text")
                .data(root.descendants())
                .enter()
                .append("text")
                .text(d => d.data.name.slice(0,19))
                .attr("transform", (d, i)=>{
                    if(i == 0){
                        return "translate(" + (d.y0+16+padding+width-85) + "," + (d.x0+4+(d.x1-d.x0)/2) + ")";
                    }
                    return "translate(" + (d.y0+(d.depth)*16+padding) + "," + (d.x0+4+(d.x1-d.x0)/2) + ")";
                });
  

        function getData(x,count){        
            if(x.children == undefined || x == undefined) return;

            for(var i=0; i < x.children.length; i++){

                var calls = x.children[i].all_index.split(",");
                if(maxValue < calls.length) maxValue = calls.length;
                //if(maxValue < x.children[i].call_num) maxValue = x.children[i].call_num;
                
                temp = x.children[i];
                getData(temp , count);           
            }
            return;
        }
}