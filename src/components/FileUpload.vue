<template>
  <v-app>
    <v-content>
      <v-container>
        <v-card outlined>
          <v-form @submit.prevent="onSubmit">
            <v-card-title>Upload File</v-card-title>
            <v-card-subtitle>
              Select a file that you would like to upload and then click the
              upload button.
            </v-card-subtitle>
            <v-card-text class="py-0">
              <v-file-input v-model="file" label="Choose file" outlined dense @change="onSelect" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left" v-for="(item, index) in headers" :key="index">{{ item }}</th>
                    </tr>
                  </thead>
                  <tbody v-if="uploadedFile.length!==0">
                    <tr>
                      <td v-for="(item, index) in uploadedFile" :key="index">{{ item }}</td>
                      <td v-if="uploadPercentage > 0">
                        <v-progress-linear :value="uploadPercentage" />
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer />
              <v-btn type="submit" :disabled="!file" class="blue white--text" depressed>upload</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  data: () => ({
    file: "",
    message: "",
    uploadedFile: [],
    headers: ["Name", "Type", "Last Modified", "Size", "Progress"],
    uploadPercentage: 0
  }),
  methods: {
    onSelect() {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(this.file.type)) {
        this.message = "Only pdf files are required!!";
        this.file = "";
        return;
      }
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      const file = this.file;
      this.$set(this.uploadedFile, 0, file.name);
      this.$set(this.uploadedFile, 1, file.type);
      this.$set(this.uploadedFile, 2, file.lastModified);
      this.$set(this.uploadedFile, 3, file.size);
      try {
        await axios({
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          },
          url: "/upload",
          method: "post",
          data: formData
        });
        this.file = "";
      } catch (error) {
        this.message = error.response.data.error;
      }
    }
  }
};
</script>

<style></style>
