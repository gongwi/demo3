<template>
  <div id="app">
    
    <router-view class="content"></router-view>
    
    <!-- 设置左侧导航栏 -->
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :default-openeds="openeds"
        >
          <!-- 左侧导航栏导航 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span>待办列表</span>
              
            </template>
            <router-link to="/"><el-menu-item index="1-1">每日待办</el-menu-item></router-link>
            <router-link to="/habitList"><el-menu-item index="1-2">习惯清单</el-menu-item></router-link>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group title="时间分配">
              <router-link to="/countTimeForToDo"><el-menu-item index="2-1">每日待办</el-menu-item></router-link>
            </el-menu-item-group>
            <el-menu-item-group title="完成情况">
              <router-link to="/percentCompleteOfToDo"><el-menu-item index="2-2">每日待办</el-menu-item></router-link>
              <router-link to="/percentCompleteOfHabits"><el-menu-item index="2-3">习惯清单</el-menu-item></router-link>
            </el-menu-item-group>
            <el-menu-item-group title="词云统计">
              <router-link to="/toDoWordCloud"><el-menu-item index="2-4">每日待办</el-menu-item></router-link>
              <router-link to="/habitWordCloud"><el-menu-item index="2-5">习惯清单</el-menu-item></router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import ToDoList from "./components/ToDoList.vue";
import HabitList from "./components/HabitList.vue";
import ToDoWordCloud from "./components/ToDoWordCloud.vue";
import HabitWordCloud from "./components/HabitWordCloud.vue";
import PercentCompleteOfToDo from "./components/PercentCompleteOfToDo.vue";
import PercentCompleteOfHabits from "./components/PercentCompleteOfHabits.vue";
import CountTimeForToDo from "./components/CountTimeForToDo.vue";



import "bootstrap/dist/css/bootstrap.min.css";

import store from "./store.js";
export const router = new VueRouter({
  base: "/",
  mode: "history",
  routes: [
    { path: "/", component: ToDoList },
    { path: "/habitList", component: HabitList },
    { path: "/toDoWordCloud", component: ToDoWordCloud },
    { path: "/habitWordCloud", component: HabitWordCloud },
    { path: "/percentCompleteOfToDo", component: PercentCompleteOfToDo },
    { path: "/countTimeForToDo", component: CountTimeForToDo },
    { path: "/percentCompleteOfHabits", component: PercentCompleteOfHabits }
  ]
});


export default {
  name: "app",
  data() {
    return {
      openeds: ["1", "2"]
    };
  },
  router,
  store,
  beforeCreate() {
    this.$store.dispatch("getAllCards");
    this.$store.dispatch("getHabitTables");
    this.$store.commit("getDay");
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.tac {
  width: 20%;
}
.content {
  width: 70%;
  float: right;
  margin: auto 5%;
  text-align: left;
}
.is-selected {
  color: #1989fa;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
</style>
