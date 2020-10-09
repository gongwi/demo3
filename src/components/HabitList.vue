<template>
  <div>
    <div class="container">
      <div class="block">
        <el-date-picker
          v-model="date"
          type="week"
          format="yyyy 第 WW 周"
          value-format="yyyy-M-d"
          placeholder="选择周"
          @change="showHabits"
        >
        </el-date-picker>
      </div>
    </div>
    <el-table
      :data="habitTable"
      style="width: 100%"
      max-height="450"
      size="mini"
    >
      <el-table-column fixed label="待办" prop="habit" width="150">
        <template slot-scope="scope">
          <span
            v-if="scope.row.show"
            style="width: 90%"
            @click="editHabit(scope.$index)"
            >{{ scope.row.habit }}</span
          >
          <el-input
            autosize
            v-model="scope.row.habit"
            v-else
            style="width: 90%"
            clearable
            ref="editHabit"
            @keyup.enter.native="saveEdit(scope.$index)"
            @blur="saveEdit(scope.$index)"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="Mon." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[0]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[0]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Tue." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[1]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[1]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Wed." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[2]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[2]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Thur." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[3]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[3]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Fri." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[4]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[4]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Sat." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[5]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[5]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Sun." width="80">
        <template slot-scope="scope">
          <el-checkbox disabled v-if="scope.row.disabled[6]"></el-checkbox>
          <el-checkbox
            size="medium"
            v-model="scope.row.checked[6]"
            v-else
            @change="
              habitDone({
                index: scope.$index,
                disabled: scope.row.disabled,
                checked: scope.row.checked,
                times: scope.row.times
              })
            "
          ></el-checkbox>
        </template>
      </el-table-column>

      <!-- 计数器 -->
      <el-table-column label="频率" width="100">
        <template slot-scope="scope">
          <el-input-number
            class="inputNumber"
            size="mini"
            :min="1"
            :max="7"
            v-model="scope.row.times"
            @change="
              setTimes({
                index: scope.$index,
                habitTable: habitTable,
                times: scope.row.times
              })
            "
          ></el-input-number>
        </template>
      </el-table-column>

      <!-- 移除 -->
      <el-table-column label="操作" width="100" class="remove">
        <template slot-scope="scope">
          <el-button @click="deleteRow(scope.$index)" type="text" size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 标签 -->
    <el-tag
      :key="tag"
      v-for="tag in habitList"
      closable
      :disable-transitions="false"
      @close="delHabitLabel(tag)"
      @click="pickHabit(tag)"
    >
      <el-button size="small" class="tagText">{{ tag }}</el-button>
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="saveHabitLabel"
      @blur="saveHabitLabel"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="addNewHabitLabel"
      >+ New Habit</el-button
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

export default {
  computed: {
    ...mapState([
      "habitTable",
      "habitDates",
      "habitList",
      "inputVisible",
      "inputValue",
      "firstDayOfWeekCST"
    ]),
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        this.$store.commit("updateDate", value);
      }
    },
    inputValue: {
      get() {
        return this.$store.state.inputValue;
      },
      set(value) {
        this.$store.commit("saveInputValue", value);
      }
    }
  },
  mounted() {
    this.$store.commit("getFirstDayOfWeekCST", new Date());
    this.$store.commit("convertCST", this.firstDayOfWeekCST);
    this.showHabits();
  },
  methods: {
    ...mapMutations([
      "showHabits",
      "setTimes",
      "saveEdit",
      "deleteRow",
      "editHabit",
      "habitDone",
      "pickHabit",
      "delHabitLabel",
      "saveHabitLabel"
    ]),
    addNewHabitLabel() {
      this.$store.commit("addNewHabitLabel");
      this.$nextTick(function() {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    pickHabit(tag) {
      for (let index = 0; index < this.habitTable.length; index++) {
        const habitRow = this.habitTable[index];
        var habits = [];
        habits.push(habitRow.habit);
      }
      if (habits.includes(tag, 0)) {
        this.$message({
          type: "info",
          message: "该事项已存在"
        });
      } else {
        this.$store.commit("pickHabit", tag);
      }
      if (!this.habitDates.includes(this.date, 0)) {
        this.$store.commit("addNewTable");
      }
    },
    editHabit(index) {
      this.$store.commit("editHabit", index);
      this.$nextTick(function() {
        this.$refs.editHabit.$refs.input.focus();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: auto;
  margin-left: 10px;
  vertical-align: bottom;
}
.tagText {
  padding: 0;
  width: auto;
  background-color: transparent;
  border-style: none;
  
}
.el-button {
  outline: none;
}
.inputNumber {
  width: 85px;
}
.el-checkbox {
  width: 50px;
  color: red;
  border-color: blue;
}

</style>
