<template>
  <v-simple-table>
    <template v-slot:default>
      <app-table-header :header="contents.header" />
      <app-table-body
        v-if="contents.body.length && Object.keys(contents.body[0]).length"
        :body="contents.body"
      >
        <template v-slot:upload-complete>
          <slot name="upload-complete" />
        </template>
        <template v-slot:action-buttons="item">
          <slot name="action-buttons" :itemKey="item.itemKey" />
        </template>
      </app-table-body>
      <slot v-else-if="!contents.body.length" />
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object
    }
  },
  components: {
    AppTableHeader: () => import("./TableHeader"),
    AppTableBody: () => import("./TableBody")
  }
};
</script>

<style>
</style>