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
              <v-file-input
                v-model="file"
                label="Choose file"
                outlined
                dense
                @change="fileInputOnChangeHandler"
              />
            </v-card-text>
            <v-snackbar v-model="snackbar" :timeout="5000">
              {{ message }}
              <v-btn @click="closeHandler" icon text>
                <v-icon class="white--text">mdi-close</v-icon>
              </v-btn>
            </v-snackbar>
            <v-divider></v-divider>
            <v-card-text>
              <app-table
                :contents="{header: ['Name', 'Type', 'Last Modified', 'Size', 'Progress'], body: [uploadedFile]}"
              >
                <template v-slot:upload-complete>
                  <td v-show="uploadPercentage">
                    <v-progress-linear v-model="uploadPercentage" reactive height="25">
                      <strong>{{ message === 'Upload Failed' ? message : uploadPercentage.toString() + '%' }}</strong>
                    </v-progress-linear>
                  </td>
                  <td v-show="uploadPercentage === 100">
                    <v-icon @click="uploadedFile = {}">mdi-close</v-icon>
                  </td>
                </template>
              </app-table>
            </v-card-text>
            <v-card-actions class="px-4 pt-0">
              <v-checkbox
                label="Convert to Image File"
                :disabled="!file || snackbar"
                v-model="isConverted"
              ></v-checkbox>
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
            <app-table :contents="{header: ['Name', 'Last Modified', 'Size'], body: bucket}">
              <template v-slot:select-all>
                <th>
                  <v-checkbox
                    v-model="selectAll"
                    @change="selectAllChangeHandler"
                    :disabled="!bucket.length"
                  />
                </th>
              </template>
              <template v-slot:select="{itemKey}">
                <td>
                  <v-checkbox
                    v-model="selection"
                    @change="selectAll=(selection.length===bucket.length)"
                    :value="itemKey"
                  />
                </td>
              </template>
              <template v-slot:link-button="{itemKey}">
                <td>
                  <v-btn
                    width="85"
                    class="blue white--text"
                    text
                    @click="openLinkHandler(itemKey)"
                  >link</v-btn>
                </td>
              </template>
              <v-banner>Bucket Is Empty</v-banner>
            </app-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="blue white--text"
              text
              :disabled="!selection.length"
              depressed
              @click="dialog=true"
            >delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
      <v-dialog v-model="dialog" max-width="290" persistent>
        <v-card>
          <v-card-title>Delete</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-2">Are you sure you want to delete file(s) from the bucket?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteFilesHandler">yes</v-btn>
            <v-btn text @click="dialog=false">no</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    file: "",
    message: "",
    bucket: [],
    snackbar: false,
    uploadedFile: {},
    uploadPercentage: 0,
    dialog: false,
    selection: [],
    selectAll: false,
    isConverted: false
  }),
  created() {
    this.getBucket();
  },
  watch: {
    uploadPercentage(newValue) {
      if (newValue === 100) {
        setTimeout(() => {
          this.uploadedFile = {};
        }, 3500);
      }
    }
  },
  methods: {
    selectAllChangeHandler() {
      if (!this.selectAll && this.selection.length) {
        this.selection = [];
      } else if (this.selection.length !== this.bucket.length) {
        this.bucket.forEach((item, index) =>
          this.$set(this.selection, index, item.Key)
        );
      }
    },
    openLinkHandler(value) {
      window.open(
        `https://vue-file-uploader.s3.us-east-2.amazonaws.com/${value}`,
        "_blank"
      );
    },
    async getBucket() {
      try {
        const response = await axios.get("/bucket");
        this.bucket = response.data;
        this.selection = [];
        this.selectAll = false;
      } catch (error) {
        this.snackbar = true;
        this.message = "Failed to get bucket";
      }
    },
    async deleteFilesHandler() {
      try {
        this.dialog = false;
        await axios.delete("/", {
          data: { contents: this.selection }
        });
        this.message = "Deletion successful.";
        this.getBucket();
      } catch (error) {
        this.message = "Deletion failed.";
      } finally {
        this.snackbar = true;
        this.file = "";
      }
    },
    closeHandler() {
      if (this.file) this.file = "";
      this.snackbar = false;
    },
    fileInputOnChangeHandler() {
      const fileTypes = ["application/pdf"];
      if (this.file && !fileTypes.includes(this.file.type)) {
        this.snackbar = true;
        this.message = "Not valid file type.";
      } else {
        this.snackbar = false;
      }
    },
    async onSubmit() {
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        const file = this.file;
        this.$set(this.uploadedFile, "name", file.name);
        this.$set(this.uploadedFile, "type", file.type);
        this.$set(this.uploadedFile, "lastModified", file.lastModified);
        this.$set(this.uploadedFile, "size", file.size);
        await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
          params: {
            isConverted: this.isConverted ? "1" : "0"
          }
        });
        this.getBucket();
        this.isConverted = false;
      } catch (error) {
        this.message = "Upload Failed";
      } finally {
        this.file = "";
      }
    }
  },
  components: {
    AppTable: () => import("../components/Table/Index")
  }
};
</script>

<style></style>
