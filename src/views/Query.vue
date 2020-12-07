<template>
  <el-row>
    <el-row :gutter="24" style="height: auto">
      <el-col :span="5" :offset="2">
        <el-input
            placeholder="请输入航班号"
            v-model="input"
            clearable>
        </el-input>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button type="primary" @click="query()">查询</el-button>
      </el-col>
    </el-row>
    <el-row
        style="height: 100%; background: rgba(219,219,219,0.58); box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);border-radius: 30px; text-align: center">
      <el-table v-loading="loading" v-show="show" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                style="width: 100% ;height: 100%;overflow: auto">
        <el-table-column prop="carrier" label="航空公司" width="300"></el-table-column>
        <el-table-column prop="depAirport" label="始发机场" width="300"></el-table-column>
        <el-table-column prop="arrAirport" label="到达机场" width="300"></el-table-column>
        <el-table-column prop="date" label="日期" width="150"></el-table-column>
        <el-table-column prop="flightNum" label="航班号" width="100"></el-table-column>
        <el-table-column prop="dep" label="预计起飞时间" width="100"></el-table-column>
        <el-table-column prop="depDelay" label="起飞延误" width="100"></el-table-column>
        <el-table-column prop="arr" label="预计降落时间" width="100"></el-table-column>
        <el-table-column prop="arrDelay" label="降落延误" width="100"></el-table-column>
        <el-table-column prop="cancelled" label="是否取消" width="100"></el-table-column>
      </el-table>
    </el-row>
    <el-pagination v-show="show"
                   align='center'
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[10,20,30,40]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="tableData.length">
    </el-pagination>
  </el-row>
</template>

<script>
export default {
  name: "query",
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      show: false,
      loading: false,
      input: '',
      tableData: []
    }
  },
  methods: {
    query() {
      this.show = true;
      this.loading = true;
      this.$http.get(this.$website + "/main/query/" + this.input).then(resp => {

        this.tableData = resp.data;
        this.loading = false;
      })
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
</script>

<style scoped>

</style>