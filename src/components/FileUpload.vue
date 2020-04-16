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
              <v-file-input v-model="file" label="Choose file" outlined dense @change="onChange" />
            </v-card-text>
            <v-snackbar v-model="snackbar" :timeout="0">
              {{ message }}
              <v-btn text @click="onClick">Close</v-btn>
            </v-snackbar>
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <app-table-header
                    :header="['Name', 'Type', 'Last Modified', 'Size', 'Progress']"
                  />
                  <app-table-body v-show="Object.keys(uploadedFile).length" :body="[uploadedFile]">
                    <td v-show="uploadPercentage" slot="progress-bar">
                      <v-progress-linear v-model="uploadPercentage" reactive height="25">
                        <strong>
                          {{
                          uploadPercentage.toString() + '%'
                          }}
                        </strong>
                      </v-progress-linear>
                    </td>
                    <td v-show="uploadPercentage === 100" slot="close-button">
                      <v-icon @click="uploadedFile = {}">mdi-close</v-icon>
                    </td>
                  </app-table-body>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer />
              <v-btn
                type="submit"
                :disabled="!file || snackbar"
                class="blue white--text"
                depressed
              >upload</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
      <v-container>
        <v-card outlined>
          <v-card-title>Files in Bucket</v-card-title>
          <v-card-subtitle>This is a listing of files that have been uploaded to the bucket</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <app-table-header :header="['Name', 'Last Modified', 'Size']" />
                <app-table-body v-if="bucket.length" :body="bucket">
                  <td slot="link-button">
                    <v-btn width="85" class="blue white--text" text>link</v-btn>
                  </td>
                  <td slot="delete-button">
                    <v-btn width="85" class="blue white--text" text>delete</v-btn>
                  </td>
                </app-table-body>
                <v-banner v-else>Bucket Is Empty</v-banner>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "FileUpload",
  filters: {
    fileSize(bytes, si = false) {
      /* Date: 4-13-2020 | Source: https://stackoverflow.com/a/14919494 */
      const thresh = si ? 1000 : 1024;
      if (Math.abs(bytes) < thresh) return `${bytes} B`;
      const units = si ? ["kB", "MB", "GB"] : ["KiB", "MiB", "GiB"];
      let u = -1;
      do {
        bytes /= thresh;
        ++u;
      } while (Math.abs(bytes) >= thresh && u < units.length - 1);
      return `${bytes.toFixed(1)} ${units[u]}`;
    },
    lastModified(date) {
      return moment(date).format("MMMM Do, YYYY");
    }
  },
  components: {
    AppTableHeader: () => import("./TableHeader.vue"),
    AppTableBody: () => import("./TableBody.vue")
  },
  created() {
    this.getBucket();
  },
  data: () => ({
    file: "",
    message: "",
    bucket: [],
    snackbar: false,
    uploadedFile: {},
    uploadPercentage: 0
  }),
  methods: {
    async getBucket() {
      try {
        const response = await axios.get("/bucket");
        this.bucket = response.data;
      } catch (error) {
        this.snackbar = true;
        this.message = "Failed to get bucket";
      }
    },
    onClick() {
      if (this.file) this.file = "";
      this.snackbar = false;
    },
    onChange() {
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
        const file = this.file;
        this.$set(this.uploadedFile, "name", file.name);
        this.$set(this.uploadedFile, "type", file.type);
        this.$set(this.uploadedFile, "lastModified", file.lastModified);
        this.$set(this.uploadedFile, "size", file.size);
        this.getBucket();
      } catch (error) {
        this.snackbar = true;
        this.message = "Upload Failed.";
      } finally {
        this.file = "";
      }
    }
  }
};
</script>

<style></style>
