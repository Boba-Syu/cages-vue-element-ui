<template>
  <div style="width: 800px;height:700px;float: left">
    <h1 style="color:red;font-size: 30px">当前温度: {{ currentTemperature }}℃</h1>
    <br>
    <div id="main" style="width: 800px;height:600px;float: left"></div>
  </div>

  <el-table :data="tableData" border style="width: 600px;height: 700px" :row-class-name="tableRowClassName"
            height="250">
    <el-table-column fixed prop="id" label="编号" width="120px"></el-table-column>
    <el-table-column fixed prop="temperature" label="温度" width="120px"></el-table-column>
    <el-table-column fixed prop="createTime" label="创建时间" width="220px"></el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-button type="text" size="small" @click="deleteTemperature(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "_axios@0.21.1@axios";
import echarts from "_echarts@4.9.0@echarts";

export default {
  name: "dataDetail", data() {
    return {
      msg: "数据详情展示",
      currentTemperature: 0,
      tableData: [
        {
          id: '',
          temperature: '',
          createTime: '',
        },
      ]
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    getTemperature: function () {
      const _this = this;
      axios.get("http://127.0.0.1:8000/api/temperature").then(function (response) {
        _this.tableData = response.data

        let times = Array()
        let temperatures = Array()
        for (let i in response.data) {
          times.push(response.data[i].createTime)
          temperatures.push(response.data[i].temperature)
        }
        _this.currentTemperature = temperatures[response.data.length - 1]
        let myChart = echarts.init(document.getElementById('main'));
        let option = {
          title: {
            text: '温度变化曲线',
          },
          tooltip: {},
          legend: {
            data: ['温度']
          },
          xAxis: {
            data: times
          },
          yAxis: {},
          series: [{
            name: '温度',
            type: 'line',
            data: temperatures
          }]
        };
        myChart.setOption(option);
      })
    },
    deleteTemperature: function (row) {
      const _this = this
      // eslint-disable-next-line no-unused-vars
      axios.delete("http://127.0.0.1:8000/api/temperature/" + row.id).then(function (response) {
        _this.alert(row.cname + '删除成功', 'success', {
          // eslint-disable-next-line no-unused-vars
          callback: action => {
            window.local.reload();
            _this.getTemperature();
          }
        })
      })
    },
  },
  created() {
    this.getTemperature()
  }
}
</script>

<style scoped>

</style>