const taskList = [
    1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4
] // 8,9,10,11是多选

// const taskList=[1,2]
// "hierarchyMatrix", "hierarchyTree", "icicle",  "msv", 
const schList =["gridTree"]
// const schList=['graph','hierarchyGraph']

const countdown=[20,40,50,50,60,60,120,120]
// const countdown=[20,40]

const queList =[
    //FCD1-01
    ["T1.","main函数按顺序调用了哪几个不同的函数？",
    "T2.","fputs函数位于其所在调用路径中的第几层？\n注：main函数层数为1"],
    //FCD1-02
    ["T3.","哪个caller-callee调用对的频率最高？",
    "T4.","printf函数所在的完整的函数调用路径是什么？"],
    //FCD1-03
    ["T5.","该样本的总调用深度为？\n注：main函数深度为1",
    "T6.","该样本中存在固定函数调用对组合的周期出现的模式，该模式涉及的函数调用和周期次数为？\n"],
    //FCD1-04
    ["T7.","请选出以下四个函数按被调用的顺序进行排序的选项（若某个函数多次被调用，则以第一次被调用的顺序为基准）：\n①create_function、 ②__lambda_func、 ③eval 和 ④zend_compile_file",
    "T8.","请选出该样本中调用频率最高的caller-callee调用对。"],
    //FCD1-05
    ["T9.","常见的调用模式有\nPattern1.固定函数调用对的连续出现；\nPattern2.固定函数调用对组合的连续出现；\nPattern3.固定函数调用对组合的周期出现；\nPattern4.固定函数调用对组合的穿插出现。\n该样本中出现的了上述哪几种模式？",
    "T10.","样本中最长的函数调用链路是什么？"],
    //FCD1-06
    ["T11.","getinfo函数所在的完整调用路径是什么？",
    "T12.","常见的调用模式有\nPattern1.固定函数调用对的连续出现；\nPattern2.固定函数调用对组合的连续出现；\nPattern3.固定函数调用对组合的周期出现；\nPattern4.固定函数调用对组合的穿插出现。\n该样本中出现的了上述哪几种模式？"],
    //FCD1-07
    ["T13.","请按照调用顺序给以下4个函数调用对排序（若某个函数调用对多次出现，则以第一次出现的顺序为基准）：\n①main→create_function、②create_function→zend_compile_string、③eval→zend_compile_string、④main→__lambda_func",
    "T14.","该样本共有几层？\n注：main函数层数为1"]
];

const queList2 =[
    // 多选1
    ["T15.","观察并比较下列样本，找出你认为应该归为同一个家族的样本。",10],
    // 多选2
    ["T16.","观察并比较下列样本，找出你认为的两个家族所分别包含的样本。",15],
    // 多选3
    ["T17.", "观察并比较下列样本，找出你认为应该归为同一个家族的样本，以及该家族的变种样本。",25],
    // 多选4
    ["T18.", "观察并比较下列样本，找出你认为的两个家族所分别包含的样本。",40]
];

// const ansList = [
//     "我有一个完全确定的答案",
//     "我有一个不完全确定的答案",
//     "如果花足够的时间和精力，我可以获得一个完全确定的答案",
//     "即使花足够的时间和精力，我也能只能获得一个不完全确定的答案",
//     "该视图完全无法帮助我给出答案"
// ]
const ansList=[
    // Q1
    [["A. base64_decode, eval, zend_compile_file, phpinfo",
    "B. zend_compile_file, base64_decode, phpinfo, eval",
    "C. zend_compile_file, base64_decode, eval, phpinfo",
    "D. zend_compil_file, eval, base64_decode, phpinfo"],
    // Q2
    ["A. 1",  "B. 2",  "C. 3" , "D. 4"]],
    // Q3
    [["A. main-define",
    "B. main-explode",
    "C. main-defined",
    "D. eval-substr"],
    // Q4
    ["A. main→zend_compile_file→prtinf",
        "B. main→eval→printf",
        "C. main→pack→printf",
        "D. main→substr→printf"]],
    // Q5
    [["A. 3",  "B. 10",  "C. 4" , "D. 2"],
    // Q6
    ["A. class_uc_key→substr, class_uc_key→hexdec class_uc_key→pack 8次",
        "B. class_uc_key→substr， class_uc_key→hexdec， class_uc_key→pack 5次",
        "C. _func2→hex2bin, _func2→substr 5次",
        "D. _func2→hex2bin, _func2→substr 3次"]],
    // Q7
    [["A. ②①③④",
        "B. ④①②③",
        "C. ④②①③",
        "D. ④①③②"],
    // Q8
    ["A. create_function-zend_compile_string",
        "B. __lambda_func-eval",
        "C. eval-zend_fetch_r_post",
        "D. eval-define"]],
    // Q9
    [["A. Pattern1, Pattern2",
        "B. Pattern1, Pattern3",
        "C. Pattern1, Pattern4",
        "D. Pattern2, Pattern4"
        ],
    // Q10
    ["A. main→__lambda_func→eval\n→islogin→html_n",
        "B. main→__lambda_func→eval\n→zend_compile_string→sdbqiw\n→create_function→zend_compile_string",
        "C. main→__lambda_func→eval→sdbqiw\n→create_function→zend_compile_string",
        "D. main→create_function→eval→sdbqiw\n→create_function→zend_compile_string"]],
    // Q11
    [["A. main→s→m→eval→getinfo",
        "B. main→s→str_rot13→str_ireplace→getinfo",
        "C. main→s→m→str_ireplace→getinfo",
        "D. main→s→pack→eval→getinfo"],
    // Q12
    ["A. Pattern1, Pattern2",
        "B. Pattern1, Pattern3",
        "C. Pattern1, Pattern4",
        "D. Pattern2, Pattern4"
        ]],
    // Q13
    [["A. ①④②③",
    "B. ①②④③",
    "C. ④③①②",
    "D. ①④②③"
    ],
    // Q14
    ["A. 7",
    "B. 8",
    "C. 9",
    "D. 10"
    ]]
    // Q15
]


//导出 使变量可被导入
export {taskList, schList, queList, queList2, ansList, countdown}