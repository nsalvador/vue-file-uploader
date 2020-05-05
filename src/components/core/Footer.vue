<template>
  <v-footer class="blue-grey darken-4" padless>
    <v-container class="pa-0 d-flex justify-center">
      <v-card flat tile class="transparent">
        <v-card-text class="text-center overline white--text" v-html="text"></v-card-text>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    text: `Copyright &copy; ${new Date().getFullYear()}<br/>Nigel Salvador, Full Stack Web Developer<br/>Built with <a target='_blank' href='https://vuejs.org/'>Vue.js</a> &amp; <a target='_blank' href='https://vuetifyjs.com/en/'>Vuetify</a>`
  })
};
</script>

<style>
</style>