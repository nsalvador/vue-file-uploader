<template>
  <thead>
    <tr>
      <th class="text" v-for="(item, index) in header" :key="index">{{ item }}</th>
    </tr>
  </thead>
</template>

<script>
export default {
  name: "TableHeader",
  props: {
    header: {
      type: Array
    }
  }
};
</script>

<style>
</style>