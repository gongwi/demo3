<template>
  <div>
    <el-button type="primary" plain @click="monthData" size="mini" class="navBtn">月</el-button>
    <el-button type="primary" plain @click="yearData" size="mini" class="navBtn">年</el-button>
    <div class="block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd"
        value-format="yyyy-M-d"
        @change="switchNavDate"
        :picker-options="{'firstDayOfWeek': 1}"
      >
      </el-date-picker>
    </div>
    <ve-histogram
      :data="chartData"
      :extend="chartExtend"
      :data-zoom="dataZoom"
      :settings="chartSettings"
      :xAxis="xAxis"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  data() {
    this.chartSettings = {
      stack: { 习惯: ["完成周数", "未完成周数"] }
    };
    this.dataZoom = [
      {
        start: 0,
        end: 50,
        type: "inside"
      },
      {
        start: 0
      }
    ];
    this.xAxis = {
      data: this.$store.getters.habitsPercentCompleteXAxis
    };
    this.chartExtend = {
      series: {
        barMaxWidth: 40
      }
    };
    return {
      chartData: {
        columns: ["习惯", "完成周数", "未完成周数"],
        rows: this.$store.getters.percentCompleteOfHabitsRows
      },
      navigation: '',
    };
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
  beforeCreate() {
    this.$store.commit("getPercentCompleteOfHabitsForMonth");
  },
  created() {
    this.xAxis['data'] = this.$store.getters.habitsPercentCompleteXAxis
  },
  methods: {
    switchNavDate() {
      if (this.navigation == 'year') {
        this.yearData()
      }else {
        this.monthData()
      }
      this.navigation = ''
    },
    monthData() {
      this.navigation = 'month';
      this.$store.commit("getPercentCompleteOfHabitsForMonth");  
      this.chartData['rows'] = this.$store.getters.percentCompleteOfHabitsRows;
      this.xAxis['data'] = this.$store.getters.habitsPercentCompleteXAxis
    },
    yearData() {
      this.navigation = 'year';
      this.$store.commit("getPercentCompleteOfHabitsForYear");  
      this.chartData['rows'] = this.$store.getters.percentCompleteOfHabitsRows;
      this.xAxis['data'] = this.$store.getters.habitsPercentCompleteXAxis
    },
  },
};
</script>
<style lang="scss" scoped>
.navBtn {
  padding: 5px;
  font-size: 15px;
}

</style>