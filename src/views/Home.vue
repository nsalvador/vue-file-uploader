<template>
  <v-app>
    <app-main />
    <app-footer />
  </v-app>
</template>

<script>
export default {
  components: {
    AppMain: () => import("../components/core/Main"),
    AppFooter: () => import("../components/core/Footer")
  }
};
</script>

<style>
</style>