<template>
  <div id="app">
    <app-default />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    AppDefault: () => import("./views/Default")
  }
};
</script>

<style>
</style>