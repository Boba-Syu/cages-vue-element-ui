<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template #title><i class="el-icon-s-data"></i>数据展示</template>
          <el-menu-item-group title="数据展示">
            <!--            <el-menu-item index="1-1" @click="routerTo('data_dialogue')">图表展示</el-menu-item>-->
            <el-menu-item index="1-2" @click="routerTo('data_detail', '数据详情展示')">数据图表展示</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="摄像头">
            <el-menu-item index="1-3" @click="routerTo('camera', '摄像头展示')">查看摄像头</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template #title><i class="el-icon-setting"></i>指令操作</template>
          <el-menu-item-group>
            <template #title>操作指令</template>
            <el-menu-item index="2-2" @click="routerTo('instruction_detail', '操作指令记录')">操作指令记录</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: left; font-size: 20px">
        {{ msg }}
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      msg: '主页',
    }
  },
  methods: {
    routerTo: function (routerPath, msg) {
      this.msg = msg
      this.$router.push({
        path: routerPath
      })
    }
  },
  created() {
    this.routerTo('data_detail', '数据详情展示')
  }
}
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
