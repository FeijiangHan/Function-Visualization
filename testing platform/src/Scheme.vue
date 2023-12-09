<template>

<div>
    <div id="draw"></div>
    <div id="legend"></div>
</div>
</template>

<script>
import create_graph from  "../assets/draw/graph.js";
import create_hierarchyGraph from '../assets/draw/hierarchyGraph.js'
import create_hierarchyMatrix from '../assets/draw/hierarchyMatrix.js'
import create_gridTree from '../assets/draw/gridTreeNew.js';
import create_msv from '../assets/draw/msv.js'
import create_icicle from '../assets/draw/icicle.js'
import create_matrix from '../assets/draw/matrix.js'
import create_hierarchyTree from '../assets/draw/hierarchyTree.js'


import * as d3 from 'd3'
import * as d3v5 from 'd3v5'
import axios from 'axios'
import {fitin} from '@/assets/compute.js'
export default {
    name: 'Scheme',
    props:{
        scheme: String,
        data: String,
        count: Number,
        isstart:Boolean,
        countdown:Number,
    },
    data(){      
        return {
            mask:false,
            end:0,
            timer:null,
            pathPre:"../../static/pilot/",
            files:[],
        }
    },
    filters:{
        formatTime(val){
            let totalTime=val;
            let min = parseInt(totalTime/60) > 10 ? parseInt(totalTime/60) : '0' + parseInt(totalTime/60) // 计算整数分
            let afterMin = parseInt(totalTime - min*60) // 取得算出分后剩余的秒数
            // //console.log(min,afterMin);
            let sec = parseInt(afterMin) >= 10 ? parseInt(afterMin) : '0' + parseInt(afterMin) // 计算整数秒
            let lastTime = min + ':' + sec;
            // //console.log(lastTime)
            return lastTime;
        }
    },
    methods:{
        startTimer(){
            this.timer=setInterval(this.mytimer,1000)
        },
        mytimer(){
            this.end--;
            if(this.end<=0){
                //this.mask=true;
                clearInterval(this.timer);
            }
        },
        draw(val){
            // val---this.data
            if(this.dataMap.get(this.scheme)!=2)
            {
                var dataType=this.dataMap.get(this.scheme)?".csv":".json";
                var filename=this.pathPre+"UD1-0"+val+dataType;
                // var filename=this.pathPre+"20220712-tutorial-design schema_eg3-v2"+dataType;
                var d3type=this.d3Map.get(this.scheme)?d3v5:d3;
                axios.get(filename)
                    .then(res => {
                        var data;
                        if(this.dataMap.get(this.scheme)==1){
                            //1---csv
                            data =this.csvPar.csvParse(res.data)
                        }
                        else{
                            //0---json
                            data= res.data;
                        }
                        let func=this.drawMap.get(this.scheme);
                        //d3用哪个版本
                        //console.log(this.scheme,this.d3Map.get(this.scheme)?5:3)
                        func(d3type,data,"#draw");
                        //console.log("scheme:",this.scheme,"func:",func)
                        if(this.scheme!== "graph"){
                            fitin("#draw")
                        }
                        
                });
            }else{
                let csv=this.pathPre+"UD1-0"+val+'.csv';
                let json=this.pathPre+"UD1-0"+val+'.json';
                let d3type=this.d3Map.get(this.scheme)?d3v5:d3;
                let dataCsv;
                let dataJson;
                axios.get(csv)
                    .then(res => {
                        dataCsv =this.csvPar.csvParse(res.data)
                        axios.get(json)
                    .then(res => {
                            dataJson =res.data;
                            let func=this.drawMap.get(this.scheme);
                            //console.log(this.scheme)
                            //d3用哪个版本
                            //console.log(this.scheme,this.d3Map.get(this.scheme)?5:3)
                            // console.log("datacsv",dataCsv)
                            func(d3type,dataJson,dataCsv,"#draw");
                            //console.log("scheme:",this.scheme,"func:",func)
                            fitin("#draw") // fitin函数是自适应函数，用于自动调整图表大小
                        });
                    })
            }
            document.getElementById("legend").innerHTML=this.legendMap.get(this.scheme)?this.legendMap.get(this.scheme):''
            // console.log("scheme:",this.scheme,this.legendMap.get(this.scheme))
            let g=document.getElementById("legend").querySelectorAll('.tick')
            g=Array.from(g)
            for(let i=0;i<g.length;i++){
                let tick=g[i]
                tick.querySelector("text").innerHTML=new Number(tick.querySelector("text").innerHTML)
            }
        },
        Legend(c,title,d3=d3v5) {
            const fontc='#555';
            function ramp(c,) {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = 1;
                const context = canvas.getContext("2d");
                // for (let i = 0; i < n; ++i) {
                // context.fillStyle = color(i / (n - 1));
                // context.fillRect(i, 0, 1, 1);
                // }
                //创建渐变对象
                var gr = context.createLinearGradient(0, 0, width, 0);
                //颜色断点
                //['#e6f0fa','#8dc0dd','#08306b']
                gr.addColorStop(0, c[0]);
                gr.addColorStop(.5, c[1]);
                gr.addColorStop(1, c[2]);
                //设置渐变
                context.fillStyle = gr;
                //绘制矩形
                context.fillRect(0, 0, width, 100);
                return canvas;
            }
            var tickSize = 6,
                width = 100, 
                height = 44 + tickSize,
                marginTop = 18,
                marginRight = 0,
                marginBottom = 16 + tickSize,
                marginLeft = 0;
            // c=['#e6f0fa','#8dc0dd','#08306b']
            var svg =  d3.create("svg")
                        .attr("width", width+20)
                        .attr("height", height)
                        .attr("viewBox", [0, 0, width, height])
                        .style("overflow", "visible")
                        .style("display", "block");
            svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(c).toDataURL());

            // console.log(ticks,tickValues,tickSize,tickAdjust)
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(g => g.append("text")
                    .attr("x", 0)
                    .attr("y", height-36)
                    .attr("fill", fontc)
                    .attr("text-anchor", "start")
                    .attr("font-size", "12px")
                    .attr("class", "title")
                    .text(title))
                .call(g => g.append("text")
                    .attr("x", 0)
                    .attr("y", -16)
                    .attr("fill", fontc)
                    .attr("text-anchor", "start")
                    .attr("font-size", "12px")
                    .attr("class", "title")
                    .text("Small"))
                .call(g => g.append("text")
                .attr("x", width)
                .attr("y", -16)
                .attr("fill", fontc)
                .attr("text-anchor", "end")
                .attr("font-size", "12px")
                .attr("class", "title")
                .text("Large"));
            // console.log(svg.node(),typeof svg.node())
            return svg.node();
        },
        dxLegend(c,title,d3=d3v5){
            const cellWidth = 110;
            const cellHeight = 40;
            const fontc='#555'
            var svg =  d3.create("svg")
                        .attr("width", cellWidth+10)
                        .attr("height", 40)
                        .attr("viewBox", [0, 0,100, 40])
                        .style("display", "block");
            svg.append("g")
                .call(g => g.append("text")
                    .attr("x", 0)
                    .attr("y", 36)
                    .attr("fill", fontc)
                    .attr("text-anchor", "start")
                    .attr("font-size", "12px")
                    .attr("class", "title")
                    .text(title))
                .call(g => g.append("text")
                    .attr("x", 0)
                    .attr("y", 12)
                    .attr("fill", fontc)
                    .attr("text-anchor", "start")
                    .attr("font-size", "12px")
                    .attr("class", "title")
                    .text("Low"))
                .call(g => g.append("text")
                .attr("x", cellWidth-10)
                .attr("y", 12)
                .attr("fill", fontc)
                .attr("text-anchor", "end")
                .attr("font-size", "12px")
                .attr("class", "title")
                .text("High"));
            svg.append("g")
                .append("polygon")
                .attr("points",`0,${(cellHeight-2)/2} 0,${(cellHeight-2)/2+2} ${cellWidth-10},${(cellHeight-6)/2+6} ${cellWidth-10},${(cellHeight-6)/2}`)
                .style("fill",c)
            return svg.node().outerHTML;
        }
    },
    computed:{
        drawMap(){
            var schList =["graph", "hierarchyGraph", "hierarchyMatrix", "hierarchyTree", "icicle", "matrix", "msv", "gridTree"]
            var funcList=[create_graph, create_hierarchyGraph, create_hierarchyMatrix, create_hierarchyTree, create_icicle, create_matrix, create_msv, create_gridTree];
            var map=new Map(); 
            for(let i=0;i<schList.length;i++){
                map.set(schList[i],funcList[i])
            }
            //console.log("map",map)
            return map;
        },
        dataMap(){
            var schList =["graph", "hierarchyGraph", "hierarchyMatrix", "hierarchyTree", "icicle", "matrix", "msv", "gridTree"]
            var datatype=[1,0,0,2,0,1,1,0];
            var map=new Map();
            for(var i=0;i<schList.length;i++){
                map.set(schList[i],datatype[i])
            } 
            return map;
        },
        d3Map(){
            var schList =["graph", "hierarchyGraph", "hierarchyMatrix", "hierarchyTree", "icicle", "matrix", "msv", "gridTree"]
            var datatype=[1,1,1,0,1,1,0,1];
            var map=new Map();
            for(var i=0;i<schList.length;i++){
                map.set(schList[i],datatype[i])
            } 
            return map;
        },
        csvPar(){
            return require('d3-dsv')
        },
        legendMap:function(){
            let schList =["graph", "hierarchyGraph", "hierarchyMatrix", "hierarchyTree", "icicle", "matrix", "msv", "gridTree"]
            let colors=this.Legend(['#fddbaf','#f98759','#b80d08'],"Index of First Call").outerHTML
            let blue=this.Legend(['#e6f0fa','#8dc0dd','#08306b'],"Frequency").outerHTML
            
            let dxc=this.dxLegend('#fddbaf','Call Frequency');
            let dx=this.dxLegend('#aaa','Call Frequency');
            let legends=[dxc+colors,dx,blue,dx,blue,blue,'',''];
            var map=new Map();
            for(var i=0;i<schList.length;i++){
                map.set(schList[i],legends[i])
            } 
            return map;
        },
    },
    watch:{
        count:{
            immediate:true,
            handler:function(val){
                if(val){
                    clearInterval(this.timer);
                    this.end=this.countdown;
                    //this.mask=false;
                    // console.log("draw 1")
                    this.draw(this.data)
                    //console.log("draw:",this.data);
                    // console.log("mask",this.mask)
                    this.startTimer();
                }
            }
        },
        isstart:{
            handler:function(val){
                if(val){
                    clearInterval(this.timer);
                    this.end=this.countdown;
                    this.mask=false;
                    // console.log("mask",this.mask)
                    this.startTimer();
                }
            }
        },
        // data:{
        //     handler:function(val){
        //         this.mask=false;
        //         console.log("draw new")
        //         this.draw(val)
        //     }
        // },
        // scheme:{
        //     // immediate:true,
        //     handler:function(val){
        //         //console.log("111")
        //         this.mask=false;
        //         console.log("draw new")
        //         this.draw(this.data)
        //     }
        // }
    },
    created(){
        //console.log("created");
        // //console.log(this.drawMap);
    },
    mounted(){
        //console.log('mounted');
        this.draw(this.data)
        // //console.log(document.querySelector("div").innerHTML)
        // create_hierarchyGraph(d3,filename,"#draw");
    }
}
</script>

<style>
    .el-scrollbar{
        height:100%;
    }
    .default-scrollbar__wrap {
    overflow-x: hidden;
  }
  #mask{
    height: 100vh;
    display:flex ;
    align-items:center; 
    justify-content:center ; 
    font-size: 30px;
    color: #aaa;
  }
  #timer{
    position: absolute;
    width: 200px;
    height: 100px;
    font-size: 30px;
    color:#aaa;
    top:0;
    right:0;
    display:flex ;
    align-items:center; 
    justify-content:center ; 
    z-index:99;
  }
  #draw{
      width:calc(75vw - 60px);
      height:100vh;
      overflow: hidden;
      display: block;
  }
  #draw svg{
      transform-origin: 0 0;
  }
    
    #legend{
         background-color: rgba(255,255,255,0.6);
      z-index:100;
        position: absolute;
        bottom: 10px;
        right: 20px;
    }
</style>