<template>
   <div id="register">
    <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="姓名">
        <el-input v-model="form.name" style="width:220px"></el-input>
    </el-form-item>
    <el-form-item label="年龄">
        <el-input v-model="form.age" style="width:220px"></el-input>
    </el-form-item>

    <el-form-item label="专业">
        <el-select v-model="form.subject" placeholder="请选择专业">
        <el-option label="通信工程" value="通信工程"></el-option>
        <el-option label="计算机科学与技术" value="计算机科学与技术"></el-option>
        <el-option label="数据科学与大数据技术" value="数据科学与大数据技术"></el-option>
        <el-option label="软件工程" value="软件工程"></el-option>
        <el-option label="物联网工程" value="物联网工程"></el-option>
        <el-option label="信息安全" value="信息安全"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择性别">
        <el-option label="女" value="女"></el-option>
        <el-option label="男" value="男"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="年级">
        <el-select v-model="form.grade" placeholder="请选择年级">
        <el-option label="2022级研究生" value="2022级研究生"></el-option>
        <el-option label="2021级研究生" value="2021级研究生"></el-option>
        <el-option label="2020级研究生" value="2020级研究生"></el-option>
        <el-option label="2018级本科生" value="2018级本科生"></el-option>
        <el-option label="2019级本科生" value="2019级本科生"></el-option>
        <el-option label="2020级本科生" value="2020级本科生"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="方案">
        <el-select v-model="form.method" placeholder="请选择方案">
        <el-option label="H-HM" value="hierarchyMatrix"></el-option>
        <el-option label="OT" value="hierarchyTree"></el-option>
        <el-option label="IP" value="icicle"></el-option>
        <el-option label="MSV" value="msv"></el-option>
        <el-option label="FCTTree" value="gridTree"></el-option>
        </el-select>
    </el-form-item>    

    <el-form-item>
        <el-button type="primary" @click="onSubmit">开始答题</el-button>
        <el-button>取消</el-button>
    </el-form-item>
    </el-form>
    <!-- <a :href="baseUrl+'/getResFile'">获取结果</a> -->
   </div>
</template>

<script>
 export default {
   name: 'Register',
   props: {
   },
   components: {
   },
   methods: {
       onSubmit() {
           if(this.form.name=='') {this.$message('请输入名字'); return}
           if(this.form.subject=='') {this.$message('请输入专业，无对应专业可任意选择');return}
           if(this.form.grade=='') {this.$message('请输入年级');return}
           if(this.form.method=='') {this.$message('请输入可视化方案');return}
           this.$router.push({path:'/Answer',query:this.form})
       }
   },
   data () {
       return {
            form: {
                name: '',
                subject: '',
                type: '',
                grade: '',
                age:'',
                sex:'',
                method:'',
            },
            baseUrl: '',
       }
   },
   created(){

   },
   mounted() {
       this.baseUrl = process.env.VUE_APP_BASE_URL
   }
}
</script>

<style>
 #register {
     width: 500px;
     margin: 0 auto;
     margin-top:100px;
    text-align: center;
 }
</style>