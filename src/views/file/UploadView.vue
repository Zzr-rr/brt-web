<template>
    <div class="upload-page">
      <div class="upload-container">
        <h1>上传文件</h1>
        <div class="upload-area">
          <p>目前仅支持5MB以内的PDF/DOC/DOCX/TXT文件上传，请确保文件格式正确</p>
          <div class="upload-button" @click="triggerFileInput">
            将文件拖拽至此处或点击上传
          </div>
          <input type="file" @change="handleFileUpload" class="file-input" ref="fileInput" />
          <!-- 显示文件名 -->
          <div v-if="fileName">
            <p>已选择文件：{{ fileName }}</p>
          </div>
        </div>
      </div>
      <button @click="uploadFile" class="upload-button" :disabled="!selectedFile">上传文件</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedFile: null,
        fileName: '' // 新增属性用于存储文件名
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
          // 检查文件类型
          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
          if (!validTypes.includes(this.selectedFile.type)) {
            alert('不支持的文件类型。请上传PDF、DOC、DOCX或TXT文件。');
            this.selectedFile = null;
            this.fileName = ''; // 重置文件名
            return;
          }
          // 检查文件大小
          if (this.selectedFile.size > 5 * 1024 * 1024) {
            alert('文件大小不能超过5MB');
            this.selectedFile = null;
            this.fileName = ''; // 重置文件名
            return;
          }
          this.fileName = this.selectedFile.name; // 获取文件名并存储
        }
      },
      uploadFile() {
        if (!this.selectedFile) {
          alert('请先选择一个文件');
          return;
        }
        const formData = new FormData();
        formData.append('file', this.selectedFile);
  
        // 这里使用 fetch 来模拟文件上传的过程，实际应用中你需要替换成你的后端API
        fetch('YOUR_BACKEND_API_URL', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          alert('文件上传成功');
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('文件上传失败');
        });
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      }
    }
  };
  </script>
  
  <style scoped>
  .upload-page {
    text-align: center;
    padding: 20px;
    background-color: #f7f7f7;
  }
  
  .upload-container {
    background-color: #fff;
    border: 2px dashed #ccc;
    padding: 40px;
    margin: 20px 0;
    position: relative;
  }
  
  .upload-area {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .file-input {
    display: none; /* Hide the actual input */
  }
  
  .upload-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    text-align: center;
  }
  
  .upload-button:hover {
    background-color: #45a049;
  }
  
  p {
    color: #666;
    font-size: 14px;
    text-align: center;
  }
  </style>
<!-- <template>
  <div class="upload-page">
    <div class="upload-container">
      <h1>上传文件</h1>
      <div class="upload-area">
        <p>目前仅支持5MB以内的PDF/DOC/DOCX/TXT文件上传，请确保文件格式正确</p>
        <input type="file" @change="handleFileUpload" class="file-input" />
        <label for="file-input" class="upload-button">
          将文件拖拽至此处或点击上传
        </label>
      </div>
    </div>
    <button @click="uploadFile" class="upload-button">上传文件</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (!this.selectedFile) {
        alert('请先选择一个文件');
        return;
      }
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过5MB');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // 这里使用 fetch 来模拟文件上传的过程，实际应用中你需要替换成你的后端API
      fetch('YOUR_BACKEND_API_URL', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('文件上传成功');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('文件上传失败');
      });
    }
  }
};
</script>

<style scoped>
.upload-page {
  text-align: center;
  padding: 20px;
  background-color: #f7f7f7;
}

.upload-container {
  background-color: #fff;
  border: 2px dashed #ccc;
  padding: 40px;
  margin: 20px 0;
  position: relative;
}

.upload-area {
  position: relative;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.upload-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.upload-button:hover {
  background-color: #45a049;
}

p {
  color: #666;
  font-size: 14px;
  text-align: center;
}
</style> -->

<!-- <template>
    <div>
        <h1>This is an upload page</h1>
    </div>
</template>
<script></script>
<style></style> -->


