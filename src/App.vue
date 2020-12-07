<template>
  <div id="app" style="border: none; margin: fill" >
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link> |-->
    <!--      <router-link to="/about">About</router-link> |-->
    <!--      <router-link to="/graph">Graph</router-link>-->
    <!--    </div>-->

    <el-header style="background-color: #545c64; color: #ffd04b; text-align: left; line-height: 60px;text-emphasis-color: #ffd04b">航班信息可视化</el-header>
    <el-container style="height: 100%; border: 0 solid #545c64;">
      <el-aside style="background-color: #545c64; width: 10%">
        <el-menu :default-active="this.$route.path" router mode="vertical" class="el-menu-demo"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item v-for="(item, index) in list" :key="index" :index="item.path">
            <template slot="title">{{ item.name }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color: #E9EEF3; color: #333; text-align: center; line-height: 160px; height: auto">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a {
  color: #42b983;
}
</style>

<script>
export default {
  data() {
    return {
      list: [
        {path: "/details", name: "基础信息"},
        {path: "/globe", name: "航线可视化"},
        {path: "/query", name: "查询"}
      ]
    };
  },

}
</script>
