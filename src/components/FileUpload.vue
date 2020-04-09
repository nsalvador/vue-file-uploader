<template>
  <div class="file">
    <div class="file">
      <form @submit.prevent="onSubmit" enctype="mulipart/form-data">
        <div class="fields">
          <label>Upload File</label>
          <br />
          <input type="file" ref="file" @change="onSelect" />
        </div>
        <div class="fields">
          <button :disabled="!file">Submit</button>
        </div>
        <div class="message">
          <pre>{{ message }}</pre>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  data: () => ({
    file: "",
    message: ""
  }),
  methods: {
    onSelect() {
      const allowedTypes = ["application/pdf"];
      const file = this.$refs.file.files[0];
      if (!allowedTypes.includes(file.type)) {
        this.message = "Only pdf files are required!!";
        return;
      }
      this.file = file;
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      try {
        const response = await axios.post("/upload", formData);
        this.message = response.data;
      } catch (error) {
        console.log(error);
        this.message = error.response.data.error;
      }
    }
  }
};
</script>

<style></style>
