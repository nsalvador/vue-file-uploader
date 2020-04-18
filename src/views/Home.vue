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
              <app-table
                :contents="{header: ['Name', 'Type', 'Last Modified', 'Size', 'Progress'], body: [uploadedFile]}"
              >
                <template v-slot:upload-complete>
                  <td v-show="uploadPercentage">
                    <v-progress-linear v-model="uploadPercentage" reactive height="25">
                      <strong>{{ uploadPercentage.toString() + '%' }}</strong>
                    </v-progress-linear>
                  </td>
                  <td v-show="uploadPercentage === 100">
                    <v-icon @click="uploadedFile = {}">mdi-close</v-icon>
                  </td>
                </template>
              </app-table>
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
            <app-table :contents="{header: ['Name', 'Last Modified', 'Size'], body: bucket}">
              <template v-slot:action-buttons="{itemKey}">
                <td>
                  <v-btn width="85" class="blue white--text" text @click="openLink(itemKey)">link</v-btn>
                </td>
                <td>
                  <v-btn
                    width="85"
                    class="blue white--text"
                    text
                    @click="openDialog(itemKey)"
                  >delete</v-btn>
                </td>
              </template>
              <v-banner>Bucket Is Empty</v-banner>
            </app-table>
          </v-card-text>
        </v-card>
      </v-container>
      <v-dialog v-model="dialog" max-width="290" persistent>
        <v-card>
          <v-card-title>Delete</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-2">Are you sure you want to delete file from the bucket?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteHandler">yes</v-btn>
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
    dialog: false
  }),
  created() {
    this.getBucket();
  },
  methods: {
    openLink(value) {
      window.open(
        `https://vue-file-uploader.s3.us-east-2.amazonaws.com/${value}`,
        "_blank"
      );
    },
    openDialog(value) {
      this.dialog = true;
      this.file = value;
    },
    async getBucket() {
      try {
        const response = await axios.get("/bucket");
        this.bucket = response.data;
      } catch (error) {
        this.snackbar = true;
        this.message = "Failed to get bucket";
      }
    },
    async deleteHandler() {
      try {
        this.dialog = false;
        await axios.delete("/", {
          data: { Key: this.file }
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
  },
  components: {
    AppTable: () => import("../components/Table")
  }
};
</script>

<style></style>
