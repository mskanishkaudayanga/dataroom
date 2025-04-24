<script>
  export default {
    name: "UploadFieldArea",
    props: {
      maxFiles: Number,
      language: {
        type: String,
        default: 'DEU'
      },
      defaultFiles: {
        type: Object,
        default: []
      },
      allowedTypes: {
        type: Object,
        default: ['.pdf','.jpg','.jpeg','.png'],
      }
    },
    data() {
      return {
        isDragging: false,
        files: this.defaultFiles,
        random: Math.floor(Math.random() * 1000000000 + 1000000000),
        errorMsg: '',
      };
    },
    methods: {
      onChange() {

        let fileTypeValid = true;
        let fileSizeValid = true;
        for(const index in this.$refs.file.files) {
          if ( !isNaN(parseInt(index)) ) {
            let fileType = this.$refs.file.files[index].type;
            fileTypeValid = this.checkFileType(fileType);
            fileSizeValid = this.checkFileSize(this.$refs.file.files[index].size);
          }
        }

        if ( !fileSizeValid ) {
          this.errorMsg = 'Maximale Größe pro Datei beiträgt 15 MB';
          return;
        }

        if ( !fileTypeValid ) {
          this.errorMsg = 'Datei ist nicht erlaubt. Erlaubte Dateien sind: '+this.allowedTypesAsString;
        } else {
          if ( this.files.length > 0 ) {
            for ( const index in this.$refs.file.files ) {
              if ( index !== 'length' && index !== 'item' ) {
                for ( const indexExsting in this.files ) {
                  if ( this.$refs.file.files[index].name === this.files[indexExsting].name ) {
                    // Overwrite exsting file
                    this.files.splice(indexExsting, 1);
                  }
                }
              }
            }
            this.files = [...this.$refs.file.files, ...this.files];
          } else {
            this.files = [...this.$refs.file.files];
          }

          if ( this.maxFiles === 1 && this.files.length > 1 ){
            this.files.splice(1, this.files.length);
          }

          this.$emit('uploadedFiles', this.files)
        }

      },
      dragover(e) {
        e.preventDefault();
        this.isDragging = true;
      },
      dragleave() {
        this.isDragging = false;
      },
      drop(e) {
        e.preventDefault();
        this.$refs.file.files = e.dataTransfer.files;
        this.onChange();
        this.isDragging = false;
      },
      remove(i) {
        if ( this.maxFiles === 1 ){
          this.files = [];
        }
        if ( this.maxFiles > 1 ){
          this.files.splice(i, 1);
        }
        this.$emit('uploadedFiles', this.files)
      },
      checkFileType(type) {
        let valid = false;

        let readableTypeValue = ''
        if ( type === 'application/pdf' ){
          readableTypeValue = '.pdf';
        }

        if ( type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ){
          readableTypeValue = '.xls';
        }

        if ( type.startsWith('image/') ){
          readableTypeValue = ['.jpg', '.jpeg', '.png'];
        }

        if ( typeof readableTypeValue === 'object'){
          for ( const [index, val] in readableTypeValue ){
            if ( this.allowedTypes.includes(readableTypeValue[index]) ){
              valid = true;
            }
          }
        } else {
          if ( this.allowedTypes.includes(readableTypeValue) ){
            valid = true;
          }
        }

        return valid;

      },
      checkFileSize(size) {
        // Check if size is under 15 mb
        return (size / 1000000) <= 15;
      }
    },
    computed: {
      allowedTypesAsString() {
        let returnVal = '';
        for( const [index, val] in this.allowedTypes ) {
          if ( returnVal !== '' ){
            returnVal += ', '+this.allowedTypes[index];
          } else {
            returnVal = this.allowedTypes[index];
          }
        }
        return returnVal
      }
    }
  }
</script>


<template>

    <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        :class="{ isdragging: isDragging }"
    >

      <input
          type="file"
          multiple
          name="file"
          :id="'fileInput-'+random"
          class="hidden-input"
          @change="onChange"
          ref="file"
          :accept="allowedTypesAsString"
      />

      <label :for="'fileInput-'+random" class="file-label">
        <div v-if="isDragging" data-cy="title">{{ language === 'DEU' ? 'Datei hier hineinziehen.' : 'Drag file here.' }}</div>
        <div v-else>
          <span v-if="language === 'DEU'">Datei hier hineinziehen oder <u>klicken</u> um hochzuladen.</span>
          <span v-else>Drag file here or <u>click</u> to upload.</span>
        </div>
      </label>

      <TransitionGroup name="fadein">

        <div class="preview-container mt-4" v-if="files.length">
          <div v-for="file in files" :key="file.name" class="preview-card">
              <div>
                  <p>
                    {{ file.name }}
                  </p>
              </div>
            <div>
              <button
                  class="ml-2"
                  type="button"
                  @click="remove(files.indexOf(file))"
                  title="Remove file"
              >
                <b>×</b>
              </button>
            </div>
          </div>
        </div>
        <div class="error-msg" v-if="errorMsg !== ''">{{errorMsg}}</div>

      </TransitionGroup>

    </div>

</template>


<style scoped>

.dropzone-container {
  padding: 4rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
}

.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
  text-align: center;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.preview-card {
  display: flex;
  flex-basis: 100%;
  justify-content: space-between;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin-left: 5px;
}

.preview-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #a2a2a2;
  background-color: #a2a2a2;
}

.isdragging .file-label,
.isdragging .preview-container {
  pointer-events: none;
}

.error-msg {
  text-align: center;
  margin-top: 10px;
  font-style: italic;
}

</style>
