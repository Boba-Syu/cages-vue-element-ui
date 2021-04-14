<template>
  <img style="-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 25%);width: 640px;height: 480px"
       src="http://192.168.199.153:8081/">
  <br>
  <el-button type="primary" @click="setMotion('OPEN_MOTION')" round>打开摄像头</el-button>
  <el-button type="danger" @click="setMotion('CLOSE_MOTION')" round>关闭摄像头</el-button>
</template>

<script>
import axios from "axios";

export default {
  name: "camera",
  data() {
    return {
      msg: "查看摄像头"
    }
  },
  methods: {
    setMotion: function (task) {
      let _this = this
      axios.get("http://81.68.230.143:8000/api/instruction/" + task).then(function (response) {
        if (response.data === 1) {
          console.log('操作成功...')
          setTimeout(()=>location.reload(), 500)
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
    }
  }
}
</script>

<style scoped>

</style>