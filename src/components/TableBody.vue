<template>
  <tbody>
    <tr v-for="(item, index) in body" :key="index">
      <td>{{ item.name ? item.name : item.Key }}</td>
      <td v-show="item.type">{{ item.type }}</td>
      <td>{{ item.lastModified ? item.lastModified : item.LastModified }}</td>
      <td>{{ item.size ? item.size : item.Size }}</td>
      <slot name="progress-bar"></slot>
      <slot name="close-button"></slot>
      <slot name="link-button"></slot>
      <slot name="delete-button"></slot>
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