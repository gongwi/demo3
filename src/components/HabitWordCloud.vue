<template>
  <div>
    <el-card class="box-card">
      <ve-wordcloud :data="doneData"></ve-wordcloud>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      doneData: {
        columns: ["item", "num"],
        rows: this.$store.getters.countItemsForWordCloudRows
      },

    };
  },
  beforeCreate() {
    this.$store.commit("getHabitItemsForWordCloud");
  }
};
</script>
