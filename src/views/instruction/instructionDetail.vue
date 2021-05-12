<template>
  <el-row :gutter="20">
    <el-col :span="12">
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
    <el-col :span="4">
      <h3>执行操作：</h3>
      <div>
        <el-button type="primary" @click="setMotion('OPEN_MOTION')" round>打开摄像头</el-button>
        <el-button type="primary" @click="setMotion('CLOSE_MOTION')" round>关闭摄像头</el-button>
        <br>
        <br>
        <el-button type="success" @click="setMotion('FEED')" round>投喂食物</el-button>
        <el-button type="success" @click="setMotion('FEED_OFF')" round>停止喂食</el-button>
        <br>
        <br>
        <el-button type="warning" @click="setMotion('HEAT_UP')" round>打开风扇</el-button>
        <el-button type="warning" @click="setMotion('HEAT_DOWN')" round>关闭风扇</el-button>
        <br>
      </div>
    </el-col>
  </el-row>
  <br>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-table :data="timing_task_list" border style="width: 600px;height: 400px;"
                  :row-class-name="tableRowClassName" height="250">
          <el-table-column fixed prop="id" label="编号" width="40px"></el-table-column>
          <el-table-column fixed prop="timingTaskType" label="定时任务类型" width="100px"></el-table-column>
          <el-table-column fixed prop="operationType" label="操作类型" width="100px"></el-table-column>
          <el-table-column fixed prop="msg" label="详情信息" width="80px"></el-table-column>
          <el-table-column fixed prop="createTime" label="创建时间" width="200px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="60px">
            <template #default="scope">
              <el-button type="text" size="small" @click="deleteMsg(scope.row, 'operation')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="8" style="border-style:solid;border-width:1px;border-color: #B3C0D1">
      <div>
        <h2>新增定时任务</h2>
        <h1>操作类型选择：</h1>
        <div>
          <el-radio v-model="task.operationType" label="3">喂食</el-radio>
          <el-radio v-model="task.operationType" label="6">停止喂食</el-radio>
          <el-radio v-model="task.operationType" label="4">打开摄像头</el-radio>
          <el-radio v-model="task.operationType" label="5">关闭摄像头</el-radio>
        </div>
        <h1>定时任务类型选择：</h1>
        <div>
          <el-radio v-model="task.timingTaskType" label="3">一次性任务</el-radio>
          <el-radio v-model="task.timingTaskType" label="6">每日任务</el-radio>
          <el-radio v-model="task.timingTaskType" label="4">每周任务</el-radio>
        </div>
      </div>
      <h1>执行时间设置：</h1>
      <input type="datetime-local" step="01" v-model="task.createTime" :name="task.timingTaskType"/>
      <button @click="addTask">确定</button>
      <h1>详情信息: </h1>
      <el-input v-model="task.msg"></el-input>
      <br>
    </el-col>
  </el-row>
</template>

<script>
const axios = require("axios");
export default {
  name: "instructionDetail",
  data() {
    return {
      msg: "操作指令记录",
      operation_list: [{
        id: '',
        operationType: '',
        createTime: '',
      }],
      timing_task_list: [{
        id: '',
        timingTaskType: '',
        operationType: '',
        msg: '',
        createTime: ''
      }],
      task: {
        id: '',
        timingTaskType: '',
        operationType: '',
        msg: '',
        createTime: ''
      }
    }
  },
  methods: {
    deleteMsg: function (row, msg) {
      const _this = this
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
    operation_init: function () {
      let _this = this
      axios.get("http://81.68.230.143:8000/api/operation").then(function (response) {
        _this.operation_list = response.data;
        _this.checkOperationType(_this.operation_list)
      })
    },
    timingTaskList: function () {
      const _this = this
      axios.get("http://81.68.230.143:8000/api/timing_task").then(function (response) {
        _this.checkOperationType(response.data)
        _this.timing_task_list = response.data
        for (let i in _this.timing_task_list) {
          _this.timing_task_list[i].timingTaskType = _this.checkTimingTaskType(_this.timing_task_list[i].timingTaskType)
        }
      })
    },
    checkOperationType: function (msg) {
      let type = ['加温', '降温', '喂食', '打开摄像头', '关闭摄像头', '停止喂食']
      for (let i in msg) {
        switch (msg[i].operationType) {
          case 1:
            msg[i].operationType = type[0]
            break
          case 2:
            msg[i].operationType = type[1]
            break
          case 3:
            msg[i].operationType = type[2]
            break
          case 4:
            msg[i].operationType = type[3]
            break
          case 5:
            msg[i].operationType = type[4]
            break
          case 6:
            msg[i].operationType = type[5]
            break
        }
      }
    },
    checkTimingTaskType(msg) {
      switch (msg) {
        case 1:
          return "一次性任务"
        case 2:
          return "每日任务"
        case 3:
          return "每周任务"
        default :
          return msg
      }
    },
    addTask: function () {
      console.log(this.task)
      const _this = this
      axios.put("http://81.68.230.143:8000/api/timing_task", _this.task).then(function (response) {
        if (response.data == 'success') {
          _this.alert('添加成功', 'success', {
            // eslint-disable-next-line no-unused-vars
            callback: action => {
              window.local.reload();
            }
          })
        } else {
          _this.alert('添加成功', 'success', {
            // eslint-disable-next-line no-unused-vars
            callback: action => {
              window.local.reload();
            }
          })
        }
      })
    },
    setMotion: function (task) {
      let _this = this
      axios.get("http://81.68.230.143:8000/api/instruction/" + task).then(function (response) {
        if (response.data === 1) {
          console.log('操作成功...')
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
  },
  created() {
    this.operation_init()
    this.timingTaskList()
  }
}
</script>

<style scoped>

</style>