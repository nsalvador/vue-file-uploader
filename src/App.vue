<template>
  <div id="app">
    <file-upload />
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    FileUpload: () => import("./components/FileUpload")
  }
};
</script>

<style>
</style>