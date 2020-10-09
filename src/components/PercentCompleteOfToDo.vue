<template>
  <div>
    <el-button type="primary" plain @click="weekData" size="mini" class="navBtn"
      >周</el-button
    >
    <el-button
      type="primary"
      plain
      @click="monthData"
      size="mini"
      class="navBtn"
      >月</el-button
    >
    <el-button type="primary" plain @click="yearData" size="mini" class="navBtn"
      >年</el-button
    >
    <div class="block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd"
        value-format="yyyy-M-d"
        @change="switchNavDate"
        :picker-options="{ firstDayOfWeek: 1 }"
      >
      </el-date-picker>
    </div>
    <ve-pie :data="chartData"></ve-pie>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartData: {
        columns: ["item", "num"],
        rows: this.$store.getters.percentCompleteOfToDo
      },
      navigation: ""
    };
  },
  beforeCreate() {
    this.$store.commit("getDaysOfNavWeek");
    this.$store.commit("getPercentCompleteItems");
  },
  computed: {
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        this.$store.commit("updateDate", value);
      }
    }
  },
  methods: {
    switchNavDate() {
      if (this.navigation == "month") {
        this.monthData();
      } else if (this.navigation == "year") {
        this.yearData();
      } else {
        this.weekData();
      }
      this.navigation = "";
    },
    weekData() {
      this.navigation = "week";
      this.$store.commit("getDaysOfNavWeek");
      this.$store.commit("getPercentCompleteItems");
      this.chartData["rows"] = this.$store.getters.percentCompleteOfToDo;
    },
    monthData() {
      this.navigation = "month";
      this.$store.commit("getPercentCompleteItems", "month");
      this.chartData["rows"] = this.$store.getters.percentCompleteOfToDo;
    },
    yearData() {
      this.navigation = "year";
      this.$store.commit("getPercentCompleteItems", "year");
      this.chartData["rows"] = this.$store.getters.percentCompleteOfToDo;
    }
  }
};
</script>
<style lang="scss" scoped>
.navBtn {
  padding: 5px;
  font-size: 15px;
}
</style>
