<template>
  <v-simple-table>
    <template v-slot:default>
      <app-table-header :header="contents.header">
        <template v-slot:select-all>
          <slot name="select-all" />
        </template>
      </app-table-header>
      <app-table-body
        v-if="contents.body.length && Object.keys(contents.body[0]).length"
        :body="contents.body"
      >
        <template v-slot:select="{ itemKey }">
          <slot name="select" :itemKey="itemKey" />
        </template>
        <template v-slot:upload-complete>
          <slot name="upload-complete" />
        </template>
        <template v-slot:link-button="{ itemKey }">
          <slot name="link-button" :itemKey="itemKey" />
        </template>
      </app-table-body>
      <slot v-else-if="!contents.body.length" />
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "Table",
  props: {
    contents: {
      type: Object
    }
  },
  components: {
    AppTableHeader: () => import("./Header"),
    AppTableBody: () => import("./Body")
  }
};
</script>

<style>
</style>