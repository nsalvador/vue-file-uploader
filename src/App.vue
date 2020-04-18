<template>
  <div id="app">
    <app-home />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    AppHome: () => import("./views/Home")
  }
};
</script>

<style>
</style>