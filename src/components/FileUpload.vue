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
            <v-snackbar v-model="snackbar" :timeout="0">
              {{ message }}
              <v-btn text @click="onClick">Close</v-btn>
            </v-snackbar>
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th
                        class="text-left"
                        v-for="(item, index) in tableHeaders"
                        :key="index"
                      >{{ item }}</th>
                    </tr>
                  </thead>
                  <tbody v-show="Object.keys(uploadedFile).length!==0">
                    <tr>
                      <td>{{ uploadedFile.name }}</td>
                      <td>{{ uploadedFile.type }}</td>
                      <td>{{ uploadedFile.lastModified }}</td>
                      <td>{{ uploadedFile.size }}</td>
                      <td v-show="uploadPercentage > 0">
                        <v-progress-linear v-model="uploadPercentage" reactive height="25">
                          <strong>{{ uploadPercentage.toString() + '%' }}</strong>
                        </v-progress-linear>
                      </td>
                      <td v-show="uploadPercentage === 100">
                        <v-icon @click="uploadedFile={}">mdi-close</v-icon>
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
    snackbar: false,
    uploadedFile: {},
    tableHeaders: ["Name", "Type", "Last Modified", "Size", "Progress"],
    uploadPercentage: 0
  }),
  methods: {
    onClick() {
      if (this.file) this.file = "";
      this.snackbar = false;
    },
    onSelect() {
      const fileTypes = ["application/pdf"];
      if (this.file && !fileTypes.includes(this.file.type)) {
        this.snackbar = true;
        this.message = "Not valid file type.";
      } else {
        this.snackbar = false;
      }
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      const file = this.file;
      this.$set(this.uploadedFile, "name", file.name);
      this.$set(this.uploadedFile, "type", file.type);
      this.$set(this.uploadedFile, "lastModified", file.lastModified);
      this.$set(this.uploadedFile, "size", file.size);
      try {
        await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }
        });
        this.file = "";
      } catch (error) {
        this.snackbar = true;
        this.message = error.response.data.error;
      }
    }
  }
};
</script>

<style></style>
