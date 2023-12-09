export default function create_matrix(d3,csv,place){
    // var w = 1000;
        // var h = 600;
    document.querySelector(place).innerHTML = '';
        var padding = 45;
        var width = 26;

        //读取数据
            //let rawData = await d3.csv("83903657c2c2827946a007dd3d45eefa.csv", d3.autoType);
            //../../pilot data/c7731c18c9cff9dde3c7775c43bfade9_36158d68f39cf53ac1c2c932eeab7c71.csv

            //FCD01-f8a7ed64f4b70d7cb0b6473ae96b4e18_df4928ab81235c09e6a48ca9b288a582.csv
            //FCD02-64c45bcbe96bd908d3829737cb1e7b13_79224f2b8677e4259089a82145fac350.csv
            //FCD03-3836af0d37c76f043922470db37af5aa_638e7bef958618125d2b0be0c0796650-804.csv
            //FCD04-efcfde24f7cf8383986cf4797aceaba3_6db2e4351d4790d1f437ef47852e60b9.csv
            //FCD05-81c7178a6e5bd4f936a0d0f4d8e283aa_1e598807fe34a9d95677495007513a01.csv
            //FCD06-ac6440efd0d224d0437c2e56bba9a789_92063b6c7e619045102d4326d3ba2e5c.csv
            //FCD08-20dccba2eba7ec86990b699d2dca4dc2_a82a0625bae4b9fbcb0e5c0a85519646.csv
            //FCD09-7aeb0f45e12e6efbf55147e587f2eda5_3e0ae99fd9b6c7c157e6c64560bfcf16.csv

            //FCD2-01-01-efcfde24f7cf8383986cf4797aceaba3_6db2e4351d4790d1f437ef47852e60b9.csv
            //FCD2-01-02-7c8d6cec8688bfe95ac2cb45e3559ea8_41976d52e034de62b2d008035050c5bd.csv
            //FCD2-01-03-92f2fd60bd3d29ea0a488993fde14455_0ca5da64c060ed68cb2907c1f4c6413a.csv
            //FCD2-01-04-a70863aa6eff896262e098ca9d50f0d4_c5efbd981cf89de69051c7ee8773e70a.csv
            //FCD2-02-01-64c45bcbe96bd908d3829737cb1e7b13_874a58413070ec2a494df1dd2182f02c.csv
            //FCD2-02-02-64c45bcbe96bd908d3829737cb1e7b13_160841eaeaad337432c0bb1ea42004a0.csv
            //FCD2-02-03-64c45bcbe96bd908d3829737cb1e7b13_feb16a68bf048819c84cefcf50417c03.csv
            //FCD2-02-04-ea203f6327ab21fbb783cda38805ef29_9d4eee68292842907722e73b1474d823.csv
            let rawData = csv;

            var data = [];
            for(let i of rawData){
                //获取想要的属性值
                //let newvar = (({caller, callee}) => ({caller, callee}))(i); 
                let newvar =  {};
                newvar.caller = i.source;
                newvar.callee = i.target;
                data.push(newvar);
            }

            //数据整合
            var callers = new Set();  //y轴
            var callees = new Set();  //x轴
            var callPair =  new Map();

            var xBias = 0; //x,y偏移量
            var yBias = 0;
            for(let i=0; i<data.length; i++){
                callers.add(data[i].caller);
                callees.add(data[i].callee);

                let key =  data[i].caller + "-" + data[i].callee;
                if(callPair.has(key)){
                    let value = callPair.get(key);
                    value++;
                    callPair.set(key, value);
                }else{
                    callPair.set(key, 1);
                }
                if(xBias < data[i].callee.length) xBias = data[i].callee.length;
                if(yBias < data[i].caller.length) yBias = data[i].caller.length;
            }

            //转为数组
            callers = Array.from(callers);
            callees = Array.from(callees);
            callPair = Array.from(callPair);

            //根据数量定义宽度
            var h = callers.length * width;
            var w = callees.length * width;

            //处理方块颜色
            var maxValue = 0;
            for(var item of callPair){
                if(maxValue < item[1]) maxValue = item[1];
            }
            var color = d3.scaleSequential([-4,8, maxValue + 3], d3.interpolateBlues);


            //比例尺
            var xScale = d3.scaleBand()
                            .domain(d3.range(callees.length))
                            .range([padding, w]);

            var yScale = d3.scaleBand()
                            .domain(d3.range(callers.length))
                            .range([0, h]);

            // console.log(xScale.bandwidth());
            // console.log(yScale.bandwidth());

            //生成svg
            var svg = d3.select(place)
                    .append("svg")
                    .attr("width", 3000)
                    .attr("height", 820)
                    // .attr("transform", "translate(-120, -50)");
            var tmpg = svg.append('g')
            var innerg=tmpg.append('g')
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
            //x轴
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + 4.5 * yBias +"," + 6.5 * xBias + ")rotate(-90)")
                .call(d3.axisRight(xScale)) //不用axisTop因为字符会居中 用axisRight然后旋转
                .selectAll("text")
                .data(callees)
                .each(function(d, i){
                    d3.select(this)
                      .text(d)
                      .attr("transform", "rotate(40)");
                });

            //y轴
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + 7 * yBias +"," + 7 * xBias + ")")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .data(callers)
                .each(function(d, i){
                    d3.select(this)
                        .text(d);
                });

            //填充背景
            var empty = new Array(callees.length * callers.length);
            var count = 0;
            svg.append("g")
                .attr("transform", "translate(" +  5 * yBias +"," + 7 * xBias + ")")
                .selectAll("rect")
                .data(empty)
                .enter()
                .append("rect")
                .attr("x", function(d, i){
                    let x = i % callees.length;
                    return xScale(x);
                })
                .attr("y", function(d,i){
                    let y = Math.floor(i / callees.length) ;
                    return yScale(y);
                })
                .attr("width", xScale.bandwidth() * 0.9) // 缩小一点
                .attr("height", yScale.bandwidth() * 0.9)
                .attr("fill", "#F6F6F6");

            //填充正方形
            var Xindex = 0;
            var Yindex = 0;
            svg.append("g")
                .attr("transform", "translate(" +  5 * yBias +"," + 7 * xBias + ")")
                .selectAll("rect")
                .data(callPair)
                .enter()
                .append("rect")
                .attr("x", function(d){
                    let arr = d[0].split("-");

                    for(let i=0; i<callees.length; i++){
                        if(arr[1] == callees[i]){
                            Xindex = i;
                            break;
                        }
                    }
                    return xScale(Xindex);
                })
                .attr("y", function(d){
                    let arr = d[0].split("-");

                    for(let i=0 ; i<callers.length; i++){
                        if(arr[0] == callers[i]){
                            Yindex = i;
                            break;
                        }
                    }
                    return yScale(Yindex);
                })
                .attr("width", xScale.bandwidth() * 0.9) // 缩小一点
                .attr("height", yScale.bandwidth() * 0.9)
                .attr("fill",(d,i) => {
                    return color(d[1])});

}