export default function create_gridTree(d3,json,place){
    document.querySelector(place).innerHTML = '';
    // console.log("json",json);
  let tree = [];
  let l = 0; // 层级
  let links = []; // 父节点与第一个子节点之间的连线
  let max = 0; // 最大的index 
  let max_call_num = 0; 
  let tindex = 1;
  const width = 60, height = 60;
  
  let new_links = [] // 存储选中路径连线的数组
  let select_path = [] // 记录选中的路径
  let layer_maxmin = []; // 层级的最大最小值
  let click_check = 0; // 是否选择路径

  let colorMap = [
      [['chmod', 'copy', 'fclose', 'file_exists', 'file_get_contents', 'file_put_contents', 'fopen', 'fputs', 'glob', 'opendir', 'pclose', 'popen', 'rename', 'rmdir', 'touch', 'unlink'] ,"#703DAD"],
      [['assert', 'eval', 'exec', 'execute', 'passthru', 'proc_close', 'proc_open', 'shell_exec', 'system'],"#FF83B1"],
      [[ 'hexdec', 'htmlspecialchars', 'strtr', 'substr'],"#00CDEC"],
      [[ '__construct', 'call_user_func', 'call_user_func_array', 'create_function'],"#8685EF"],
      [[ 'base64_decode', 'gzinflate', 'str_rot13'],"#00C896"],
      [[ 'preg_match'],"#96BA2E"],
      [[ 'define', 'ini_set', 'set_time_limit'],"#FFC715"]
  ]; // 染色的颜色

  var svg = d3.select(place)
      .append("svg")
      .attr("width", 1200)
      .attr("height", 1000) // 全局svg

  var tmpg = svg.append('g');
  var innerg=tmpg.append('g');
  svg.call(d3.zoom().scaleExtent([0.1, 8]).on('zoom', function() {
      // console.log(d3.event)
      var scale = d3.event.transform.k,
      translate = [d3.event.transform.x, d3.event.transform.y]
  
      innerg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
  }))
  svg=innerg;

  
  const draw_paper = svg.append("g")
//   .attr("transform", "translate(150,50)"); // 选中路径的绘图板

  // 颜色比例尺
const color = d3.scaleLinear()
  .domain([1, max_call_num])
  .range(["rgb(245,245,245)","rgb(200,200,200)"]);
BFS(json);

// 层次遍历
function BFS(arr) {
  let next_visit = [];
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
      let children = arr[i].children;
      let p = i == 0 ? 1 : arr[i].eindex;
      if (children && children.length != 0) {
          
          // 父节点与第一个子节点的连边
          links.push([[arr[i].x, arr[i].y], [counter * (width + 8), l * (height + 24)]]);
          
          children.forEach(d => {
              //console.log("加工前：",d.all_index)
              d.all_index = JSON.parse(d.all_index);
              //console.log("加工后：",d.all_index)
              max = Math.max(max, ...d.all_index); // 平分区间画条带的时候用到
              max_call_num = Math.max(max_call_num, d.call_num); // 染色背景深度的
              d.x = counter * (width + 8); // 偏移一个方格大小+空白
              d.y = l * (height + 24);
              d.layer = l; // 层级
              counter += 1; // 同一层水平排布
              next_visit.push(d);
              d.pindex = p; // 父节点索引
              // 根据敏感度记录颜色
              //console.log(d)
              let flag = 0;
              if(d.is_sensitive) {
                  colorMap.forEach(i => {
                      i[0].forEach(j => {
                          if(j == d.name) {
                              flag = 1;
                              d.color = i[1];
                          }
                      })
                  })// end of forEach
              } 
              if (!d.is_sensitive || flag == 0) {
                  //console.log(d.name+"不敏感，要染色#888888")
                  d.color = "#888888";
              }

              // 记录索引信息
              if(d.children &&d.children.length != 0) {
                  tindex += 1;
                  d.eindex = tindex; // 全局索引
              } else{
                  d.eindex = 0;
              }
          })
          counter += 1;  // 留空用
      }
  }
  if (next_visit.length == 0) {
      // Draw_selection();
      drawTree(tree);
      drawLinks(links);
      return;
  }
  tree.push(next_visit);
  l += 1; // y反向只有遍历完一层后再增1
  BFS(next_visit);
}


function BFS2(d) {
  let queue = [];
  queue.push(d);
  // 层序遍历：
  while(queue.length != 0) {
      let node = queue.shift();
      select_path.push(node);
      if(node.children.length != 0)
      {
          node.children.forEach(c => {
              queue.push(c);
              new_links.push([[node.x, node.y], [c.x, c.y]]);
          });
      }
  }
}

let my_inner_height = 0; // 内部高度
function myScale(index, low, max)
{
  let my_inner_height = (height/(max-low+1));
  return my_inner_height * index;
}



// 绘制树图
function drawTree(tree) {
  // 比例尺
  const scale = d3.scaleLinear()
  .domain([0, max+1]) // 保证最后一个index可以映射到底部
  .range([0, height]);

  let inner_height = (height/(max+1)).toFixed(16); // 内层条带的高度

  draw_paper.selectAll("g")
  .data(tree) // 一个元素就是一层
  .enter()
  .append("g")
  .each(function(data,l) { // data 是一个list
      let indexs = [];
      //console.log(data)
      const g = d3.select(this); // 一层的g
      //console.log(data,l)
      g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d, i) => d.x)
          .attr("y", (d, i) => d.y)
          .attr("width", width)
          .attr("height", height)
          .attr("fill", d => color(1))
          .attr("stroke", d => color(1))
          .attr("stroke-width", 0.5)
          .append("title")
            .text(d=>d.name)
          .attr("id", function(d,i){ return "rect"+d.eindex; })
          .on("click",function(c,d){
              if(click_check == 0) {
                 
                  click_check = 1;
              } 
              else{
                  
                  click_check = 0;
              } // end of if else
          });

      //let error = 0;
      const g3 = svg.append("g")
        //   .attr("transform", "translate(150,50)")
          .attr("id","global_innerRect");
      data.forEach(d => { // d是list中的一个元素

          d.all_index.forEach(c => { // 取出all_index列表中的单个index
              const offset_Y = myScale(c,0,max); // 偏移量
              //console.log(d.name + "的color为" + d.color);
              g3.append("rect")
              .attr("x", d.x)
              .attr("y", d.y + offset_Y + 0.25) // 偏移量，0.00001是为了避免重叠
              .attr("width", width)
              .attr("height", inner_height)
              .attr("fill",d.color)
              .attr("stroke", d.color)
              .attr("stroke-width", 0.5)
              .on("mouseover",function(){
              })
              .on("mouseout",function(i,d){
              })
              //console.log("z: ",d.y+offset_Y)
              //console.log("计算间隔：",d.y + offset_Y - error);
              //error = d.y+offset_Y;

          }) // end of forEach
      }) // end of forEach
      const gt = svg.append("g")
    //.attr("transform", "translate(150,50)")
      .attr("id","global_text");

  gt.selectAll(".name")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("x", d => d.x + width / 2)
      .attr("y", d => d.y + height / 2 - 9)
      .text(d => d.name.substring(0, 8))
      .style("text-width",2);


  gt.selectAll(".txt")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("x", d => d.x + width / 2)
      .attr("y", d => d.y + height / 2 + 8)
      .text(function(d) {return "↑" + d.pindex + " - " +  d.eindex + "↓"});

  // extent(indexs) 返回数组中最大值和最小值的数组
  data.forEach(d => {
      indexs = indexs.concat(d.all_index); // concat是拼接数组
  });
  let [imax, imin] = d3.extent(indexs);
  layer_maxmin.push([imax,imin]); // 存储每一层最大值和最小值
  gt.append("text")
      .attr("x",-2)
      .attr("y",data[0].y + 8)
      .attr("font-size", "10px")
      .attr("text-anchor", "end")
      .text(imax);
  gt.append("text")
      .attr("x",-2)
      .attr("y",data[0].y + height)
      .attr("font-size", "10px")
      .attr("text-anchor", "end")
      .text(imin);              
  })
}


// 绘制连线
function drawLinks(links) {
  draw_paper
  .selectAll('path')
  .data(links)
  .enter()
  .append('path')
  .each(function(d,i) // 1.遍历每个元素
  {
      if(i != 0)
      {
          const path = d3.select(this); // 2.选中绑定的本元素
          let [[x1, y1], [x2, y2]] = [d[0],d[1]];
          path.attr("d", `M${x1 + width / 2},${y1 + height + 2} L${x1 + width / 2},${y1 + height + 12} L${x2 + width / 2},${y1 + height + 12} L${x2 + width / 2},${y2 - 2}`)
              .attr("stroke", "black")
              .attr("fill", "none"); // 3.添加属性
      } else{
          //console.log("mian函数跳过",d);
      }
  }) // end of each
}


/*
2022.7.26 日志
绘制左侧区间选择轴：
1.绘制整个矩形框，用(l-1) * (height + 24) + height 计算出最低端的距离
2.设计映射比例尺，将区间内的坐标映射到[0,max]上，自己实现了my_select_scale比例尺，
思路是先算每个索引占用的区间长度，再用y除以即可得到对应索引
3.d3.drag()事件和call()的使用，拖拽事件中使用d.x和d.y得到鼠标在区间内的坐标
select后使用_groups[0][0].getAttribute("y1")即可得到上下横线的坐标
4.拖拽效果实现：先声明初始变量（横线、文字、填充），在拖拽事件中，动态获取鼠标坐标，然后动态改变这些变量的位置属性即可
5.拖拽的限制：上下界限制，上界和下界相对位置的限制（！！）
6.拖拽完成后，计算出新的区间，重新绘制条带，使用新的比例尺

待修改：
1.区间变换后的条带覆盖文字
2.上下界的太细，不好选中，添加三角警示标志在外侧 : 已解决，但是需要优化过程，不然有点卡
3.实现层级关系
*/

/*
2022.7.27 日志
完善左侧区间选择轴：
1.每次选择区间后重新绘制文字，避免覆盖；但是这样会导致边选择边显示卡顿，因此改为选中后展示
2.绘制三角标，移动三角标
3.层级关系绘制，层次遍历树即可

待修改：
1.美化三角标；美化颜色
2.左侧轴线被遮挡 : 带透明度的刷选解决
*/
// 比例尺
function my_select_scale(y)
{
  let gap =  [(l-1) * (height + 24) + height] / (max); // 计算每个值的间隔
  return y / gap; // 返回对应的比例尺值
}


function Draw_selection()
{
  let selection_g = svg.append("g").attr("transform", "translate(40,50)");
  
  selection_g.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width-5)
  .attr("height", (l-1) * (height + 24) + height)
  .attr("fill", "white")
  .attr("stroke", "#888888");
  // 绘制层级关系
  const layer_width = (width- 5) / l; // 单位层次的宽度
  const layer_height = ( (l-1) * (height + 24) + height) / (max + 1); // 单位索引的高度

  tree.forEach(function(data,l) { // data 是一个list
      data.forEach(function(d,i) {
          d.all_index.forEach(c => {
              selection_g.append("rect")
              .attr("x", d.layer * layer_width)
              .attr("y", c * layer_height)
              .attr("width", layer_width)
              .attr("height", 0.95*layer_height)
              .attr("fill", "#8685EF");
          })
      })
  }) // end of each

  // 记录上界和下界
  let imin = 0;
  let imax = max;
  // 拖拽事件
  let drag = d3.drag()
      .on("start",function(d){
          //console.log("开始",d.y);
      })
      .on("drag",function(d){
      //console.log("拖拽中",d);
      
      // move circle
      let downline = d3.select("#down_line");
      let upline = d3.select("#up_line");

      if (my_select_scale(d.y) >= 0 && my_select_scale(d.y) <= max)
      {
          let l = d3.select(this);
          var dx = d.x;//this will give the delta x moved by drag
          var dy = d.y;//this will give the delta y moved by drag

          if (l._groups[0][0].getAttribute("id") == "up_line" || l._groups[0][0].getAttribute("id") == "up_tri") 
          {
              // 移动横线
              up_line.attr("y1",dy)
                       .attr("y2",dy);
              // 移动左侧区间选择点
              up_tri.attr("transform", "translate(" + 0 + "," + dy + ")");
              up_text.attr("y", dy + 3)
                  .text(imin);
          }
          else if (l._groups[0][0].getAttribute("id") == "down_line" || l._groups[0][0].getAttribute("id") == "down_tri") 
          {
              down_line.attr("y1",dy)
                      .attr("y2",dy);
              down_tri.attr("d", `M${width - 5},${dy} L${width + 20},${dy - 12} L${width + 20},${dy + 12} L${width - 5},${dy}`)
              down_text.attr("y", dy + 3)
                  .text(imax);
          }
          else 
          {
              console.log(l);
          }
          background.attr("y",upline._groups[0][0].getAttribute("y1"))
                    .attr("height", downline._groups[0][0].getAttribute("y1") - upline._groups[0][0].getAttribute("y1"));
          
          imin = Math.round(my_select_scale(upline._groups[0][0].getAttribute("y1")));
          imax = Math.round(my_select_scale(downline._groups[0][0].getAttribute("y1")));
          // 显示区间索引
          
          
          // 交换最值
          if (imin > imax)
          {
              let temp = imin;
              imin = imax;
              imax = temp;
          }
      }
      })
      .on("end",function(d){
          //console.log("结束",d);
          // 新条带的比例尺
          const scale2 = d3.scaleLinear()
              .domain([imin, imax+1]) // 保证最后一个index可以映射到底部
              .range([0, height]);
          
          // 重新绘制内部条带
          d3.selectAll("#global_innerRect").remove(); // 删除所有条带
          let inner_height = height / (imax - imin + 1); // 计算每个条带的高度
          tree.forEach(data => {
          const gn = svg.append("g")
            //   .attr("transform", "translate(150,50)")
              .attr("id","global_innerRect");
          data.forEach(d => { // d是list中的一个元素
              d.all_index.forEach(c => { // 取出all_index列表中的单个index
                  if (c >= imin && c <= imax) 
                  {
                      const offset_Y = scale2(c); // 偏移量
                      //console.log(d.name + "的color为" + d.color);
                      gn.append("rect")
                      .attr("x", d.x)
                      .attr("y", d.y + offset_Y) // 偏移量，0.00001是为了避免重叠
                      .attr("width", width)
                      .attr("height", inner_height)
                      .attr("fill",d.color)
                      .attr("stroke", d.color)
                      .attr("stroke-width", 0.5)
                  }
              }) // end of forEach
          }) // end of forEach

      let indexs = [];
      const gt = svg.append("g")
        //   .attr("transform", "translate(150,50)")
          .attr("id","global_text");

      gt.selectAll(".name")
          .data(data)
          .enter()
          .append("text")
          .attr("font-size", "10px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.x + width / 2)
          .attr("y", d => d.y + height / 2 - 9)
          .text(d => d.name.substring(0, 8))
          .style("text-width",2);


      gt.selectAll(".txt")
          .data(data)
          .enter()
          .append("text")
          .attr("font-size", "10px")
          .attr("text-anchor", "middle")
          .attr("x", d => d.x + width / 2)
          .attr("y", d => d.y + height / 2 + 8)
          .text(function(d) {return "↑" + d.pindex + " - " +  d.eindex + "↓"});

      // extent(indexs) 返回数组中最大值和最小值的数组
      data.forEach(d => {
          indexs = indexs.concat(d.all_index); // concat是拼接数组
      });
      let [imax2, imin2] = d3.extent(indexs);
      gt.append("text")
          .attr("x",-2)
          .attr("y",data[0].y + 8)
          .attr("font-size", "10px")
          .attr("text-anchor", "end")
          .text(imax2);
      gt.append("text")
          .attr("x",-2)
          .attr("y",data[0].y + height)
          .attr("font-size", "10px")
          .attr("text-anchor", "end")
          .text(imin2);                    
          });                    
      });

  let up_line = selection_g.append("line")
      .attr("id", "up_line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width - 5)
      .attr("y2", 0)
      .attr("stroke", "#888888")
      .call(drag)

  let down_line = selection_g.append("line")
      .attr("id", "down_line")
      .attr("x1", 0)
      .attr("y1", (l-1) * (height + 24) + height)
      .attr("x2", width - 5)
      .attr("y2", (l-1) * (height + 24) + height)
      .attr("stroke", "#888888")
      .call(drag);    

  let up_tri = selection_g.append("path")
          .attr("d", `M${0},${0} L${-26},${-12} L${-26},${12} L${0},${0}`)
          .attr("id", "up_tri")
          .attr("fill", color(1))
          .attr("stroke", "#888888")
          .attr("stroke-width", 0.7)
          .call(drag);

  let down_tri = selection_g.append("path")
          .attr("d", `M${width - 5},${(l-1) * (height + 24) + height} L${width + 20},${(l-1) * (height + 24) + height-12} L${width + 20},${(l-1) * (height + 24) + height + 12} L${width - 5},${(l-1) * (height + 24) + height}`)
          .attr("id", "down_tri")
          .attr("fill", color(1))
          .attr("stroke", "#888888")
          .attr("stroke-width", 0.7)
          .call(drag);    


  let up_text = selection_g.append("text")
      .attr("x", -9)
      .attr("y", 3)
      .attr("font-size", "7px")
      .attr("text-anchor", "end")
      .text(0)
      .call(drag);
  
  let down_text = selection_g.append("text")
      .attr("x", width + 16)
      .attr("y", (l-1) * (height + 24) + height + 3)
      .attr("font-size", "7px")
      .attr("text-anchor", "end")
      .text(max)
      .call(drag);
  
  let background = selection_g.append("rect")
              .attr("id", "selected_background")   
              .attr("x", 0)
              .attr("y", 1)
              .attr("width", width-5)
              .attr("height", (l-1) * (height + 24) + height - 2)
              .attr("fill", "rgb(245,245,245)")
              .style("opacity",0.26)
              .on("click", (d) => {
                  d3.select("#selected_background")
                      .attr("y", 1)
                      .attr("height", (l-1) * (height + 24) + height - 2);
                  down_line.attr("y1",(l-1) * (height + 24) + height)
                      .attr("y2",(l-1) * (height + 24) + height);
                  up_line.attr("y1",0)
                      .attr("y2",0);
                  up_tri.attr("transform", `translate(0,0)`);
                  down_tri.attr("d", `M${width - 5},${(l-1) * (height + 24) + height} L${width + 20},${(l-1) * (height + 24) + height-12} L${width + 20},${(l-1) * (height + 24) + height + 12} L${width - 5},${(l-1) * (height + 24) + height}`)
                  up_text.attr("y", 3.5)
                      .text(0);
                  down_text.attr("y", (l-1) * (height + 24) + height + 3.5)
                      .text(max);
                  
                  // 重新绘制内部条带
                  d3.selectAll("#global_innerRect").remove(); // 删除所有条带
                  let inner_height2 = height / (max + 1); // 计算每个条带的高度
                  tree.forEach(data => {
                  const gn = svg.append("g")
                    //   .attr("transform", "translate(150,50)")
                      .attr("id","global_innerRect");
                  data.forEach(d => { // d是list中的一个元素
                      d.all_index.forEach(c => { // 取出all_index列表中的单个index
                              const offset_Y = myScale(c, 0, max); // 偏移量
                              gn.append("rect")
                              .attr("x", d.x)
                              .attr("y", d.y + offset_Y) // 偏移量，0.00001是为了避免重叠
                              .attr("width", width)
                              .attr("height", inner_height2)
                              .attr("fill",d.color)
                              .attr("stroke", d.color)
                              .attr("stroke-width", 0.5)
                      }) // end of forEach
                  }) // end of forEach
                  let indexs = [];
                  const gt = svg.append("g")
                    //   .attr("transform", "translate(150,50)")
                      .attr("id","global_text");
  
                  gt.selectAll(".name")
                      .data(data)
                      .enter()
                      .append("text")
                      .attr("font-size", "10px")
                      .attr("text-anchor", "middle")
                      .attr("x", d => d.x + width / 2)
                      .attr("y", d => d.y + height / 2 - 9)
                      .text(d => d.name.substring(0, 8))
                      .style("text-width",2);
      
      
                  gt.selectAll(".txt")
                      .data(data)
                      .enter()
                      .append("text")
                      .attr("font-size", "10px")
                      .attr("text-anchor", "middle")
                      .attr("x", d => d.x + width / 2)
                      .attr("y", d => d.y + height / 2 + 8)
                      .text(function(d) {return "↑" + d.pindex + " - " +  d.eindex + "↓"});
      
                  // extent(indexs) 返回数组中最大值和最小值的数组
                  data.forEach(d => {
                      indexs = indexs.concat(d.all_index); // concat是拼接数组
                  });
                  let [imax2, imin2] = d3.extent(indexs);
                  gt.append("text")
                      .attr("x",-2)
                      .attr("y",data[0].y + 8)
                      .attr("font-size", "10px")
                      .attr("text-anchor", "end")
                      .text(imax2);
                  gt.append("text")
                      .attr("x",-2)
                      .attr("y",data[0].y + height)
                      .attr("font-size", "10px")
                      .attr("text-anchor", "end")
                      .text(imin2);                                      
              }) // end of forEach

          }); // end of click event

} // end of draw_selection




// 绘制连线2
function drawLinks2(links) {
  const g = svg
      .append("g")
    //   .attr("transform", "translate(150,50)");
  for (let i = 0; i < links.length; i++) {
      let [[x1, y1], [x2, y2]] = links[i];
      g.append("path")
          .attr("d", `M${x1 + width / 2},${y1 + height + 2} L${x1 + width / 2},${y1 + height + 15} L${x2 + width / 2},${y1 + height + 15} L${x2 + width / 2},${y2 - 2}`)
          .attr("stroke", "black")
          .attr("fill", "none");
  }
}

  }