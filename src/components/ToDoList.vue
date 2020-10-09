<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="block">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-M-d"
              @change="pickDayCards"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input
            v-model="inputValue"
            @keyup.enter.native="onKeyPress"
            ref="input"
            placeholder="添加待办事项/时长"
            @blur="cancelChoseCard"
            @focus="choseCard"
          ></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-button type="button" @click="addNewCard" class="addNewCard"
            >添加待办卡片</el-button
          >
        </div>
      </el-col>
    </el-row>

    <div class="card-columns">
      <div
        class="card"
        v-for="(dayCard, dayCardsIndex) in dayCards"
        :key="dayCard.cardId"
        :class="dayCard.isChose ? 'is-chose' : ''"
      >
        <el-card>
          <div class="clearfix">
            <span>{{ dayCard.title }}</span>
            <el-popconfirm
              title="对应数据也将删除，确定删除吗？"
              @onConfirm="delCard(dayCardsIndex)"
            >
              <el-button
                slot="reference"
                size="mini"
                style="border:none; float: right; "
                >删除</el-button
              >
            </el-popconfirm>
            <el-button
              size="mini"
              class="addItem"
              @click="addItem(dayCardsIndex)"
              >添加待办</el-button
            >
          </div>
          <el-divider></el-divider>

          <div
            v-for="(item, contentIndex) in dayCard.cardList"
            :key="'key1' + item.itemId"
            class="text item showIcon"
          >
            <label class="card-text" v-if="!item.done">
              <el-checkbox
                size="medium"
                :checked="item.done"
                @change="
                  itemIsDone({
                    dayCardsIndex: dayCardsIndex,
                    contentIndex: contentIndex
                  })
                "
              ></el-checkbox>
              {{ item.item }}
            </label>
            <div style="float: right">
              <el-button
                size="mini"
                style="border:none"
                @click="
                  timerController({
                    dayCardsIndex: dayCardsIndex,
                    contentIndex: contentIndex
                  })
                "
                v-if="!item.done"
              >
                {{ item.timer }}
              </el-button>
              <el-popconfirm
                title="对应数据也将删除，确定删除吗？"
                @onConfirm="
                  delItem({
                    dayCardsIndex: dayCardsIndex,
                    contentIndex: contentIndex
                  })
                "
              >
                <el-button
                  slot="reference"
                  size="mini"
                  style="border:none"
                  v-if="!item.done"
                  >删除</el-button
                >
              </el-popconfirm>
            </div>
          </div>
          <el-divider content-position="left">已完成</el-divider>
          <div
            v-for="(item, contentIndex) in dayCard.cardList"
            :key="'key2' + item.itemId"
            class="showIcon"
          >
            <label
              class="card-text"
              :class="item.done ? 'is-done' : ''"
              v-if="item.done"
            >
              <el-checkbox
                disabled
                size="medium"
                :checked="item.done"
              ></el-checkbox>
              {{ item.item }}
            </label>
            <div style="float: right">
              <el-popconfirm
                title="对应数据也将删除，确定删除吗？"
                @onConfirm="
                  delItem({
                    dayCardsIndex: dayCardsIndex,
                    contentIndex: contentIndex
                  })
                "
              >
                <el-button
                  slot="reference"
                  size="mini"
                  style="border:none"
                  v-if="item.done"
                  >删除</el-button
                >
              </el-popconfirm>
              <el-button
                size="mini"
                style="border:none"
                v-if="item.done"
                @click="
                  reuseItem({
                    dayCardsIndex: dayCardsIndex,
                    contentIndex: contentIndex
                  })
                "
                >恢复</el-button
              >
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

export default {
  computed: {
    ...mapState([
      "dayCards",
      "dayCardsIndex",
      "toDoDates",
      "recordingTime",
      "redordingIndex"
    ]),
    inputValue: {
      get() {
        return this.$store.state.inputValue;
      },
      set(value) {
        this.$store.commit("saveInputValue", value);
      }
    },
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        this.$store.commit("updateDate", value);
      }
    }
  },

  mounted() {
    this.focusInput();
  },
  methods: {
    focusInput() {
      this.$refs.input.focus();
    },

    ...mapMutations([
      "delItem",
      "itemIsDone",
      "delCard",
      "reuseItem",
      "pickDayCards",
      "timerController",
      "cancelChoseCard",
      "choseCard"
    ]),

    onKeyPress() {
      if (this.inputValue == "") {
        this.$message({
          type: "info",
          message: "未输入内容"
        });
      } else {
        if (this.dayCardsIndex === "") {
          this.$message({
            type: "info",
            message: "未选择卡片"
          });
        } else {
          this.$store.commit("addItem", this.dayCardsIndex);
        }
      }
    },
    timerController(index) {
      var value = this.$store.state.inputValue;
      if (value == "") {
        if (this.recordingTime && index.contentIndex !== this.redordingIndex) {
          this.$message({
            type: "info",
            message: "一次专心做一件事效率更高欧"
          });
        } else {
          this.$store.commit("timerController", index);
        }
      } else if (value[2] == ":" && value[5] == ":" && value.length >= 8) {
        var item = this.$store.state.dayCards[index.dayCardsIndex].cardList[
          index.contentIndex
        ];
        var inputTime = this.$store.state.inputValue;
        var hours = parseInt(inputTime.split(":")[0]) * 3600;
        var minutes = parseInt(inputTime.split(":")[1]) * 60;
        var seconds = parseInt(inputTime.split(":")[2]);
        item.seconds += hours + minutes + seconds;

        var hour = Math.floor(item.seconds / 3600) + "";
        var minute = Math.floor((item.seconds - hour * 3600) / 60) + "";
        var second = item.seconds - hour * 3600 - minute * 60 + "";
        if (hour.length == 1 && minute.length == 1 && second.length == 1) {
          item.timer = "0" + hour + ":" + "0" + minute + ":" + "0" + second;
        } else if (hour.length == 1 && minute.length == 1) {
          item.timer = "0" + hour + ":" + "0" + minute + ":" + second;
        } else if (hour.length == 1) {
          item.timer = "0" + hour + ":" + minute + ":" + second;
        } else {
          item.timer = hour + ":" + minute + ":" + second;
        }
        this.$store.state.inputValue = "";
      } else {
        this.$message({
          type: "info",
          message: '请输入正确格式："00:00:00"'
        });
      }
    },
    addNewCard() {
      this.$prompt("请输入新的代办卡片名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.$store.commit("addNewCard", value);
        if (!this.toDoDates.includes(this.date, 0)) {
          this.$store.commit("addNewDay");
        }
      });
    },
    addItem(dayCardsIndex) {
      if (this.inputValue == "") {
        this.$message({
          type: "info",
          message: "未输入内容"
        });
      } else {
        this.$store.commit("addItem", dayCardsIndex);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.is-done {
  text-decoration: line-through;
  color: rgba(177, 163, 145, 0.76);
}
.is-chose {
  border-color: #1989fa;
}

.el-button {
  outline: none;
  padding: 5px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.addItem {
  float: right;
  border: none;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.text {
  font-size: 14px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.card-text {
  width: 165px;
  padding: 0;
}
.card-text:hover {
  background-color: #e6f2f2;
}
.el-checkbox {
  padding-right: 10px;
}
.addNewCard {
  margin-left: 10px;
  padding: 12px 20px;
}
.card :hover {
  border-color: #1989fa;
}
</style>
