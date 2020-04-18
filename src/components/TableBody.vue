<template>
  <tbody>
    <tr v-for="(item, index) in body" :key="index">
      <slot name="checkbox" :itemKey="item.Key" />
      <td>{{ item.name ? item.name : item.Key }}</td>
      <td v-show="item.type">{{ item.type }}</td>
      <td>{{ item.lastModified ? item.lastModified : item.LastModified | lastModified }}</td>
      <td>{{ item.size ? item.size : item.Size | fileSize }}</td>
      <slot name="upload-complete" />
      <slot name="action-buttons" :itemKey="item.Key" />
    </tr>
  </tbody>
</template>

<script>
export default {
  name: "TableBody",
  props: {
    body: {
      type: Array
    }
  }
};
</script>

<style>
</style>