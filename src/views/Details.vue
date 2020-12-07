<template>
  <div class="details">
    <el-row style="height: 800px" :gutter="24">
      <el-col :span="14" :offset="5"
              style="height: 100%; background: rgba(219,219,219,0.58); box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 30px">
        <div
            style="border-radius: 4px;height: 100%;width:100%;overflow: auto"
            id="rose">
        </div>
      </el-col>
    </el-row>
    <el-row style="height: 20px"/>
    <el-row style="height: 800px" :gutter="24">
      <el-col :span="14" :offset="5"
              style="height: 100%; background: rgba(219,219,219,0.58); box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 30px">
        <div
            style="border-radius: 4px;height: 100%;width:100%;overflow: auto"
            id="bar">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Details",
  methods: {
    myRose() {
      let rose = this.$echarts.init(document.getElementById("rose"));
      rose.showLoading();
      let bar = this.$echarts.init(document.getElementById("bar"));
      bar.showLoading();
      this.$http.get(this.$website + "/main/getBaseInfo.json").then(resp =>
      {
        function getCode(data) {
          let code = [];
          for (let item in data)
            code.push(data[item].code);
          return code;
        }
        function getDepAvg(data) {
          let avg = [];
          for (let item in data)
            avg.push(data[item].avgDepDelay);
          return avg;
        }
        function getArrAvg(data) {
          let avg = [];
          for (let item in data)
            avg.push(data[item].avgArrDelay);
          return avg;
        }

        let option1 = {
          title: {
            text: '各个航空公司准点起飞，起飞延误，与航班取消',
            subtext: '准点起飞（左上），起飞轻度延误（<30min，右上），起飞重度延误（>30min，左下），取消（右下）',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: resp.data.onTime.map(data => {
              return data.name;
            })
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
            }
          },
          series: [{
            name: '准点',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '30%'],
            roseType: 'area',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: resp.data.onTime
          }, {
            name: '轻微延迟',
            type: 'pie',
            radius: [20, 110],
            center: ['75%', '30%'],
            roseType: 'area',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: resp.data.littleDelay
          },
            {
              name: '重度延迟',
              type: 'pie',
              radius: [20, 110],
              center: ['25%', '60%'],
              roseType: 'area',
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: resp.data.heavyDelay
            },
            {
              name: '取消',
              type: 'pie',
              radius: [20, 110],
              center: ['75%', '60%'],
              roseType: 'area',
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: resp.data.cancelled
            },
          ]
        };

        rose.setOption(option1);

        rose.hideLoading();

        let emphasisStyle = {
          itemStyle: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        };

        let option2 = {
          title: {
            text: '各个航空公司延误条形图',
            left: 'center'
          },
          legend: {
            data: ['起飞延误', '降落延误'],
            left: 10,
          },
          brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: 0
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['stack', 'tiled']
              },
              dataView: {}
            }
          },
          tooltip: {},
          xAxis: {
            data: getCode(resp.data.avgDelay),
            name: 'X Axis',
            axisLine: {onZero: true},
            splitLine: {show: false},
            splitArea: {show: false}
          },
          yAxis: {
            inverse: true,
            splitArea: {show: false}
          },
          grid: {
            left: 100
          },
          visualMap: {
            type: 'continuous',
            dimension: 1,
            text: ['High', 'Low'],
            inverse: true,
            itemHeight: 200,
            calculable: true,
            min: -2,
            max: 20,
            top: 60,
            left: 10,
            inRange: {
              colorLightness: [0.4, 0.8]
            },
            outOfRange: {
              color: '#bbb'
            },
            controller: {
              inRange: {
                color: '#2f4554'
              }
            }
          },
          series: [
            {
              name: '起飞延误',
              type: 'bar',
              stack: 'one',
              emphasis: emphasisStyle,
              data: getDepAvg(resp.data.avgDelay)
            },
            {
              name: '降落延误',
              type: 'bar',
              stack: 'one',
              emphasis: emphasisStyle,
              data: getArrAvg(resp.data.avgDelay)
            },
          ]
        };

        bar.on('brushSelected', renderBrushed);

        function renderBrushed(params) {
          let brushed = [];
          let brushComponent = params.batch[0];

          for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            let rawIndices = brushComponent.selected[sIdx].dataIndex;
            brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
          }

          bar.setOption({
            title: {
              backgroundColor: '#333',
              text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
              bottom: 0,
              right: 0,
              width: 100,
              textStyle: {
                fontSize: 12,
                color: '#fff'
              }
            }
          });
        }

        bar.setOption(option2);

        bar.hideLoading();

      })
    }
  },
  mounted() {
    this.myRose();
  }
}
</script>

<style scoped>

</style>