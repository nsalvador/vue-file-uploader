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
        <div>
          <h1>Files in Bucket</h1>
          <h2>This is a listing of files that have already been uploaded to the AWS S3 bucket.</h2>
          <pre v-if="bucket.length!==0">{{ bucket }}</pre>
          <div v-else>Bucket is Empty</div>
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
    message: "",
    bucket: []
  }),
  async mounted() {
    try {
      const response = await axios.get("/bucket");
      this.bucket = response.data;
    } catch (error) {
      this.message = error;
    }
  },
  methods: {
    onSelect() {
      const allowedTypes = ["application/pdf"];
      const file = this.$refs.file.files[0];
      if (!allowedTypes.includes(file.type)) {
        this.message = "Only pdf files are required!!";
        this.file = "";
        return;
      }
      this.file = file;
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      try {
        await axios.post("/upload", formData);
        const response = await axios.get("/bucket");
        this.bucket = response.data;
      } catch (error) {
        console.log(error);
        this.message = error.response.data.error;
      }
    }
  }
};
</script>

<style></style>
