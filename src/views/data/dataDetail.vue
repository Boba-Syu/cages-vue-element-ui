<template>
  <!--    <h1 style="color:red;font-size: 30px">当前温度: {{ currentTemperature }}℃</h1>
      <br>-->

  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <div id="current-temp" style="width: 420px;height:420px;float: left"></div>
      </div>
    </el-col>
    <el-col :span="10">
      <div class="grid-content bg-purple">
        <div id="temp" style="width: 620px;height:420px;float: left"></div>
      </div>
    </el-col>
    <el-col :span=8>
      <div class="grid-content bg-purple">
        <div>
          <img src="http://192.168.199.153:8081/">
          <el-button type="primary" @click="setMotion('OPEN_MOTION')" plain style="width: 260px">打开摄像头</el-button>
          <el-button type="danger" @click="setMotion('CLOSE_MOTION')" plain style="width: 260px">关闭摄像头</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <br>
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <div id="operation" style="width: 420px;height:420px;float: left"></div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-table :data="temp" border style="width: 600px;height: 400px;" :row-class-name="tableRowClassName"
                  height="250">
          <el-table-column fixed prop="id" label="编号" width="120px"></el-table-column>
          <el-table-column fixed prop="temperature" label="温度" width="120px"></el-table-column>
          <el-table-column fixed prop="createTime" label="创建时间" width="220px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button type="text" size="small" @click="deleteMsg(scope.row, 'temperature')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-table :data="operation_list" border style="width: 600px;height: 400px;" :row-class-name="tableRowClassName"
                  height="250">
          <el-table-column fixed prop="id" label="编号" width="120px"></el-table-column>
          <el-table-column fixed prop="operationType" label="操作类型" width="120px"></el-table-column>
          <el-table-column fixed prop="createTime" label="创建时间" width="220px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button type="text" size="small" @click="deleteMsg(scope.row, 'operation')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>


</template>

<script>
import axios from "_axios@0.21.1@axios";
import echarts from "_echarts@4.9.0@echarts";

export default {
  name: "dataDetail", data() {
    return {
      msg: "数据详情展示",
      currentTemperature: 0,
      temp: [
        {
          id: '',
          temperature: '',
          createTime: '',
        },
      ],
      operation_list: [
        {
          id: '',
          operationType: '',
          createTime: '',
        }
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
      axios.get("http://81.68.230.143:8000/api/temperature").then(function (response) {
        _this.temp = response.data.slice(response.data.length - 100, response.data.length)

        let times = Array()
        let temperatures = Array()
        for (let i in response.data) {
          times.push(response.data[i].createTime)
          temperatures.push(response.data[i].temperature)
        }
        _this.currentTemperature = temperatures[response.data.length - 1]
        let tempChart = echarts.init(document.getElementById('temp'));
        let temp_option = {
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
        tempChart.setOption(temp_option);

        let currentTemChart = echarts.init(document.getElementById('current-temp'));
        let current_temp_option = {
          series: [
            {
              name: '温度',
              type: 'gauge',
              detail: {formatter: '{value}℃'},
              data: [{value: _this.currentTemperature, name: '摄氏度'}]
            }
          ]
        };
        current_temp_option.series[0].data[0].value = _this.currentTemperature;
        currentTemChart.setOption(current_temp_option, true);
      })
    },
    deleteMsg: function (row, msg) {
      const _this = this
      console.log(row, msg)
      // eslint-disable-next-line no-unused-vars
      axios.delete("http://81.68.230.143:8000/api/" + msg + "/" + row.id).then(function (response) {
        _this.alert(row.cname + '删除成功', 'success', {
          // eslint-disable-next-line no-unused-vars
          callback: action => {
            window.local.reload();
            _this.getTemperature();
          }
        })
      })
    },
    setMotion: function (task) {
      let _this = this
      axios.get("http://81.68.230.143:8000/api/instruction/" + task).then(function (response) {
        if (response.data === 1) {
          console.log('操作成功...')
          setTimeout(() => location.reload(), 500)
        } else {
          _this.$alert('请检查设备', '操作失败', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              });
            }
          })
        }
      })
    },
    operationList() {
      let _this = this
      axios.get("http://81.68.230.143:8000/api/operation").then(function (response) {
        _this.operation_list = response.data;
        let type = ['加温', '降温', '喂食', '打开摄像头', '关闭摄像头', '停止喂食']
        let list = [0, 0, 0, 0]
        for (let i in _this.operation_list) {
          switch (_this.operation_list[i].operationType) {
            case 1:
              _this.operation_list[i].operationType = type[0]
              break
            case 2:
              _this.operation_list[i].operationType = type[1]
              list[0]++
              break
            case 3:
              _this.operation_list[i].operationType = type[2]
              list[1]++
              break
            case 4:
              _this.operation_list[i].operationType = type[3]
              list[2]++
              break
            case 5:
              _this.operation_list[i].operationType = type[4]
              list[3]++
              break
            case 6:
              _this.operation_list[i].operationType = type[5]
              list[3]++
              break
          }
        }
        let operation_option = {
          title: {
            text: '指令操作',
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['降温', '喂食', '打开摄像头', '关闭摄像头'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: list
            }
          ]
        }
        let operationChart = echarts.init(document.getElementById('operation'));
        operationChart.setOption(operation_option, true)
      })
    }
  },
  created() {
    this.getTemperature()
    this.operationList()
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.getTemperature()
      }, 10000)
    }
  }
}
</script>

<style scoped>
img {
  -webkit-user-select: none;
  margin: auto;
  background-color: hsl(0, 0%, 25%);
  width: 533px;
  height: 400px;
  float: left
}
</style>