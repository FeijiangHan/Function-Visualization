<template>
<div>
<div id="stopmask" v-show="isstop">
    <div>
        <p>暂停中</p>
        <el-button @click="beginq()">开始答题</el-button>
    </div>
</div>

<div style="height:100%;">
       <!-- 左侧栏 -->
    <div id="progress"> <!-- 上方进度条 -->
        <el-progress :percentage="totalPer" :show-text="false" :stroke-width="6"></el-progress>
    </div>
    <div id="nav" v-if="!lookback">
        <div id="title">
            <h1>{{"Trial " + count +"/18"}}</h1>
            <div v-show="!over">{{"本题用时:" + str}}</div>
            <div v-show="!over">{{"总计用时:" + totalstr}}</div>
        </div>
        <div id="question">
            <div>{{question}}</div>
        </div>

        <el-radio-group v-model="opt2" v-show="taskIndex >= 7">
        <el-radio v-show="!over" v-model="opt2" label="1">家族1</el-radio>
        <el-radio v-show="!over" v-model="opt2" label="2">家族1变种</el-radio>
        <el-radio v-show="!over" v-model="opt2" label="3">家族2</el-radio>
        <el-radio v-show="!over" v-model="opt2" label="4">家族2变种</el-radio>
        <!-- <el-radio v-show="false" v-model="opt2" label="5">家族3</el-radio>
        <el-radio v-show="false" v-model="opt2" label="6">家族3变种</el-radio> -->
        </el-radio-group>
        <br v-show="taskIndex >= 7">
        <h4 v-show="!over && taskIndex >= 7"> 您对本答案的确信程度为：{{certaintyValue == -1 ? '?' : certaintyValue}}</h4>
        <el-rate
        v-show="!over && taskIndex >= 7"
        v-model="certaintyValue"
        :texts="scores"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        show-text>
        </el-rate>

        <el-radio-group v-model="opt" class="choices">
        <el-radio v-show="!over && taskIndex < 7"
        v-for="(item, index) in answer"
        :key="index"
        :label="index"
        v-model="opt">
            {{item}}
        <!-- <el-input v-if="index == 0" v-model="input1" :disabled="input1Able" clearable></el-input> -->
        <!-- <el-input v-if="index == 1" v-model="input2" :disabled="input2Able" clearable></el-input> -->
        </el-radio>    
                
        </el-radio-group>
        <div v-show="!over && taskIndex >= 7" class="four_family">
            <h5 class="family_name"> 家族1 </h5>
            <div class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">          
                <div>{{family1}}</div>
            </div> 
            <h5  v-show="!over" class="family_name"> 家族1变种 </h5>
            <div v-show="!over" class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">    
                <div>{{family2}}</div>
            </div> 
            <h5 v-show="!over" class="family_name"> 家族2 </h5>
            <div v-show="!over" class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">            
                <div>{{family3}}</div>
            </div> 
            <h5 v-show="!over" class="family_name"> 家族2变种 </h5>
            <div v-show="!over" class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">             
                <div>{{family4}}</div>
            </div> 
            <h5 v-show="false" class="family_name"> 家族3 </h5>
            <div v-show="false" class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">            
                <div>{{family5}}</div>
            </div> 
            <h5 v-show="false" class="family_name"> 家族3变种 </h5>
            <div v-show="false" class="selected_message" style=" border-bottom:solid 1px gray; border-left:solid 1px gray; border-right:solid 1px gray; border-top:solid 1px gray">             
                <div>{{family6}}</div>
            </div> 
        </div>

        <!-- 确信度评分 -->
        <h4 v-show="!over && taskIndex < 7"> 您对本答案的确信程度为：{{certaintyValue == -1 ? '?' : certaintyValue}}</h4>
        <el-rate
        v-show="!over && taskIndex < 7"
        v-model="certaintyValue"
        :texts="scores"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        show-text>
        </el-rate>

        <!-- 下一题按钮 -->
        <el-button @click="next()" :disabled="over" v-show="!over">下一步</el-button>
        <!-- 下一题按钮 -->
        
        <!-- <el-button @click="retNext()" :disabled="count>=totalCount-1" v-show="over">回看下一步</el-button> -->
        <el-button @click="lookback=true" v-show="false">回看</el-button>
        <el-link href="https://www.wjx.cn/vm/te39L2Z.aspx" type="primary" v-show="false" target="_blank">前往问卷</el-link>

    </div> 
    <el-scrollbar id='lookback' v-if="lookback" >
        <el-link href="https://www.wjx.cn/vm/te39L2Z.aspx" type="primary" target="_blank">前往问卷</el-link>
		<el-table
            :data="retStack"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%; overflow: auto">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
            property="name"
            label="方案"
            width="140">
            </el-table-column>
            <el-table-column
            property="question"
            label="问题"
            width="200">
            </el-table-column>
        </el-table>
	</el-scrollbar>


    
    <!-- 右侧的图片展示 -->
    <div id="scheme">
        <Scheme v-if="taskIndex < 7" :scheme= "scheme" :data ="FCDdata" :count="count" :isstart="isstart" :countdown="down"></Scheme>
        <FourSch v-if="taskIndex >= 7" :scheme = "scheme" :data="FCDdata" :count="count" :taskIndex="taskIndex" :family="opt2 != -1 ? opt2 : '9999'" v-on:add_family="add_family" v-on:remove_family="remove_family"></FourSch>
        <!--<FourSch v-if="taskNum < 8" :scheme = "scheme" :data="FCDdata" :count="count" ></FourSch>-->
    </div>
</div>
</div>
</template>


<script>

import {taskList, schList, queList, queList2, ansList, countdown} from '@/assets/questions.js'
import {shuffle,timeFormat} from '@/assets/methods.js'
import {downloadXlsx} from "@/utils/xlsx.js"
import Scheme from './Scheme.vue'
import FourSch from './FourSch.vue'


export default{
    //name: 'nav',
    components:{
    Scheme,
    FourSch
},
    data(){      
        return {
            //每一组题目的第一题
            firstaccur:true,
            isstop:false,
            stop:10,
            lookback:false,
            countdown:[],
            down:0,
            isstart:false,
            totalCount:0,
            reset:false,
            count:1,
            status:0, //切换问题0/方案1/任务2
            scheme:"", //方案
            FCDdata:"",
            taskList:[], //任务的标号列表 初始化随机后就按照随即顺序出题
            schList:[], //所有方案名称数组
            queList:[], //所有任务对应问题 2维数组
            queList2:[],
            currentQue :[], //当前任务对应问题 1维数组
            ansList:[],
            taskIndex:0, //当前任务下标
            schIndex:0, //当前方案下标
            queIndex:1, //当前问题下标(减一是问题的标号)
            taskNum:"",
            queNum:"", //当前问题标号
            question:"", //问题
            opt:-1, //选择的选项          
            opt2: -1,  
            optList:[], //记录每个问题的选择
            optTime:[] ,//记录每个问题的时间, 
            curAnswer:[],
            curTime:[],
            // input1:"", //输入框的输入内容
            // input2:"",
            // input1Able :true, //是否能输入
            // input2Able:true,
            over:false, //判断答题是否结束
            begin:false,
            //计时
            totalstr:"",
            str:"",
            totalTime:0,
            totalTimer:null,
            time:0,
            h:0,
            m:0,
            s:0,
            ms:0,
            retStack:[],//queIndex,schIndex,taskIndex
            //回看列表
            currentAns :[], //当前任务对应答案 2维数组
            ansIndex:0, //当前答案下标
			answer:[] ,//答案 一维数组
            family1:"", //家族1
            family2:"", //家族1变种
            family3:"", //家族2
            family4:"", //家族2变种
            family5:"",
            family6:"",
            ansStr:"",
            certaintyValue: -1,
            scores: [],
            problem_certaintyValue:[],
        }
    },
    //初始化
    created(){
        this.scores = ['1', '2', '3', '4', '5'];
        this.countdown=countdown;
        this.taskList = taskList;
        this.schList = [this.$route.query.method];
        this.queList = queList;
        this.queList2 = queList2;
        this.ansList = ansList;
        this.taskNum = this.taskList[0];
        this.currentQue = this.queList[this.taskNum-1];
        this.queNum = this.currentQue[this.queIndex-1];
        this.question = this.currentQue[this.queIndex];
        this.scheme = this.schList[0];
        this.down = this.countdown[this.taskNum-1]+10;

        this.ansList = ansList;
        this.currentAns = this.ansList[this.taskNum-1]; // 一组答案（2个）
        this.answer = this.currentAns[this.ansIndex]; // 答案描述
        //开始前询问
        this.$alert("若准备好请点击确定按钮，点击后将会开启计时。推荐使用Google浏览器", "是否准备好开始答题",{
            confirmButtonText : "准备好了",
            callback :()=>{
                this.isstart=true;
                this.timerStart(true);
                this.totalTimer= setInterval(()=>{5
                    this.totalTime+=1;
                    this.totalstr=timeFormat(this.totalTime);
                }, 1000);
            }
        })
        // if(this.taskNum <= 7){
        //     this.FCDdata = String(this.taskNum);                    
        // }else if (this.taskNum == "8"){
        //     this.FCDdata = "1";
        // }else if (this.taskNum == "9"){
        //     this.FCDdata = "2";
        // }else if (this.taskNum == "10"){
        //     this.FCDdata = "3";
        // }else if (this.taskNum == "11"){
        //     this.FCDdata = "4";
        // }
        this.FCDdata = String(this.taskNum); 

        for(let i = 0; i < 11; i++){ // 7个单选任务+4个多选任务
            this.optList[i] = []
            this.optTime[i] = [];
        }
    },
    watch:{
        count(newv,oldv)
        {
            this.certaintyValue = -1;
        }
    },
    methods:{
        add_family(index)
        {
            this.ans_str = "";  //清空答案
            var tempStr = (this.taskIndex-6) + "-" + (index+1); 
            this.ans_str +=  "、"+tempStr;
            if (this.opt2 == 1)
            {
                if(this.family1.search(tempStr) == -1)
                {
                    if (this.family1 == "")
                    {
                        this.family1 += tempStr;
                    } else{
                        this.family1 += this.ans_str;
                    }
                }
            }
            else if (this.opt2 == 2)
            {
                if(this.family2.search(tempStr) == -1)
                {
                    if (this.family2 == "")
                    {
                        this.family2 += tempStr;
                    } else{
                        this.family2 += this.ans_str;
                    }
                }
            }
            else if (this.opt2 == 3)
            {
                if(this.family3.search(tempStr) == -1)
                {
                    if (this.family3 == "")
                    {
                        this.family3 += tempStr;
                    } else{
                        this.family3 += this.ans_str;
                    }
                }
            }
            else if (this.opt2 == 4)
            {
                if(this.family4.search(tempStr) == -1)
                {
                    if (this.family4 == "")
                    {
                        this.family4 += tempStr;
                    } else{
                        this.family4 += this.ans_str;
                    }
                }
            }       
            else if (this.opt2 == 5)
            {
                if(this.family5.search(tempStr) == -1)
                {
                    if (this.family5 == "")
                    {
                        this.family5 += tempStr;
                    } else{
                        this.family5 += this.ans_str;
                    }
                }
            }         
            else if (this.opt2 == 6)
            {
                if(this.family6.search(tempStr) == -1)
                {
                    if (this.family6 == "")
                    {
                        this.family6 += tempStr;
                    } else{
                        this.family6 += this.ans_str;
                    }
                }
            }             
        },
        remove_family(index)
        {
            var tempStr = (this.taskIndex-6) + "-" + (index+1); 
            if (this.opt2 == 1)
            {
                if(this.family1.search(tempStr+"、") != -1)
                {
                    let s = this.family1.split(tempStr+"、");
                    this.family1 = s.join('');
                }
                else if(this.family1.search("、"+tempStr) != -1)
                {
                    let s = this.family1.split("、"+tempStr);
                    this.family1 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family1.split(tempStr);
                    this.family1 = s.join('');
                }
            }
            else if (this.opt2 == 2)
            {
                if(this.family2.search(tempStr+"、") != -1)
                {
                    let s = this.family2.split(tempStr+"、");
                    this.family2 = s.join('');
                }
                else if(this.family2.search("、"+tempStr) != -1)
                {
                    let s = this.family2.split("、"+tempStr);
                    this.family2 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family2.split(tempStr);
                    this.family2 = s.join('');
                }
            }
            else if (this.opt2 == 3)
            {
                if(this.family3.search("、"+tempStr) != -1)
                {
                    let s = this.family3.split(tempStr+"、");
                    this.family3 = s.join('');
                }
                else if(this.family3.search("、"+tempStr) != -1)
                {
                    let s = this.family3.split("、"+tempStr);
                    this.family3 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family3.split(tempStr);
                    this.family3 = s.join('');
                }
            }
            else if (this.opt2 == 4)
            {
                if(this.family4.search(tempStr+"、") != -1)
                {
                    let s = this.family4.split(tempStr+"、");
                    this.family4 = s.join('');
                }
                else if(this.family4.search("、"+tempStr) != -1)
                {
                    let s = this.family4.split("、"+tempStr);
                    this.family4 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family4.split(tempStr);
                    this.family4 = s.join('');
                }
            }   
            else if (this.opt2 == 5)
            {
                if(this.family5.search(tempStr+"、") != -1)
                {
                    let s = this.family5.split(tempStr+"、");
                    this.family5 = s.join('');
                }
                else if(this.family5.search("、"+tempStr) != -1)
                {
                    let s = this.family5.split("、"+tempStr);
                    this.family5 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family5.split(tempStr);
                    this.family5 = s.join('');
                }
            }  
            else if (this.opt2 == 6)
            {
                if(this.family6.search(tempStr+"、") != -1)
                {
                    let s = this.family6.split(tempStr+"、");
                    this.family6 = s.join('');
                }
                else if(this.family6.search("、"+tempStr) != -1)
                {
                    let s = this.family6.split("、"+tempStr);
                    this.family6 = s.join('');
                }
                else // 删除第一个元素
                {
                    let s = this.family6.split(tempStr);
                    this.family6 = s.join('');
                }
            }             
        },
        select(){
            if(this.opt == 0){
                this.input1Able = false;
            }
            else if(this.opt == 1){
                this.input2Able = false;
            }else{
                this.input1Able = true;
                this.input2Able = true;
            }
        },
        /*
        函数：beginq
        作用：暂停后恢复时赋值变量；时间暂停
        思路：按照下面的逻辑，只有不暂停时才会继续改变变量，暂停时不会进行变量赋值操作
            因此需要beginq函数在恢复暂停后进行变量赋值
        */
        beginq(){
           
            // if (this.taskIndex <= 7)
            // {
            //             this.queIndex = 1;
            //             this.schIndex = 0; 
            //             this.taskNum = this.taskList[this.taskIndex];
            //             this.scheme = this.schList[this.schIndex];
            //             this.status = 0;
            //             this.ansIndex = 0;
            //             this.currentAns = this.ansList[this.taskNum-1];
            //             this.answer = this.currentAns[this.ansIndex];

            //             this.currentQue = this.queList[this.taskNum-1];
            //             this.queNum = this.currentQue[this.queIndex-1];
            //             this.question = this.currentQue[this.queIndex];
            //             this.FCDdata = String(this.taskNum); 

            //             if (this.taskIndex == 7)
            //             {
            //                 this.currentQue = this.queList2[this.taskNum-1];
            //                 this.queNum = this.currentQue[0];
            //                 this.question = this.currentQue[1];
            //             }
            //             if (this.taskIndex == 7)
            //             {
            //                 this.FCDdata = "1"; 
            //             }
            // } 
            // else 
            // {
            //         this.schIndex = 0; 
            //         this.status = 3;
            //         this.taskNum = this.taskList[this.taskIndex];
            //         this.scheme = this.schList[this.schIndex];
            //         this.currentQue = this.queList2[this.taskNum - 1];
            //         this.queNum = this.currentQue[0];
            //         this.question = this.currentQue[1];
            //         this.FCDdata = String(this.taskNum); 
            //         this.family1 = "";
            //         this.family2 = "";
            //         this.family3 = "";
            //         this.family4 = "";
            //         this.family5 = "";
            //         this.family6 = "";                    
            // }

            // this.clearInput();
            // this.count++;
            // let step;
            // if(this.taskIndex < this.taskList.length){
            //     step={
            //         scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
            //     }
            //     this.retStack.push(step);
            // }
            //恢复计时器
            this.timerStart(true);
            this.totalTimer= setInterval(()=>{
                this.totalTime+=1;
                this.totalstr=timeFormat(this.totalTime);
            }, 1000);
            this.$message({
                type: 'info',
                message: '继续作答'
            }); 
            this.isstop=false;
        },
        next(){
            //记录答案和时间
            var saveTime = this.ms + this.s * 1000 + this.m * 60 * 1000 + this.h * 60 * 60 * 1000;

            if(this.taskIndex < 7 && this.opt == -1){
                this.$message("请选择选项");
                return;
            }
            if(this.taskIndex >=7 && (this.family1==""&&this.family2==""&& this.family3==""&& this.family4==""&& this.family5==""&& this.family6=="")){
                this.$message("请选择家族成员");
                return;
            }

            if (this.certaintyValue == -1)
            {
                this.$message("请给此答案的确信程度打分！");
                return;                
            }

            let step;
            if(this.count==1){
                step={
                    scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
                }
                this.retStack.push(step);
            }
        // curAnswer记录一张图片对应的两到题的答案
            if (this.taskIndex < 7)
            {
                this.curAnswer.push(this.answer[this.opt]);
            }
            else{
                if (this.taskIndex == 7)
                {
                    this.curAnswer.push("家族1："+this.family1+"; 家族1变种："+this.family2+"; 家族2："+this.family3+"; 家族2变种："+this.family4);
                }
                else if (this.taskIndex == 8)
                {
                    this.curAnswer.push("家族1："+this.family1+"; 家族1变种："+this.family2+"; 家族2："+this.family3+"; 家族2变种："+this.family4);
                }
                else if (this.taskIndex == 9)
                {
                    this.curAnswer.push("家族1："+this.family1+"; 家族1变种："+this.family2+"; 家族2："+this.family3+"; 家族2变种："+this.family4);
                }
                else if (this.taskIndex == 10)
                {

                    this.curAnswer.push("家族1："+this.family1+"; 家族1变种："+this.family2+"; 家族2："+this.family3+"; 家族2变种："+this.family4+"; 家族3："+this.family5+"; 家族3变种："+this.family6);
                }
            }

            this.curTime.push(saveTime);
            this.timerStart(false);

            // 任务没做完，但是所有方案和问题已经做完了
            if(this.taskIndex < 7 && this.schIndex == this.schList.length - 1 && this.queIndex == this.currentQue.length - 1)
            { 
                this.status = 2;
                this.firstaccur=true;
            }                        
            else if(this.taskIndex < 7 && this.queIndex == this.currentQue.length - 1 && this.schIndex < this.schList.length)
            { //判断当前方案所对问题是否回答完毕
                this.queIndex = -1; //重置问题下标
                this.ansIndex = 0; //重置答案下标
                this.status = 1; //应该切换方案
            } 
            else if(this.taskIndex >= 7 && this.taskIndex < this.taskList.length)
            {
                this.status = 3;
                this.firstaccur=true;
            }
        /*
        status = 0: 初始状态；
        status = 1: 对于当前任务，其中的一个方案回答完所有问题；
        status = 2: 做完一个任务内的所有可视化方案，每个方案两个题
        任务1->方案1->问题1->答案1->问题2->答案2；方案2->问题1->答案1->问题2->答案2.....
        任务2->方案1->问题1->答案1->问题2->答案2；方案2->问题1->答案1->问题2->答案2.....
                            case 0          case 1
        */
        switch(this.status)
        {
            case 0:
                this.queIndex += 2;
                this.queNum = this.currentQue[this.queIndex-1];
                this.question = this.currentQue[this.queIndex];
                this.ansIndex += 1; // 同一个方案下的答案下标加1
                this.answer = this.currentAns[this.ansIndex];
                this.clearInput();
                this.count++;
                this.problem_certaintyValue.push(this.certaintyValue);
                if(this.taskIndex < this.taskList.length){
                    step={
                        scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
                    }
                }                
            break;
            case 1:
                //切换方案+问题
                this.optList[this.taskIndex][this.schIndex] = this.curAnswer;
                this.optTime[this.taskIndex][this.schIndex] = this.curTime;
                this.problem_certaintyValue.push(this.certaintyValue);
                this.curAnswer = [];
                this.curTime = [];
                if(this.firstaccur){
                    this.down-=10;
                    this.firstaccur=false;
                }
                this.schIndex ++;
                this.queIndex += 2; 
                this.scheme = this.schList[this.schIndex];
                this.queNum = this.currentQue[this.queIndex-1];
                this.question = this.currentQue[this.queIndex];
                this.ansIndex = 0;
                this.answer = this.currentAns[this.ansIndex];
                this.status = 0;
                this.clearInput();
                this.count++;

                if(this.taskIndex < this.taskList.length){
                    step={
                        scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
                    }
                    this.retStack.push(step);
                }                
                break;
            case 2:
                this.optList[this.taskIndex][this.schIndex] = this.curAnswer;
                this.optTime[this.taskIndex][this.schIndex] = this.curTime;
                this.problem_certaintyValue.push(this.certaintyValue);
                this.curAnswer = [];
                this.curTime = [];
                this.taskIndex ++;
                this.queIndex = 1;
                this.schIndex = 0; 
                this.taskNum = this.taskList[this.taskIndex];
                this.scheme = this.schList[this.schIndex];
                this.status = 0;
                this.ansIndex = 0;
                this.currentAns = this.ansList[this.taskNum-1];
                this.answer = this.currentAns[this.ansIndex];

                this.currentQue = this.queList[this.taskNum-1];
                this.queNum = this.currentQue[this.queIndex-1];
                this.question = this.currentQue[this.queIndex];
                this.FCDdata = String(this.taskNum); 

                if (this.taskIndex == 7)
                {
                    this.currentQue = this.queList2[this.taskNum-1];
                    this.queNum = this.currentQue[0];
                    this.question = this.currentQue[1];
                }
                if (this.taskIndex == 7)
                {
                    this.FCDdata = "1"; 
                }
                this.count++;
                this.clearInput();

                if(this.taskIndex < this.taskList.length){
                    step={
                        scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
                    }
                    this.retStack.push(step);
                }    

                // 只在7到8的间隙休息
                if (this.taskIndex == 7)
                {
                    this.timerStart(false);
                    
                    this.stop=100;
                    this.isstop=true;         
                    clearInterval(this.totalTimer);
                    this.$confirm('您已完成一组问题内全部方案的作答, 是否暂停休息?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '暂停',
                        type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '继续作答'
                            }); 
                            this.timerStart(false);
                            this.stop=100;
                            this.isstop=true;         
                            clearInterval(this.totalTimer);                            
                            this.beginq();   

                        }).catch(() => {
                            this.timerStart(false);
                            clearInterval(this.totalTimer);
                            this.stop=100;
                            this.isstop=true;
                        });
                }
                break;
            case 3:
                this.optList[this.taskIndex][this.schIndex] = this.curAnswer;
                this.optTime[this.taskIndex][this.schIndex] = this.curTime;
                this.problem_certaintyValue.push(this.certaintyValue);                
                this.curAnswer = [];
                this.curTime = [];

                this.taskIndex ++;

                if(this.taskIndex == this.taskList.length){
                    this.overTask();
                    break;
                }
                    this.schIndex = 0; 
                    this.status = 3;
                    this.taskNum = this.taskList[this.taskIndex];
                    this.scheme = this.schList[this.schIndex];
                    this.currentQue = this.queList2[this.taskNum - 1];
                    this.queNum = this.currentQue[0];
                    this.question = this.currentQue[1];
                    this.count++;
                    this.FCDdata = String(this.taskNum); 
                    this.family1 = "";
                    this.family2 = "";
                    this.family3 = "";
                    this.family4 = "";
                    this.family5 = "";
                    this.family6 = "";                    
                    this.clearInput();

                    if(this.taskIndex < this.taskList.length){
                        step={
                            scheme:this.scheme,name:this.nameMap.get(this.scheme),taskNum:this.taskNum,FCDdata:this.FCDdata,queNum:this.queNum,question:this.question,count:this.count
                        }
                        this.retStack.push(step);
                    }
                break;
        }

        //重启计时
        this.timerStart(true);
        },
        handleCurrentChange(val){
            let step=val;
            // let step=this.retStack[this.count-1];
            this.count=step.count;
            this.scheme=step.scheme;
            this.taskNum=step.taskNum;
            this.FCDdata=step.FCDdata;
            this.queNum=step.queNum;
            this.question=step.question;
            //this.down=3599;
            this.answer=step.answer;
        },
        ret(){
            if(this.count<0){
                this.$message("已到达答题起点");
                return ;
            }
            let step=this.retStack[this.count-1];
            this.scheme=step.scheme;
            this.taskNum=step.taskNum;
            this.FCDdata=step.FCDdata;
            this.queNum=step.queNum;
            this.question=step.question;
            this.answer=step.answer;
            this.count--;
        },
        retNext(){
            this.count++;
            let step=this.retStack[this.count];
            this.scheme=step.scheme;
            this.taskNum=step.taskNum;
            this.FCDdata=step.FCDdata;
            this.queNum=step.queNum;
            this.question=step.question;
            this.answer=step.answer;
        },
        clearInput(){
            this.opt = -1;
            this.opt2 = -1;
        },
        //结束
        overTask(){
                this.totalCount=this.count;
                this.taskNum = "Over";
                this.over=true;
                // this.question= "请选择前往问卷打分或回看"
                this.question= "请下载您的测试结果，谢谢参与！"
                this.answer = [];
                //console.log("retStack:",this.retStack,this.count)
                this.$message("答题完毕");

                let tempTask = []; //临时的当前任务
                let tempScheme = [];
                let dataSet = [["任务-方案-题目", "回答", "确信程度", "用时"]];
                let quei = 1;
                //console.log("optList:",this.optList);
                for(let i = 0; i < this.optList.length; i++){
                    tempTask = this.optList[i];

                    for(let j = 0; j < tempTask.length; j++){
                        tempScheme = tempTask[j];
                        if (i < 7)
                        {
                            let t = 1; // 取问题用，问题分下标为1,3,5,7,9...
                            for(let k = 0; k < tempScheme.length; k++)
                            {
                                dataSet.push(["Q" + quei + "-" + this.schList[j] + "-" + this.queList[i][t], this.optList[i][j][k],  this.problem_certaintyValue[quei-1], this.optTime[i][j][k]]);             
                                quei ++;
                                t += 2;
                            }
                       }
                        else
                        {
                            dataSet.push(["Q" + quei + "-" + this.schList[j] + "-" + this.queList2[i-7][1], this.optList[i][j][0], this.problem_certaintyValue[quei-1], this.optTime[i][j][0]]); 
                            quei ++;
                        }

                    }
                }
                //导出excel
                downloadXlsx(dataSet, this.$route.query.name + "-" + this.$route.query.subject + "-" + this.$route.query.grade + "-" + this.$route.query.method + ".xlsx");
        },

        //控制计时函数
        timerStart(start){
            if(start){
            this.time = setInterval(this.timer, 50);                
            }else{
                this.timerReset();
            }
        },

        timerReset(){
            clearInterval(this.time);
            this.h = 0;
            this.m = 0;
            this.s = 0;
            this.ms = 0;
            this.str = "00:00:00";
        },

        //计时函数
        timer(){
            this.ms = this.ms + 50;
            if(this.ms >= 1000){
                this.ms = 0;
                this.s ++;
            }
            if(this.s >= 60){
                this.s = 0;
                this.m ++;
            }
            if(this.m >= 60){
                this.m = 0;
                this.h ++;
            }
            this.str = this.toDouble(this.h) + ":" + this.toDouble(this.m) + ":" + this.toDouble(this.s);
        },

        //补位数
        toDouble(n){
            if(n < 10) return "0" + n;
            else return "" + n;
        },
        
    },
    computed:{
        totalPer: function () {
            return this.count*100/18;
        },
        nameMap: function(){
            var schList =["hierarchyMatrix", "hierarchyTree", "icicle", "msv", "gridTree"]
            var name=['Matrix with Tree-Like Guide Lines','Orthogonal Tree','Icicle Plot','Massive Sequence View','Function Call Timing Tree'];
            var map=new Map();
            for(var i=0;i<schList.length;i++){
                map.set(schList[i],name[i])
            } 
            return map;
        }
    },
}

</script>

<style>
#nav,#lookback{
    width: 25%;
    /* height: 660px; */
    height: 100vh;
    padding: 30px;
    float: left;
    box-shadow: 10px 0 10px -8px rgba(0, 0, 0, .5);
}
#progress{
    width: calc( 25% + 60px);
    position:absolute;
}
#title div{
    margin-top:5px;
    font-weight: 900;
    color: brown;
    /* display: inline-block; */
}

#question div{
    margin-top: 25px;
    vertical-align: middle;
    line-height: 20px;
    white-space: pre-line;
}
#question div:first-child{
    font-weight: 700;
    font-size: 18px;
    line-height: 32px;
}
#question div:last-child{
    margin-top:20px;
    /* white-space: normal; */
}


.choices, .el-button{
    margin-top:15px;
      margin-bottom: 15px;
}
.choices label{
    width: 100%;
    margin-top:10px;

}
.el-radio__label{
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 25px;
  vertical-align: middle;
  display: inline-block;
}
.el-input{
    margin-top:5px;
    width: 200px;
}
.four_family{
    width:40%;
    height: 100%;
    position: absolute;
}
.selected_message{
    transform: translateX(5%);
    width:50%;
    height: 10%;
}
.family_name{
    transform: translateX(3%);
}

#scheme{
    width:70%;
    height: 710px;
    padding-left: 10px;
    float:left;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
#stopmask{
    z-index: 999;
    position: absolute;
    height: 100vh;
    width: 100vw;
    opacity: 0.8;
    background-color: #fff;
    display:flex ;
    align-items:center; 
    justify-content:center ; 
    font-size: 40px;
    color: #555;
}

</style>