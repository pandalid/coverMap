var chartIds = ['graph'];

$(function () {
    // 窗口大小变化时重算尺寸
    var timer = null;

    function resizeCharts() {
        if (timer) clearTimeout(timer)

        timer = setTimeout(function () {
            $.each(chartIds, function (idx, id) {
                var el = $("#" + id)[0];
                var chart = echarts.init(el);
                chart.resize();
            })
        }, 200);
    }

    boxheight();
});

$(function () {

    // 加载图表
    setTimeout(function () {
        queryData();
    }, 400)

});

function boxheight() { //函数：获取尺寸
    //获取浏览器窗口高度
    var winHeight = 0;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过Document对body进行检测，获取浏览器可视化高度
    if (document.documentElement && document.documentElement.clientHeight)
        winHeight = document.documentElement.clientHeight;
    //DIV高度为浏览器窗口高度
    document.getElementById('pBox').style.height = winHeight * 0.92 + 'px';
    document.getElementById('graph').style.height = winHeight * 0.88 + 'px';

//	document.getElementById('tipBox').style.height=winHeight*0.92+'px';
}

window.onresize = boxheight; //窗口或框架被调整大小时执行


var lineName;
var chart;


function queryData() {
    //todo
    //添加查询功能
    lineName = $('#xmSelect').val();


    result = {
        line: '京九',
        min: 907,
        max: 1277,
        y: ['计划完成', '实际完成'],
        coverData: [
            {
                itemStyle: {
                    normal: {color: '#0000ff'}
                },
                name: '京九',
                value: ['计划完成', 907.3, 988, '计划捣固'],
            },
            {
                itemStyle: {
                    normal: {color: '#1aff23'}
                },
                name: '京九',
                value: ['实际完成', 912.5, 917.5, '实际捣固'],
            },
            {
                itemStyle: {
                    normal: {color: '#19db10'}
                },
                name: '京九',
                value: ['实际完成', 955.19, 958, '实际捣固'],
            }
        ]
    };
    loadGraph(result)

}


//加载echarts
function loadGraph(result) {
//         console.log(JSON.stringify(result.zyxmData))

    option = {
        tooltip: {
            formatter: function (params) {
                var tip = '行别-类型 :' + params.value[0] +
                    "<br/>单元名 : " + params.marker + params.name +
                    '<br/>' +
                    '起始里程 : K' + parseFloat(params.value[1]) + '<br/>' +
                    '结束里程 : K' + parseFloat(params.value[2]) + '<br/>' +
                    '类型 :' + params.value[3] + '<br/>';

                if (!isNaN(parseFloat(result[params.value[0]]))) {
                    tip += '作业总里程 :' + parseFloat(result[params.value[0]]);
                }

                return tip

            }
        },
        title: {
            text: "施工完成情况图",
            left: 'center'
        },
        dataZoom: [{
            type: 'slider',
            filterMode: 'weakFilter',
            min: result.min,
            max: result.max,
            start: 0,
            end: 17,
            showDataShadow: true,//拖动条显示数据阴影
            height: 20,
            borderColor: 'transparent',
            backgroundColor: '#e2e2e2',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 20,
            handleStyle: {
                shadowBlur: 6,
                shadowOffsetX: 1,
                shadowOffsetY: 2,
                shadowColor: '#aaa'
            },
            labelFormatter: ''
        }, {
            type: 'inside',
            filterMode: 'weakFilter'
        }],
        grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            x: '10%',
            x2: '10%',
            y: '10%',
            y2: '1%'
        },
        xAxis: {
            name: '里程',
            min: result.min,
            max: result.max,
            scale: true,
            splitLine: {show: false},
            axisLabel: {
                formatter: val => 'k' + val
            }
        },
        yAxis: {
            name: '线名-行别',
            data: result.y,
            splitLine: {show: true},
        },
        series: [{
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
                normal: {
                    opacity: 0.8//透明度

                }
            },
            encode: {
                x: [1, 2], //1 2 维度(列)映射到x轴
                y: 0 //0 维度(列)映射到y轴
            },
            data: result.coverData
        }]
    };

    var el = $('#graph')[0];
    chart = echarts.init(el, 'shine');
    chart.setOption(option, true);

}


function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.1;

    var rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: 20 //宽度
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });

    return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
    };
}





