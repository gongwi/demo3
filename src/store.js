import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    date: "",
    inputValue: "",
    dayCardsIndex: "",
    newCardId: 0,
    inputValueId: 0,
    dayCards: [],
    toDoDates: [
      "2020-9-30",
      "2020-10-9",
      "2020-10-10",
      "2020-10-11",
      "2020-10-12",
      "2020-10-13",
      "2020-10-14",
      "2020-10-15",
      "2020-10-16",
      "2020-10-17",
      "2020-10-18",
      "2020-10-19",
      "2020-10-20",
    ],
    allCards: [],

    // weekhabit
    habitTable: [],
    habitDates: [
      "2020-8-31",
      "2020-9-7",
      "2020-9-14",
      "2020-9-21",
      "2020-9-28",
      "2020-10-5",
      "2020-10-12",
      "2020-10-19",
      "2020-10-26",
      "2020-11-2",
    ],
    habitTables: [],
    habitList: [
      "早起（7点）",
      "早睡（11点放下手机）",
      "写日记",
      "阅读",
      "计划明日",
      "运动",
      "记账"
    ],
    inputVisible: false,
    allUniqueItems: [],
    allItems: [],
    doneItems: [],
    undoneItems: [],
    chartDataArry: {
      item: "",
      num: 0
    },
    histogramArray: {
      习惯: "",
      完成周数: 0,
      未完成周数: 0
    },
    ///to do pie
    rows: [],

    //计时器
    timer: "开始计时",
    runTimer: null,
    items: [],
    uniqueItems: [],
    daysOfNavWeek: [],
    navYear: "",
    convertedDate: "",
    firstDayOfWeek: "",
    firstDayOfWeekCST: "",
    navYearAndMonth: [],
    recordingTime: false,
    redordingIndex: ""
  },
  mutations: {
    //for public .vue//
    //save changing of date-picker
    updateDate(state, date) {
      state.date = date;
    },
    //get current date for ToDoList and CountTimeForToDo
    getDay(state) {
      var standardDate = new Date();
      var y = standardDate.getFullYear();
      var m = standardDate.getMonth() + 1;
      var d = standardDate.getDate();
      state.date = y + "-" + m + "-" + d;
    },
    saveInputValue(state, inputValue) {
      state.inputValue = inputValue;
    },

    //for particular .vue//

    //ToDoList//
    ///sort date for addNewDay
    sortDate0(state, value) {
      if (value.currentDate == state.date) {
        value.dataList.push({ dayCards: value.currentData });
      } else {
        value.dataList.push({ habitTable: value.currentData });
      }
      value.dateList.push(value.currentDate);
    },
    sortDate00(state, value) {
      if (value.currentDate == state.date) {
        value.dataList.splice(0, 0, { dayCards: value.currentData });
      } else {
        value.dataList.splice(0, 0, { habitTable: value.currentData });
      }
      value.dateList.splice(0, 0, value.currentDate);
    },
    sortDate000(state, value) {
      if (value.dateList.length == 0) {
        this.commit("sortDate0", value);
      } else if (value.dateList.length == 1) {
        if (new Date(value.currentDate) > new Date(value.dateList[0])) {
          this.commit("sortDate0", value);
        } else {
          this.commit("sortDate00", value);
        }
      } else {
        var length = value.dateList.length;
        if (new Date(value.currentDate) < new Date(value.dateList[0])) {
          this.commit("sortDate00", value);
        } else if (
          new Date(value.currentDate) > new Date(value.dateList[length - 1])
        ) {
          this.commit("sortDate0", value);
        } else {
          for (let index = 0; index < length; index++) {
            if (new Date(value.currentDate) < new Date(value.dateList[index])) {
              value.dateList.splice(index, 0, value.currentDate);
              if (value.currentDate == state.date) {
                value.dataList.splice(index, 0, {
                  dayCards: value.currentData
                });
              } else {
                value.dataList.splice(index, 0, {
                  habitTable: value.currentData
                });
              }
            }
          }
        }
      }
    },
    //if the date is not in the dates, then addNewDay
    addNewDay(state) {
      //按顺序插入date
      this.commit("sortDate000", {
        dateList: state.toDoDates,
        currentDate: state.date,
        dataList: state.allCards,
        currentData: state.dayCards,
        aa: "dayCards"
      });
    },

    //filter and show cards according to the date
    pickDayCards(state) {
      state.dayCards = [];
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoDate = state.toDoDates[index];
        if (toDoDate == state.date) {
          state.dayCards = state.allCards[index]["dayCards"];
          for (let index = 0; index < state.dayCards.length; index++) {
            const cardList = state.dayCards[index]["cardList"];
            for (let index = 0; index < cardList.length; index++) {
              const item = cardList[index];
              if (item.seconds !== 0) {
                var day = Math.floor(item.seconds / (24 * 3600));
                var hour =
                  Math.floor((item.seconds - day * 24 * 3600) / 3600) + "";
                var minute =
                  Math.floor(
                    (item.seconds - day * 24 * 3600 - hour * 3600) / 60
                  ) + "";
                var second =
                  item.seconds -
                  day * 24 * 3600 -
                  hour * 3600 -
                  minute * 60 +
                  "";
                if (
                  hour.length == 1 &&
                  minute.length == 1 &&
                  second.length == 1
                ) {
                  item.timer =
                    "0" + hour + ":" + "0" + minute + ":" + "0" + second;
                } else if (hour.length == 1 && minute.length == 1) {
                  item.timer = "0" + hour + ":" + "0" + minute + ":" + second;
                } else if (hour.length == 1) {
                  item.timer = "0" + hour + ":" + minute + ":" + second;
                } else {
                  item.timer = hour + ":" + minute + ":" + second;
                }
              }
            }
          }
        }
      }
    },
    addNewCard(state, value) {
      state.dayCards.push({
        title: value,
        cardId: state.newCardId,
        isChose: false,
        cardList: []
      });
      state.newCardId++;
    },

    delCard(state, dayCardsIndex) {
      state.dayCards.splice(dayCardsIndex, 1);
      if (state.dayCards.length == 0) {
        for (let index = 0; index < state.toDoDates.length; index++) {
          const element = state.toDoDates[index];
          if (state.date == element) {
            state.toDoDates.splice(index, 1);
            state.allCards.splice(index, 1);
          }
        }
      }
    },
    //add item for cards
    addItem(state, dayCardsIndex) {
      state.dayCards[dayCardsIndex].cardList.push({
        item: state.inputValue,
        done: false,
        timer: "开始计时",
        seconds: 0,
        timing: false,
        itemId: state.inputValueId
      });
      state.inputValueId++;
      state.dayCardsIndex = dayCardsIndex;
      state.inputValue = "";
    },
    choseCard(state) {
      if (state.allCards.length !== 0 && state.dayCardsIndex !== "") {
        console.log(state.allCards);
        for (let index = 0; index < state.toDoDates.length; index++) {
          const toDoDate = state.toDoDates[index];
          if (
            state.date == toDoDate &&
            typeof state.allCards[index]["dayCards"] !== "undefined"
          ) {
            state.allCards[index]["dayCards"][
              state.dayCardsIndex
            ].isChose = true;
          }
        }
      }
    },
    cancelChoseCard(state) {
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoDate = state.toDoDates[index];
        if (
          state.date == toDoDate &&
          typeof state.allCards[index]["dayCards"] !== "undefined"
        ) {
          for (
            let cardIndex = 0;
            cardIndex < state.allCards[index]["dayCards"].length;
            cardIndex++
          ) {
            const card = state.allCards[index]["dayCards"][cardIndex];
            if (card.isChose == true) {
              card.isChose = false;
            }
          }
        }
      }
    },
    delItem(state, index) {
      state.dayCards[index.dayCardsIndex].cardList.splice(
        index.contentIndex,
        1
      );
    },
    reuseItem(state, index) {
      state.dayCards[index.dayCardsIndex].cardList[
        index.contentIndex
      ].done = false;
    },
    itemIsDone(state, index) {
      state.dayCards[index.dayCardsIndex].cardList[
        index.contentIndex
      ].done = !state.dayCards[index.dayCardsIndex].cardList[index.contentIndex]
        .done;
    },
    runTimer0(state, item) {
      state.runTimer = setInterval(() => {
        item.seconds += 1;
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
      }, 1000);
    },
    timerController(state, index) {
      var item =
        state.dayCards[index.dayCardsIndex].cardList[index.contentIndex];
      item.timing = !item.timing;
      if (item.timing) {
        this.commit("runTimer0", item);
        state.recordingTime = true;
        state.redordingIndex = index.contentIndex;
      } else {
        state.recordingTime = false;
        clearInterval(state.runTimer);
      }
    },

    //HabitList//

    addNewTable0(state) {
      state.habitDates.push(state.date);
      state.habitTables.push({ habitTable: state.habitTable });
    },
    addNewTable00(state) {
      state.habitDates.splice(0, 0, state.date);
      state.habitTables.splice(0, 0, { habitTable: state.habitTable });
    },
    addNewTable(state) {
      if (state.habitDates.length == 0) {
        this.commit("addNewTable0");
      } else if (state.habitDates.length == 1) {
        if (new Date(state.date) > new Date(state.habitDates[0])) {
          this.commit("addNewTable0");
        } else {
          this.commit("addNewTable00");
        }
      } else {
        var length = state.habitDates.length;
        if (new Date(state.date) < new Date(state.habitDates[0])) {
          this.commit("addNewTable00");
        } else if (
          new Date(state.date) > new Date(state.habitDates[length - 1])
        ) {
          this.commit("addNewTable0");
        } else {
          for (let index = 0; index < length; index++) {
            if (new Date(state.date) < new Date(state.habitDates[index])) {
              state.habitDates.splice(index, 0, state.date);
              state.habitTables.splice(index, 0, {
                habitTable: state.habitTable
              });
              break;
            }
          }
        }
      }
    },

    deleteRow(state, rowIndex) {
      state.habitTable.splice(rowIndex, 1);
      if (state.habitTable.length == 0) {
        for (let index = 0; index < state.habitDates.length; index++) {
          const element = state.habitDates[index];
          if (state.date == element) {
            state.habitDates.splice(index, 1);
            state.habitTables.splice(index, 1);
          }
        }
      }
    },
    editHabit(state, index) {
      state.habitTable[index].show = false;
    },
    saveEdit(state, index) {
      state.habitTable[index].show = true;
    },
    habitDone(state, rows) {
      var disableCheckBoxes = [];
      for (let index = 0; index < 7; index++) {
        if (rows.checked[index]) {
          state.count += 1;
        } else {
          disableCheckBoxes.push(index);
        }
      }
      if (state.count == rows.times) {
        for (let index = 0; index < disableCheckBoxes.length; index++) {
          const checkBoxIndex = disableCheckBoxes[index];
          rows.disabled[checkBoxIndex] = true;
        }
        state.habitTable[rows.index].done = true;
      }
      state.count = 0;
    },

    //标签
    pickHabit(state, tag) {
      state.habitTable.push({
        habit: tag,
        checked: [false, false, false, false, false, false, false],
        disabled: [false, false, false, false, false, false, false],
        done: false,
        show: true,
        times: 7
      });
    },
    delHabitLabel(state, tag) {
      state.habitList.splice(state.habitList.indexOf(tag), 1);
    },

    addNewHabitLabel(state) {
      state.inputVisible = true;
    },

    saveHabitLabel(state) {
      let inputValue = state.inputValue;
      if (inputValue) {
        state.habitList.push(inputValue);
      }
      state.inputVisible = false;
      state.inputValue = "";
    },

    showHabits(state) {
      state.habitTable = [];
      if (state.convertedDate !== "") {
        state.date = state.convertedDate;
      }
      for (let index = 0; index < state.habitDates.length; index++) {
        const habitDate = state.habitDates[index];
        if (habitDate == state.date) {
          state.habitTable = state.habitTables[index]["habitTable"];
        }
      }
      state.convertedDate = "";
    },
    //conver time
    getFirstDayOfWeekCST(state, date) {
      var weekDay = date.getDay();
      var toFirstDay = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
      date.setDate(date.getDate() - toFirstDay[weekDay]);
      state.firstDayOfWeekCST = date;
    },
    convertCST(state, date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      state.convertedDate = y + "-" + m + "-" + d;
    },
    setTimes(state, rows) {
      rows.habitTable[rows.index].times = rows.times;
      var uncheckedIndexes = [];
      for (
        let index = 0;
        index < rows.habitTable[rows.index].checked.length;
        index++
      ) {
        const checked = rows.habitTable[rows.index].checked[index];
        if (checked) {
          state.count += 1;
        } else {
          uncheckedIndexes.push(index);
        }
      }
      if (rows.times - state.count > 0) {
        for (let index = 0; index < 7; index++) {
          rows.habitTable[rows.index].disabled[index] = false;
        }
      }
      state.count = 0;
    },

    //*charts//
    // collect items for todo charts//
    getToDoItems(state) {
      state.allUniqueItems = [];
      state.allItems = [];
      for (let index = 0; index < state.allCards.length; index++) {
        const dayCards = state.allCards[index]["dayCards"];
        for (let index = 0; index < dayCards.length; index++) {
          const dayCard = dayCards[index];
          for (let index = 0; index < dayCard.cardList.length; index++) {
            const list = dayCard.cardList[index];
            // 获得完整数据
            state.allItems.push(list.item);
            if (!state.allUniqueItems.includes(list.item, 0)) {
              // 获得不重复的完整数据
              state.allUniqueItems.push(list.item);
            }
          }
        }
      }
    },

    //CountTimeForToDo//
    getNavItems0(state, index) {
      const dayCards = state.allCards[index]["dayCards"];
      for (let index = 0; index < dayCards.length; index++) {
        const dayCard = dayCards[index];
        for (let index = 0; index < dayCard.cardList.length; index++) {
          const list = dayCard.cardList[index];
          // 获得周完整items
          state.items.push(list.item);
          if (!state.uniqueItems.includes(list.item, 0)) {
            // 获得不重复的周完整items
            state.uniqueItems.push(list.item);
          }
        }
      }
    },
    getToDoItemsForDay0(state, getNavItems0) {
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoDate = state.toDoDates[index];
        //单日数据
        if (state.date == toDoDate) {
          this.commit(getNavItems0, index);
        }
      }
    },

    //get days of a week
    getDaysOfNavWeek(state) {
      var millisecondsOfNextDay = 0;
      var cst = 0;
      state.daysOfNavWeek = [];
      state.firstDayOfWeek = new Date(state.date);
      this.commit("getFirstDayOfWeekCST", state.firstDayOfWeek);
      var lastDay = state.firstDayOfWeekCST;
      this.commit("convertCST", state.firstDayOfWeekCST);
      state.daysOfNavWeek.push(state.convertedDate);
      for (let index = 0; index < 6; index++) {
        millisecondsOfNextDay = new Date(lastDay).getTime() + 86400000;
        cst = new Date(millisecondsOfNextDay);
        lastDay = cst;
        this.commit("convertCST", cst);
        state.daysOfNavWeek.push(state.convertedDate);
      }
    },
    getNavYearAndMonth0(state) {
      if (state.date[4] !== "-") {
        this.commit("convertCST", state.date);
        state.date = state.convertedDate;
      }
      state.navYearAndMonth =
        state.date.split("-")[0] + state.date.split("-")[1];
    },
    getNavYear0(state) {
      if (state.date[4] !== "-") {
        this.commit("convertCST", state.date);
        state.date = state.convertedDate;
      }
      state.navYear = state.date.split("-")[0];
    },
    //周items
    getToDoItemsForWeek0(state, getNavItems0) {
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoDate = state.toDoDates[index];
        if (state.daysOfNavWeek.includes(toDoDate, 0)) {
          this.commit(getNavItems0, index);
        }
      }
    },

    //get month items
    getToDoItemsForMonth0(state, getNavItems0) {
      this.commit("getNavYearAndMonth0");
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoYearAndMonth =
          state.toDoDates[index].split("-")[0] +
          state.toDoDates[index].split("-")[1];
        if (state.navYearAndMonth == toDoYearAndMonth) {
          this.commit(getNavItems0, index);
        }
      }
    },

    //get year items
    getToDoItemsForYear0(state, getNavItems0) {
      this.commit("getNavYear0");
      // convertedTime
      for (let index = 0; index < state.toDoDates.length; index++) {
        const toDoYear = state.toDoDates[index].split("-")[0];
        if (state.navYear == toDoYear) {
          this.commit(getNavItems0, index);
        }
      }
    },
    getCountTimeItems(state, value) {
      state.items = [];
      state.uniqueItems = [];
      if (value == "week") {
        this.commit("getToDoItemsForWeek0", "getNavItems0");
      } else if (value == "month") {
        this.commit("getToDoItemsForMonth0", "getNavItems0");
      } else if (value == "year") {
        this.commit("getToDoItemsForYear0", "getNavItems0");
      } else {
        this.commit("getToDoItemsForDay0", "getNavItems0");
      }
    },

    // HabitIWordCloud//
    getHabitItemsForWordCloud(state) {
      state.allItems = [];
      state.allUniqueItems = [];
      for (let index_1 = 0; index_1 < state.habitTables.length; index_1++) {
        const habitTable = state.habitTables[index_1]["habitTable"];
        for (let index_2 = 0; index_2 < habitTable.length; index_2++) {
          const habits = habitTable[index_2];
          // 获得重复的完整数据
          state.allItems.push(habits.habit);
          if (!state.allUniqueItems.includes(habits.habit, 0)) {
            // 获得不重复的完整数据
            state.allUniqueItems.push(habits.habit);
          }
        }
      }
    },

    //PercentCompleteOfHabits//
    getPercentCompleteOfHabitsForMonth(state) {
      this.commit("getNavYearAndMonth0");
      state.allItems = [];
      state.allUniqueItems = [];
      state.doneItems = [];
      state.undoneItems = [];

      for (let index = 0; index < state.habitDates.length; index++) {
        const habitYearAndMonth =
          state.habitDates[index].split("-")[0] +
          state.habitDates[index].split("-")[1];
        if (state.navYearAndMonth == habitYearAndMonth) {
          const habitTable = state.habitTables[index]["habitTable"];
          for (let index = 0; index < habitTable.length; index++) {
            const habit = habitTable[index];
            // 获得重复的完整数据
            state.allItems.push(habit.habit);
            if (!state.allUniqueItems.includes(habit.habit, 0)) {
              // 获得不重复的完整数据
              state.allUniqueItems.push(habit.habit);
            }
            if (habit.done == true) {
              //获得完成的数据
              state.doneItems.push(habit.habit);
            } else {
              //获得未完成的数据
              state.undoneItems.push(habit.habit);
            }
          }
        }
      }
    },
    getPercentCompleteOfHabitsForYear(state) {
      this.commit("getNavYear0");
      state.allItems = [];
      state.allUniqueItems = [];
      state.doneItems = [];
      state.undoneItems = [];

      // convertedTime
      for (let index = 0; index < state.habitDates.length; index++) {
        const habitYear = state.habitDates[index].split("-")[0];
        if (state.navYear == habitYear) {
          const habitTable = state.habitTables[index]["habitTable"];
          for (let index = 0; index < habitTable.length; index++) {
            const habit = habitTable[index];
            // 获得重复的完整数据
            state.allItems.push(habit.habit);
            if (!state.allUniqueItems.includes(habit.habit, 0)) {
              // 获得不重复的完整数据
              state.allUniqueItems.push(habit.habit);
            }
            if (habit.done == true) {
              //获得完成的数据
              state.doneItems.push(habit.habit);
            } else {
              //获得未完成的数据
              state.undoneItems.push(habit.habit);
            }
          }
        }
      }
    },
    //PercentCompleteOfToDo//
    getPercentCompleteItems0(state, index) {
      const dayCards = state.allCards[index]["dayCards"];
      for (let index = 0; index < dayCards.length; index++) {
        const dayCard = dayCards[index];
        for (let index = 0; index < dayCard.cardList.length; index++) {
          const list = dayCard.cardList[index];
          if (list.done == true) {
            //获得完成的数据
            state.doneItems.push(list.item);
          } else {
            //获得未完成的数据
            state.undoneItems.push(list.item);
          }
        }
      }
    },
    //get week items

    getPercentCompleteItems(state, value) {
      state.doneItems = [];
      state.undoneItems = [];
      if (value == "month") {
        this.commit("getToDoItemsForMonth0", "getPercentCompleteItems0");
      } else if (value == "year") {
        this.commit("getToDoItemsForYear0", "getPercentCompleteItems0");
      } else {
        this.commit("getToDoItemsForWeek0", "getPercentCompleteItems0");
      }
    },

    //*actions//
    initAllCards0(state, allCards) {
      state.allCards = allCards;
      this.commit("pickDayCards");
    },
    initHabitTables0(state, habitTables) {
      state.habitTables = habitTables;
    }
  },

  actions: {
    getAllCards(context) {
      Vue.axios.get("/allCards.json").then(response => {
        context.commit("initAllCards0", response.data);
      });
    },
    getHabitTables(context) {
      Vue.axios.get("/habitTables.json").then(response => {
        context.commit("initHabitTables0", response.data);
      });
    }
  },

  getters: {
    //habit 柱形图 PercentCompleteOfHabits//
    // 获得每周数据
    percentCompleteOfHabitsRows(state) {
      var rows = [];
      for (let index = 0; index < state.allUniqueItems.length; index++) {
        const uniqueItem = state.allUniqueItems[index];
        state.histogramArray["习惯"] = uniqueItem;
        for (let index = 0; index < state.doneItems.length; index++) {
          const doneItem = state.doneItems[index];
          if (doneItem == uniqueItem) {
            state.histogramArray["完成周数"] += 1;
          }
        }
        for (let index = 0; index < state.undoneItems.length; index++) {
          const undoneItem = state.undoneItems[index];
          if (undoneItem == uniqueItem) {
            state.histogramArray["未完成周数"] += 1;
          }
        }
        rows.push(state.histogramArray);
        state.histogramArray = {
          习惯: "",
          完成周数: 0,
          未完成周数: 0
        };
      }
      return rows;
    },
    habitsPercentCompleteXAxis(state, getters) {
      var xAxis = [];
      var rows = getters.percentCompleteOfHabitsRows;
      for (let index = 0; index < rows.length; index++) {
        const item = rows[index]["习惯"];
        xAxis.push(item);
      }
      return xAxis;
    },

    //ToDoList 柱形图//
    //获得每日所有项目的时长
    toDoTimeRowsForDay(state) {
      var rows = [];
      for (let index = 0; index < state.uniqueItems.length; index++) {
        const uniqueItem = state.uniqueItems[index];
        state.chartDataArry["item"] = uniqueItem;
        //日
        for (let index = 0; index < state.toDoDates.length; index++) {
          const toDoDate = state.toDoDates[index];
          if (state.date == toDoDate) {
            const dayCards = state.allCards[index]["dayCards"];
            for (let index = 0; index < dayCards.length; index++) {
              const dayCard = dayCards[index];
              for (let index = 0; index < dayCard.cardList.length; index++) {
                const list = dayCard.cardList[index];
                if (uniqueItem == list.item) {
                  state.chartDataArry["num"] += list.seconds;
                }
              }
            }

            rows.push(state.chartDataArry);
          }
        }
        state.chartDataArry = {
          item: "",

          num: 0
        };
      }
      return rows;
    },

    //获得每周所有项目的时长
    toDoTimeRowsForWeek(state) {
      var rows = [];
      for (let index = 0; index < state.uniqueItems.length; index++) {
        const uniqueItem = state.uniqueItems[index];
        state.chartDataArry["item"] = uniqueItem;
        //日
        for (let index = 0; index < state.toDoDates.length; index++) {
          const toDoDate = state.toDoDates[index];
          if (state.daysOfNavWeek.includes(toDoDate, 0)) {
            const dayCards = state.allCards[index]["dayCards"];
            for (let index = 0; index < dayCards.length; index++) {
              const dayCard = dayCards[index];
              for (let index = 0; index < dayCard.cardList.length; index++) {
                const list = dayCard.cardList[index];
                if (uniqueItem == list.item) {
                  state.chartDataArry["num"] += list.seconds;
                }
              }
            }
          }
        }

        rows.push(state.chartDataArry);
        state.chartDataArry = {
          item: "",

          num: 0
        };
      }
      return rows;
    },

    //获得每月所有项目的时长
    toDoTimeRowsForMonth(state) {
      var rows = [];
      for (let index = 0; index < state.uniqueItems.length; index++) {
        const uniqueItem = state.uniqueItems[index];
        state.chartDataArry["item"] = uniqueItem;
        //日
        for (let index = 0; index < state.toDoDates.length; index++) {
          const toDoYearAndMonth =
            state.toDoDates[index].split("-")[0] +
            state.toDoDates[index].split("-")[1];
          if (state.navYearAndMonth == toDoYearAndMonth) {
            const dayCards = state.allCards[index]["dayCards"];
            for (let index = 0; index < dayCards.length; index++) {
              const dayCard = dayCards[index];
              for (let index = 0; index < dayCard.cardList.length; index++) {
                const list = dayCard.cardList[index];
                if (uniqueItem == list.item) {
                  state.chartDataArry["num"] += list.seconds;
                }
              }
            }
          }
        }

        rows.push(state.chartDataArry);
        state.chartDataArry = {
          item: "",

          num: 0
        };
      }
      return rows;
    },

    //获得每年所有项目的时长
    toDoTimeRowsForYear(state) {
      var rows = [];
      for (let index = 0; index < state.uniqueItems.length; index++) {
        const uniqueItem = state.uniqueItems[index];
        state.chartDataArry["item"] = uniqueItem;
        //日
        for (let index = 0; index < state.toDoDates.length; index++) {
          const toDoYear = state.toDoDates[index].split("-")[0];
          if (state.navYear == toDoYear) {
            const dayCards = state.allCards[index]["dayCards"];
            for (let index = 0; index < dayCards.length; index++) {
              const dayCard = dayCards[index];
              for (let index = 0; index < dayCard.cardList.length; index++) {
                const list = dayCard.cardList[index];
                if (uniqueItem == list.item) {
                  state.chartDataArry["num"] += list.seconds;
                }
              }
            }
          }
        }
        rows.push(state.chartDataArry);
        state.chartDataArry = {
          item: "",
          num: 0
        };
      }
      return rows;
    },

    //x轴
    toDoTimeXAxisForDay(state, getters) {
      var xAxis = [];
      var rows = getters.toDoTimeRowsForDay;
      for (let index = 0; index < rows.length; index++) {
        const item = rows[index]["item"];
        xAxis.push(item);
      }
      return xAxis;
    },
    toDoTimeXAxisForWeek(state, getters) {
      var xAxis = [];
      var rows = getters.toDoTimeRowsForWeek;
      for (let index = 0; index < rows.length; index++) {
        const item = rows[index]["item"];
        xAxis.push(item);
      }
      return xAxis;
    },
    toDoTimeXAxisForMonth(state, getters) {
      var xAxis = [];
      var rows = getters.toDoTimeRowsForMonth;
      for (let index = 0; index < rows.length; index++) {
        const item = rows[index]["item"];
        xAxis.push(item);
      }
      return xAxis;
    },
    toDoTimeXAxisForYear(state, getters) {
      var xAxis = [];
      var rows = getters.toDoTimeRowsForYear;
      for (let index = 0; index < rows.length; index++) {
        const item = rows[index]["item"];
        xAxis.push(item);
      }
      return xAxis;
    },

    //ToDoList 饼图//

    percentCompleteOfToDo(state) {
      var rows = [];
      state.chartDataArry = {
        item: "未完成",
        num: state.undoneItems.length
      };
      rows.push(state.chartDataArry);
      state.chartDataArry = {
        item: "已完成",
        num: state.doneItems.length
      };
      rows.push(state.chartDataArry);
      state.chartDataArry = {
        item: "",
        num: 0
      };
      return rows;
    },
    // ToDoList & HabitList word-cloud//
    countItemsForWordCloudRows(state) {
      var rows = [];
      for (let index = 0; index < state.allUniqueItems.length; index++) {
        const uniqueItem = state.allUniqueItems[index];
        state.chartDataArry["item"] = uniqueItem;
        for (let index = 0; index < state.allItems.length; index++) {
          const item = state.allItems[index];
          if (item == uniqueItem) {
            state.chartDataArry["num"] += 1;
          }
        }
        rows.push(state.chartDataArry);
        state.chartDataArry = {
          item: "",
          num: 0
        };
      }
      return rows;
    }
  }
});
