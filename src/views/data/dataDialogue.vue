<template>
  <h1>{{ msg }}</h1>
  <button @click="getTemperature">test</button>
</template>

<script>
import axios from "axios";

export default {
  name: "dataDialogue",
  data() {
    return {
      msg: "数据图表展示"
    }
  },
  methods: {
    getTemperature: function () {
      // const _this = this;
    axios.get("http://127.0.0.1:8000/api/temperature").then(function (response) {
        console.log(response)
    })
    }
  }
}
</script>

<style scoped>

</style>