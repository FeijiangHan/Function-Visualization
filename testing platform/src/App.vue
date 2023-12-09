<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px; */
  color: #2c3e50;
  height: 100%;
}

*{
  margin: 0;
}

html, body{
  height: 100%;
  overflow: hidden;
}

.default-scrollbar__wrap {
    overflow-x: hidden;
  }
.el-scrollbar__wrap{
  /* overflow-x: hidden; */
  overflow: hidden;
}
.node {
    font: 12px sans-serif;
    }

    .link {
    fill: none;
    /*stroke: #ccc;*/
    }
    .shadow {  
    font-size: 12px;
    stroke: #fff;  
    stroke-width: 2px;  
    stroke-opacity: .8;  
    } 
    .func{
        fill: black;
        font-family: sans-serif;
        font-size: 12px;
        /* font-weight: 600; */
    }

    .lines{
        stroke: #CDCDCD;
        stroke-width: 2px;
    }
    .axis path, .axis line{
        fill: none;
        display: none;
        stroke-width: 2px;
        shape-rendering: crispEdges;
    }
    
    .axis text{
        fill: black;
        font-family: sans-serif;
        font-size: 12px;
    }
    /*grid*/
    .axis path,
    .axis line{
        fill: none;
        stroke: black;
        shape-rendering: crispEdges;
    }
    
    .axis text {
        font-family: sans-serif;
        font-size: 11px;
    }
    /*msv*/
    /* path.link {  
        fill: none;  
        stroke: #666;  
        stroke-width: 0.5px;  
    }   */

    marker#licensing {  
        fill: green;  
    }  

    path.link.licensing {  
        stroke: green;  
    }  

    path.link.resolved {  
        stroke-dasharray: 0,2 1;  
    }  

    circle {  
        stroke-width: 1px;
    }  

    text {  
        font: 12px sans-serif;  
        pointer-events: none;  
    }  

    text.shadow {  
        stroke: #fff;  
        stroke-width: 3px;  
        stroke-opacity: .8;  
    }  
</style>
