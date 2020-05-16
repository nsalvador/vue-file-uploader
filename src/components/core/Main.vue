<template>
  <v-content class="blue-grey lighten-3">
    <v-container>
      <v-card outlined>
        <v-form @submit.prevent="onSubmit">
          <v-card-title>Upload File</v-card-title>
          <v-card-subtitle>Select a file and click button to upload</v-card-subtitle>
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
          <v-card-text class="hidden-sm-and-down">
            <app-table
              :contents="{
									header: ['Name', 'Type', 'Last Modified', 'Size', 'Progress'],
									body: [uploadedFile],
								}"
            >
              <template v-slot:upload-complete>
                <td v-show="uploadPercentage">
                  <v-progress-linear v-model="uploadPercentage" reactive height="25">
                    <strong>
                      {{
                      message || uploadPercentage.toString() + '%'
                      }}
                    </strong>
                  </v-progress-linear>
                </td>
                <td v-show="uploadPercentage === 100">
                  <v-icon @click="uploadedFile = {}">mdi-close</v-icon>
                </td>
              </template>
            </app-table>
          </v-card-text>
          <v-card-actions class="px-4">
            <v-checkbox
              label="Convert to Image File"
              :disabled="!file || snackbar"
              v-model="isConverted"
            ></v-checkbox>
            <v-spacer />
            <v-btn
              type="submit"
              :disabled="!file || snackbar"
              class="blue-grey darken-4 white--text"
              depressed
            >upload</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
    <v-container>
      <v-card outlined>
        <v-card-title>
          Files in Bucket
          <v-spacer />
          <v-chip
            v-show="bucket.length"
            class="blue-grey darken-4 white--text"
          >{{ bucket.length }} {{ bucket.length !== 1 ? 'Objects' : 'Object'}}</v-chip>
        </v-card-title>
        <v-card-subtitle>List of files uploaded to bucket</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text class="hidden-md-and-up">
          <v-list>
            <v-list-item v-for="(item, index) in bucket" :key="index">
              <v-list-item-content>
                <v-list-item-title v-text="item.Key" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text class="hidden-sm-and-down">
          <app-table
            :contents="{
								header: ['Name', 'Last Modified', 'Size'],
								body: bucket,
							}"
          >
            <template v-slot:select-all>
              <th>
                <v-checkbox
                  v-model="selectAll"
                  @change="selectAllChangeHandler"
                  :disabled="!bucket.length"
                  color="blue-grey darken-4"
                />
              </th>
            </template>
            <template v-slot:select="{ itemKey }">
              <td>
                <v-checkbox
                  v-model="selection"
                  @change="selectAll = selection.length === bucket.length"
                  :value="itemKey"
                  color="blue-grey darken-4"
                />
              </td>
            </template>
            <template v-slot:link-button="{ itemKey }">
              <td>
                <v-btn
                  width="85"
                  class="blue-grey darken-4 white--text"
                  text
                  @click="openLinkHandler(itemKey)"
                  :title="itemKey"
                >link</v-btn>
              </td>
            </template>
            <v-banner>Bucket Is Empty</v-banner>
          </app-table>
        </v-card-text>
        <v-card-actions class="hidden-sm-and-down">
          <v-spacer />
          <v-btn
            class="blue-grey darken-4 white--text"
            text
            :disabled="!selection.length"
            depressed
            @click="dialog = true"
          >delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-dialog v-model="dialog" max-width="290" persistent>
      <v-card>
        <v-card-title>Delete</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-2">
          Are you sure you want to delete file(s) from the
          bucket?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteFilesHandler">yes</v-btn>
          <v-btn text @click="dialog = false">no</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
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
          this.uploadPercentage = 0;
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
        this.message = error.response.data.message;
        this.snackbar = true;
      }
    },
    async deleteFilesHandler() {
      try {
        this.dialog = false;
        const response = await axios.delete("/", {
          data: { contents: this.selection }
        });
        this.message = response.data.message;
        this.getBucket();
      } catch (error) {
        this.message = error.response.data.message;
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
        this.file = "";
      } else {
        this.snackbar = false;
      }
    },
    async onSubmit() {
      try {
        this.message = "";
        const formData = new FormData();
        formData.append("file", this.file);
        const file = this.file;
        this.$set(this.uploadedFile, "name", file.name);
        this.$set(this.uploadedFile, "type", file.type);
        this.$set(this.uploadedFile, "lastModified", file.lastModified);
        this.$set(this.uploadedFile, "size", file.size);
        await axios.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
        this.message = error.response.data.message;
      } finally {
        this.file = "";
      }
    }
  },
  components: {
    AppTable: () => import("../Table/Index")
  }
};
</script>

<style></style>
