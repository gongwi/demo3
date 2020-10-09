<template>
  <div>
    <el-button type="primary" plain @click="dayData" size="mini" class="navBtn"
      >日</el-button
    >
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

    <ve-histogram
      :data="chartData"
      :extend="chartExtend"
      :data-zoom="dataZoom"
      :xAxis="xAxis"
      :tooltip="tooltip"
      :legend-visible="false"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  data() {
    this.tooltip = {
      trigger: "item",
      // formatter: '{c}'
      formatter: function(params) {
        // console.log(params)
        var hour = Math.floor(params.value / 3600) + "";
        var minute = Math.floor((params.value - hour * 3600) / 60) + "";
        var second = params.value - hour * 3600 - minute * 60 + "";
        if (hour.length == 1 && minute.length == 1 && second.length == 1) {
          return (
            params.name +
            " 时长：" +
            "0" +
            hour +
            ":" +
            "0" +
            minute +
            ":" +
            "0" +
            second
          );
        } else if (hour.length == 1 && minute.length == 1) {
          return (
            params.name +
            " 时长：" +
            "0" +
            hour +
            ":" +
            "0" +
            minute +
            ":" +
            second
          );
        } else if (hour.length == 1) {
          return (
            params.name + " 时长：" + "0" + hour + ":" + minute + ":" + second
          );
        }
        return params.name + " 时长：" + hour + ":" + minute + ":" + second;
      }
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
      data: this.$store.getters.toDoTimeXAxisForDay
    };
    this.chartExtend = {
      series: {
        barMaxWidth: 40
      }
    };
    return {
      chartData: {
        columns: ["item", "num"],
        rows: this.$store.getters.toDoTimeRowsForDay
      },
      navigation: ""
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
    this.$store.commit("getToDoItems");
    this.$store.commit("getDay");
    this.$store.commit("getCountTimeItems");
  },
  created() {
    this.xAxis["data"] = this.$store.getters.toDoTimeXAxisForDay;
  },
  methods: {
    switchNavDate() {
      if (this.navigation == "week") {
        this.weekData();
      } else if (this.navigation == "month") {
        this.monthData();
      } else if (this.navigation == "year") {
        this.yearData();
      } else {
        this.dayData();
      }
      this.navigation = "";
    },

    dayData() {
      //每日
      this.navigation = "day";
      this.$store.commit("getCountTimeItems"); // 得到日items
      this.chartData["rows"] = this.$store.getters.toDoTimeRowsForDay;
      this.xAxis["data"] = this.$store.getters.toDoTimeXAxisForDay;
    },
    weekData() {
      //每周
      this.navigation = "week";
      this.$store.commit("getDaysOfNavWeek");
      this.$store.commit("getCountTimeItems", "week"); // 得到周items
      this.chartData["rows"] = this.$store.getters.toDoTimeRowsForWeek;
      this.xAxis["data"] = this.$store.getters.toDoTimeXAxisForWeek;
    },
    monthData() {
      // 每月
      this.navigation = "month";
      this.$store.commit("getCountTimeItems", "month"); // 得到月items
      this.chartData["rows"] = this.$store.getters.toDoTimeRowsForMonth;
      this.xAxis["data"] = this.$store.getters.toDoTimeXAxisForMonth;
    },
    yearData() {
      // 每年
      this.navigation = "year";
      this.$store.commit("getCountTimeItems", "year"); // 得到年items
      this.chartData["rows"] = this.$store.getters.toDoTimeRowsForYear;
      this.xAxis["data"] = this.$store.getters.toDoTimeXAxisForYear;
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
