<template>
  <div class="globe">
    <el-row>
      <el-container>
        <el-header style="background-color: #B3C0D1; color: gray; text-align: left; line-height: 60px;">全球航线图</el-header>
        <el-main id="global" style="width: 100%;height: 1000px;background: rgba(219,219,219,0.58); box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);"></el-main>
      </el-container>
    </el-row>

    <el-row>
      <el-container>
        <el-header style="background-color: #B3C0D1; color: gray; text-align: left; line-height: 60px;">美国区域航线图</el-header>
        <el-main id="usa" style="width: 100%;height: 1000px;background: rgba(219,219,219,0.58); box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);"></el-main>
      </el-container>
    </el-row>

  </div>
</template>

<script>
import background from "../assets/starfield.jpg";
import world from "../assets/world.topo.bathy.200401.jpg";
import composite from "../assets/bathymetry_bw_composite_4k.jpg";

export default {
  name: "Globe",
  methods: {
    myGlobe() {
      let myChart = this.$echarts.init(document.getElementById("global"));
      myChart.showLoading();
      this.$http.get(this.$website + "/main/getBaseFlights.json").then(resp => {
        let airports = resp.data.airports.map(item => {
          return {
            coord: [item.longitude, item.latitude]
          }
        });
        console.log(airports)

        function getAirportCoord(code) {
          for (let item in resp.data.airports)
            if (code === resp.data.airports[item].code)
              return [resp.data.airports[item].longitude, resp.data.airports[item].latitude];
        }

        // Route: [airlineIndex, sourceAirportIndex, destinationAirportIndex]
        let routesGroupByAirline = {};

        resp.data.routes.forEach(route => {
          if (!routesGroupByAirline["All"]) {
            routesGroupByAirline["All"] = [];
          }
          routesGroupByAirline["All"].push(route);
        });
        resp.data.routes.forEach(route => {
          for (let item in resp.data.airlines)
            if (route.carrier === resp.data.airlines[item].name)
              var airline = resp.data.airlines[item];
          let airlineName = airline.name;
          if (!routesGroupByAirline[airlineName]) {
            routesGroupByAirline[airlineName] = [];
          }
          routesGroupByAirline[airlineName].push(route);
        });

        function getAirport(code) {
          for (let item in resp.data.airports)
            if (code === resp.data.airports[item].code)
              return {
                name: resp.data.airports[item].name,
                value: [resp.data.airports[item].longitude, resp.data.airports[item].latitude
                ]
              };

        }

        let pointsData = [];
        resp.data.routes.forEach(route => {
          pointsData.push(getAirport(route.origin));
          pointsData.push(getAirport(route.dest));
        });
        console.log(pointsData);
        resp.data.airlines.push({name: "All"});
        let series = resp.data.airlines.map(airline => {
          let airlineName = airline.name;
          let routes = routesGroupByAirline[airlineName];

          if (!routes) {
            return null;
          }
          return {
            type: 'lines3D',
            name: airlineName,

            effect: {
              show: true,
              trailWidth: 2,
              trailLength: 0.15,
              trailOpacity: 1,
              trailColor: 'rgb(30, 30, 60)'
            },

            lineStyle: {
              width: 1,
              color: 'rgb(50, 50, 150)',
              // color: 'rgb(118, 233, 241)',
              opacity: 0.1
            },
            blendMode: 'lighter',

            data: routes.map(item => {

              return [getAirportCoord(item.origin), getAirportCoord(item.dest)];
            })
          };
        }).filter(function (series) {
          return !!series;
        });
        series.push({
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: 10,
          itemStyle: {
            color: 'rgb(50, 50, 150)',
            opacity: 0.2
          },
          emphasis: {
            label: {
              formatter: '{b}',
              color: "rgba(27, 139, 101, 1)",
              backgroundColor: "rgba(0, 0, 0, 1)",
              position: 'right',
              show: true
            },
            itemStyle: {
              color: "rgba(221, 17, 17, 1)"
            }
          },
          label: {
            normal: {
              fontStyle: "oblique",
              backgroundColor: "rgba(13, 12, 12, 1)"
            }
          },
          data: pointsData
        });


        myChart.setOption({
          legend: {
            selectedMode: 'single',
            left: 'left',
            data: Object.keys(routesGroupByAirline),
            orient: 'vertical',
            textStyle: {
              color: '#fff'
            }
          },
          globe: {

            environment: background,
            baseTexture: world,
            heightTexture: composite,

            displacementScale: 0.1,
            displacementQuality: 'high',


            shading: 'realistic',
            realisticMaterial: {
              roughness: 0.2,
              metalness: 0
            },

            postEffect: {
              enable: true,
              depthOfField: {
                enable: false,
                focalDistance: 150
              }
            },
            temporalSuperSampling: {
              enable: true
            },
            light: {
              ambient: {
                intensity: 1.5
              },
              main: {
                intensity: 1,
                shadow: true
              },
              ambientCubemap: {
                texture: "../assets/pisa.hdr",
                exposure: 1,
                diffuseIntensity: 0.5,
                specularIntensity: 2
              }
            },
            viewControl: {
              autoRotate: false
            },
            silent: true
          },
          series: series
        });
        myChart.hideLoading();
        window.addEventListener('keydown', function () {
          series.forEach(function (series, idx) {
            myChart.dispatchAction({
              type: 'lines3DToggleEffect',
              seriesIndex: idx
            });
          })
        });
      })
    },
    myAirlines() {
      let myChart = this.$echarts.init(document.getElementById("usa"));
      myChart.showLoading();
      this.$http.get(this.$website + "/test/getUSA.json").then(resp => {
        this.$echarts.registerMap('USA', resp.data);
        this.$http.get(this.$website + "/main/getBaseFlights.json").then(resp => {
          console.log(resp.data);

          myChart.hideLoading();
          console.log(resp.data.airports);
          function getAirportCoord(code) {
            for (let item in resp.data.airports) {
              if (code === resp.data.airports[item].code)
                return [resp.data.airports[item].longitude, resp.data.airports[item].latitude]
            }
          }

          let routes = resp.data.routes.map(route => {
            return [
              getAirportCoord(route.origin),
              getAirportCoord(route.dest)
            ];
          });
          console.log(routes);
          myChart.setOption({
            geo3D: {
              map: 'USA',
              shading: 'realistic',
              silent: true,
              environment: '#333',
              realisticMaterial: {
                roughness: 0.8,
                metalness: 0
              },
              postEffect: {
                enable: true
              },
              groundPlane: {
                show: false
              },
              light: {
                main: {
                  intensity: 1,
                  alpha: 30
                },
                ambient: {
                  intensity: 0
                }
              },
              viewControl: {
                distance: 70,
                alpha: 89,

                panMouseButton: 'left',
                rotateMouseButton: 'right'
              },

              itemStyle: {
                areaColor: '#000'
              },

              regionHeight: 0.5
            },
            series: [{
              type: 'lines3D',

              coordinateSystem: 'geo3D',

              effect: {
                show: true,
                trailWidth: 1,
                trailOpacity: 0.5,
                trailLength: 0.2,
                constantSpeed: 5
              },

              blendMode: 'lighter',

              lineStyle: {
                width: 0.2,
                opacity: 0.05
              },

              data: routes
            }]
          });
          window.addEventListener('keydown', function () {
            myChart.dispatchAction({
              type: 'lines3DToggleEffect',
              seriesIndex: 0
            });
          });
        })
      })

    }
  },
  mounted() {
    this.myGlobe();
    this.myAirlines()
  }
}
</script>

<style scoped>

</style>