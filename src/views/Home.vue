<template>
  <div id="current-temp"></div>
  <div id="temp"></div>
</template>

<script>
import axios from "_axios@0.21.1@axios";
import echarts from "_echarts@4.9.0@echarts";

export default {
  data() {
    return {
      currentTemp: 0
    }
  },
  methods: {
    getTemperature: function () {
      const _this = this;
      axios.get("http://81.68.230.143:8000/api/temperature").then(function (response) {

        let times = Array()
        let temperatures = Array()
        for (let i in response.data) {
          times.push(response.data[i].createTime)
          temperatures.push(response.data[i].temperature)
        }
        _this.currentTemperature = temperatures[response.data.length - 1]
        let myChart = echarts.init(document.getElementById('temp'));
        let option = {
          title: {
            text: '温度变化曲线',
          },
          tooltip: {},
          legend: {
            data: ['温度']
          },
          xAxis: {
            data: times.slice(times.length - 10, times.length)
          },
          yAxis: {},
          series: [{
            name: '温度',
            type: 'line',
            data: temperatures.slice(temperatures.length - 10, temperatures.length)
          }]
        };
        myChart.setOption(option);
      })
    }
  },
  created() {
    this.getTemperature()
  }
}
</script>
