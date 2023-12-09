<template>
<div>
    <div class = "four">
        <!-- 循环生成绘图板 -->
        <div v-for="(item, index) in draw_callName[taskIndex-7]"
            :class="(taskIndex == 8 || taskIndex == 9) && (scheme == 'hierarchyMatrix' || scheme == 'hierarchyTree' || hierarchyTree == 'icicle') ? 'for_div1' : for_div23"
            :key="index">
            <div class="div4" style="border-bottom: 1px solid grey; border-left: 1px solid grey; border-top: 1px solid grey; border-right: 1px solid grey; "> 
                    <!-- 图片编号 -->
                    <el-tag
                    class ="tag1"
                    effect="plain"
                    type="info"
                    size="medium">
                    {{taskIndex-6}}-{{index+1}}
                    </el-tag>
                    <!-- 提示用户分类到哪个家族 -->
                    <el-tag
                    class="tag2"
                    effect="plain"
                    type="info"
                    size="medium">
                    {{family_message[index]}}
                    </el-tag>
                    <!-- 在此处添加按钮点击后禁用或染色 -->
                    <el-button  class="right-btn1"  @click="send_add(index)"> 标记 </el-button> 
                    <el-button  class="right-btn2"  type="small" icon="el-icon-delete"  @click="send_remove(index)"></el-button>        
                    <div :id="item"></div>
            </div>      
        </div>
    </div>
</div>
</template>


<script>
import Vue from 'vue'
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
    name:"FourSch",
    props:{
        scheme:String,
        data:String,
        count: Number,
        taskIndex: Number,
        family: String,
    },
    data(){      
        return {
            mask:false,
            end:120,
            timer:null,
            pathPre:"../../static/pilot2/UD2-0",
            files:[],
            taskIndex: -1,
            draw_callName:[
                // 1 2 3 4 6 10
                ['draw2', 'draw5', 'draw6', 'draw1', 'draw7', 'draw4', 'draw8', 'draw10', 'draw9', 'draw3'],
                // F2: 3 4 11 12 13 15; F3: 2 5 6 7 9
                ['draw14', 'draw10', 'draw6', 'draw5', 'draw7', 'draw9', 'draw8', 'draw13', 'draw11', 'draw12', 'draw3', 'draw4', 'draw1', 'draw15', 'draw2'],
                // F4: 1,2,6,12,21,23 F4-1/2: 4,5,7,11,14,15,20,22
                ['draw11', 'draw10', 'draw3', 'draw19', 'draw20', 'draw13', 'draw16', 'draw23', 'draw4', 'draw25', 'draw18', 'draw12', 'draw6', 'draw21', 'draw2', 'draw24', 'draw8', 'draw9', 'draw22', 'draw17', 'draw14', 'draw15', 'draw1', 'draw5', 'draw7'],
                // F5: 5,8,10,12,15,18,20,21,22,23,30,32; F5-1/2: 2,7,11,17,19,24,34
                ['draw33', 'draw15', 'draw21', 'draw31', 'draw2', 'draw40', 'draw17', 'draw12', 'draw20', 'draw3', 'draw14', 'draw9', 'draw34', 'draw22', 'draw7', 'draw29', 'draw19', 'draw5', 'draw18', 'draw1', 'draw10', 'draw6', 'draw11', 'draw16', 'draw28', 'draw27', 'draw23', 'draw36', 'draw37', 'draw4', 'draw38', 'draw8', 'draw32', 'draw13', 'draw35', 'draw25', 'draw30', 'draw24', 'draw39', 'draw26']
            ],
            draw_callName_sorted:[
                ['draw1', 'draw2', 'draw3', 'draw4', 'draw5', 'draw6', 'draw7', 'draw8', 'draw9', 'draw10'],
                ['draw1', 'draw2', 'draw3', 'draw4', 'draw5', 'draw6', 'draw7', 'draw8', 'draw9', 'draw10', 'draw11', 'draw12', 'draw13', 'draw14', 'draw15'],
                ['draw1', 'draw2', 'draw3', 'draw4', 'draw5', 'draw6', 'draw7', 'draw8', 'draw9', 'draw10', 'draw11', 'draw12', 'draw13', 'draw14', 'draw15', 'draw16', 'draw17', 'draw18', 'draw19', 'draw20', 'draw21', 'draw22', 'draw23', 'draw24', 'draw25'],
                ['draw1', 'draw2', 'draw3', 'draw4', 'draw5', 'draw6', 'draw7', 'draw8', 'draw9', 'draw10', 'draw11', 'draw12', 'draw13', 'draw14', 'draw15', 'draw16', 'draw17', 'draw18', 'draw19', 'draw20', 'draw21', 'draw22', 'draw23', 'draw24', 'draw25', 'draw26', 'draw27', 'draw28', 'draw29', 'draw30', 'draw31', 'draw32', 'draw33', 'draw34', 'draw35', 'draw36', 'draw37', 'draw38', 'draw39', 'draw40']
            ],
            family_message:['未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类'],
            //disable: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            drawType: true, // 默认上下两格
            for_div23: 'for_div2',
        }
    },
    methods:{
    send_add: function(index)
    {
        if (this.family == "9999")
        {
            this.$message("请选择家族！");
            return;
        }
        if (this.family_message[index] == '未归类')
        {
            this.$emit('add_family',index);
            let newValue = "已归类到： " + this.familyMap.get(this.family);
            Vue.set(this.family_message,index,newValue); // Vue同步显示
        }
        else
        {
            this.$message("此图已分类，请取消先前的分类！");
        }

    },
    send_remove: function(index)
    {
        if (this.family == "9999")
        {
            this.$message("请选择家族！");
            return;
        }
        if (this.family_message[index] != '未归类' && this.family_message[index] == "已归类到： " + this.familyMap.get(this.family))
        {
            this.$emit('remove_family',index);
            Vue.set(this.family_message,index,'未归类');
        }
        else
        {
            this.$message("删除失败！");
        }

    },
    startTimer(){
        this.timer=setInterval(this.mytimer,1000)
    },
    mytimer(){
        this.end--;
        if(this.end<=0){
            this.mask=true;
            clearInterval(this.timer);
        }
    },
    randomSort(arr){
            arr.sort(function(a,b){
                return Math.random() - 0.5;
            });
            return arr;
        },
    Legend(c,title,d3=d3v5) {
            const fontc='#555';
            function ramp(c,) {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = 1;
                const context = canvas.getContext("2d");
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
            .attr("preserveAspectRatio", "none") // preserveAspectRatio：图片的纵横比
            .attr("xlink:href", ramp(c).toDataURL()); // xlink:href用来设置图片的路径

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

            return svg.node().outerHTML;
        },
    draw(val){ // val为数据编号，和默认路径一起构成文件路径
        // 例子
        //var arr = this.randomSort([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]);
        var dataType=this.dataMap.get(this.scheme)?".csv":".json";
        var temp = "";
        if (this.taskIndex == 7)
        {
            temp = '1';
        } 
        else if (this.taskIndex == 8)
        {
            temp = '2';
        } 
        else if (this.taskIndex == 9)
        {
            temp = '3';
        }
        else if (this.taskIndex == 10)
        {
            temp = '4';
        } 

        var filename=this.pathPre + temp;
        var d3type=this.d3Map.get(this.scheme)?d3v5:d3;
        if(this.dataMap.get(this.scheme)!=2){
            for (let k = 1; k <= this.numberMap.get(this.taskIndex); k++){
                let finall_name = "";
                if (k <= 9)
                    finall_name = filename+'-0'+k+dataType;
                else
                    finall_name = filename+'-'+k+dataType;
            console.log(finall_name)
            axios.get(finall_name)
                .then(res => {
                    var data;
                    if(this.dataMap.get(this.scheme)){
                        //1---csv
                        data =this.csvPar.csvParse(res.data)
                    }else{
                        //0---json
                        data= res.data;
                    }
                    let func=this.drawMap.get(this.scheme);
                    //d3用哪个版本
                    func(d3type,data,"#draw"+k);
                    if(this.scheme !== "graph"){
                        fitin("#draw"+k); // fitin是一个函数，用来调整图表的大小
                        if(this.scheme=="gridTree"){
                            var svg=d3.select("#draw"+k).select("svg").select("g").select("g");
                            svg.attr("transform",'translate(30,0)');
                        }
                    }
                    else{
                        var svg=d3.select("#draw"+k).select("svg").select("g");
                        svg.attr("transform",'translate(-100,-80)');
                    }
                });
            }
        }
        else
        {
            let d3type=this.d3Map.get(this.scheme)?d3v5:d3;
            let dataCsv;
            let dataJson;

            for (let k = 1; k <= this.numberMap.get(this.taskIndex); k++)
            {
                let csv ="", json = "";
                if (k <= 9)
                {
                    csv=filename+'-0'+k+".csv";
                    json=filename+'-0'+k+'.json';
                }
                else
                {
                    csv = filename+'-'+k+".csv";
                    json = filename+'-'+k+".json";
                }
                axios.get(csv)
                .then(res => {
                    dataCsv =this.csvPar.csvParse(res.data)
                    axios.get(json)
                .then(res => {
                        dataJson =res.data;
                        let func=this.drawMap.get(this.scheme);
                        //d3用哪个版本
                        //console.log(this.scheme,this.d3Map.get(this.scheme)?5:3)
                        func(d3type,dataJson,dataCsv,"#draw"+k);
                        //console.log("scheme:",this.scheme,"func:",func)
                        if(this.scheme!== "graph"){
                            fitin("#draw"+k)
                        }
                    });
                })
            }
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
    },
    filters:{
        formatTime(val){
            let totalTime=val;
            let min = parseInt(totalTime/60) > 10 ? parseInt(totalTime/60) : '0' + parseInt(totalTime/60) // 计算整数分
            let afterMin = parseInt(totalTime - min*60) // 取得算出分后剩余的秒数
            // console.log(min,afterMin);
            let sec = parseInt(afterMin) >= 10 ? parseInt(afterMin) : '0' + parseInt(afterMin) // 计算整数秒
            let lastTime = min + ':' + sec;
            // console.log(lastTime)
            return lastTime;
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
        numberMap() // 几道多选题需要绘画的数量
        {
            var taskIndex = [7,8,9,10];
            var number = [10,15,25,40];
            var map = new Map();
            for(var i=0;i<taskIndex.length;i++){
                map.set(taskIndex[i],number[i])
            }
            return map;
        },
        familyMap(){
            var familyIndex = ['1','2','3','4','5','6'];
            var familyname = ['family1','family1变种','family2','family2变种','family3','family3变种'];
            var map = new Map();
            for(var i=0;i<familyIndex.length;i++){
                map.set(familyIndex[i],familyname[i])
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
                    this.end=120;
                    this.mask=false;
                    this.startTimer();
                }
            }
        },
        data:{ // 一组实验变化一次
            handler:function(val){
                this.draw(val)
            }
        },
        scheme:{ // 一个方案变化一次
            handler:function(val){
                this.draw(this.data)
            }
        },
        taskIndex(newv,oldv){
            //console.log("taskIndex:",this.taskIndex);
            //console.log("taskIndex2:",newv,oldv)
            if (this.taskIndex == 7 || this.taskIndex == 10)
            {
                //console.log("this.for_div23 = 'for_div2';")
                this.for_div23 = 'for_div2';
            } 
            else
            {
                //console.log("this.for_div23 = 'for_div3';")
                this.for_div23 = 'for_div3';
            }
            this.family_message = ['未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类'];
        }
    },
    created(){
        //console.log("created")
        document.querySelector(".right-btn1").style.overflow = "auto"
        document.querySelector(".right-btn2").style.overflow = "auto"
        this.taskIndex = taskIndex;
        this.family_message = ['未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类', '未归类'];
    },
    mounted(){
        //console.log("mounted")
        this.draw(this.data)
    }
}
</script>

<style scoped>
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
    div{
		object-fit: initial;
	}
    .four{
        width: 70%;
        height: 100%;
        position: absolute;
        overflow: auto;
    }
    .for_div1{
        /* 左右两格  16、17题 OT和IP、H-HM */
        width: 46%;
        height: 100%;
        float: left;
    }
     .for_div2{
    /* 四宫格 15/18题 */
        width: 48%;
        height: 49%;
        float: left;
     }
     .for_div3{
        /* 上下两格 16、17题 MSV和FCTTree*/ 
        width: 90%;
        height: 50%;
        float: left;
     }
    .div4{
        width:100%;
        height: 100%;
    }
    .div4 p{
        color: #aaa;
    }
    div.el-scrollbar__view{
        height: 49vh;
    }

    .el-scrollbar{
        height:100%;
    }
    .default-scrollbar__wrap {
    overflow-x: hidden;
  }
  .div4 div{
      width: 100%;
      height: 85%;
      overflow: hidden; 
  }
  .right-btn1 {
  margin-left: 30%;
  
  }
  /* .right-btn2 {
  margin-left: 40%;
  }  */
  .tag2
  {
    margin-left: 5%;
  }
#mask{
    height: 100vh;
    display:flex ;
    align-items:center; 
    justify-content:center ; 
    font-size: 30px;
    color: #aaa;
  }
#legend{
      background-color: rgba(255,255,255,0.6);
      z-index:100;
        position: absolute;
        bottom: 10px;
        right: 20px;
    }
</style>