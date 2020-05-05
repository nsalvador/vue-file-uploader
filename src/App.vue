<template>
  <app-home />
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