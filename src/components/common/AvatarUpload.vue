<template>
  <div class="avatar-upload">
    <div class="avatar-preview">
      <img :src="previewImage || currentAvatar || defaultAvatar" alt="Avatar" class="avatar-img" />
      <div class="avatar-overlay" v-if="!isUploading">
        <label for="avatar-input" class="upload-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="upload-icon">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3l-8 8h5v8h6v-8h5l-8-8z" fill="currentColor"/>
          </svg>
          <span>Change</span>
        </label>
        <button v-if="canDelete" class="delete-btn" @click="deleteAvatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="delete-icon">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
          <span>Remove</span>
        </button>
      </div>
      <div class="progress" v-if="isUploading">
        <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        <div class="progress-text">{{ uploadProgress }}%</div>
      </div>
    </div>
    <input
      type="file"
      id="avatar-input"
      accept="image/*"
      @change="onFileSelected"
      class="file-input"
    />
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AvatarUpload',
  props: {
    currentAvatar: {
      type: String,
      default: ''
    },
    userId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      previewImage: null,
      file: null,
      isUploading: false,
      uploadProgress: 0,
      errorMessage: '',
      defaultAvatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1'
    };
  },
  computed: {
    canDelete() {
      return this.currentAvatar && this.currentAvatar !== this.defaultAvatar;
    },
    apiBaseUrl() {
      // Use dev API for local development, prod API for production
      const isLocalhost = window.location.hostname === 'localhost';
      return process.env.VUE_APP_API_URL || 
        (isLocalhost ? 'https://api-dev.quantifyjiujitsu.com' : 'https://api.quantifyjiujitsu.com');
    }
  },
  methods: {
    onFileSelected(event) {
      this.file = event.target.files[0];
      if (!this.file) {
        this.previewImage = null;
        return;
      }
      
      // Validate file type
      if (!this.file.type.match('image.*')) {
        this.errorMessage = 'Please select an image file (jpg, png, etc.)';
        this.file = null;
        this.previewImage = null;
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (this.file.size > maxSize) {
        this.errorMessage = 'Image is too large. Maximum size is 5MB.';
        this.file = null;
        this.previewImage = null;
        return;
      }
      
      this.errorMessage = '';
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        this.uploadAvatar();
      };
      reader.readAsDataURL(this.file);
    },
    async uploadAvatar() {
      if (!this.file) return;
      
      this.isUploading = true;
      this.uploadProgress = 0;
      this.errorMessage = '';
      
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        
        // Convert file to base64
        const base64Image = await this.fileToBase64(this.file);
        
        const token = localStorage.getItem('accessToken');
        
        // Direct upload through Lambda
        const response = await axios.post(
          `${this.apiBaseUrl}/avatar`,
          {
            operation: 'upload',
            imageData: base64Image,
            contentType: this.file.type
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              this.uploadProgress = percentCompleted;
            }
          }
        );
        
        // Save new tokens if they're returned
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          console.log('Tokens updated with new avatar URL');
        }
        
        // Emit the new avatar URL
        this.$emit('avatar-updated', response.data.avatarUrl);
        
        // Reset the file input
        document.getElementById('avatar-input').value = '';
        
        // Show success in UI
        this.isUploading = false;
        this.file = null;
      } catch (error) {
        console.error('Avatar upload failed:', error);
        this.errorMessage = error.response?.data?.error || 'Failed to upload avatar';
        this.isUploading = false;
      }
    },
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async deleteAvatar() {
      if (!this.currentAvatar || this.currentAvatar === this.defaultAvatar) return;
      
      try {
        this.isUploading = true;
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.post(
          `${this.apiBaseUrl}/avatar`,
          {
            operation: 'delete'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Save new tokens if they're returned
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          console.log('Tokens updated with default avatar URL');
        }
        
        // Emit the default avatar URL
        this.$emit('avatar-updated', response.data.defaultAvatarUrl);
        
        this.previewImage = null;
        this.isUploading = false;
      } catch (error) {
        console.error('Avatar deletion failed:', error);
        this.errorMessage = error.response?.data?.error || 'Failed to delete avatar';
        this.isUploading = false;
      }
    }
  }
};
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.upload-btn, .delete-btn {
  background-color: white;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.upload-btn:hover, .delete-btn:hover {
  background-color: #f0f0f0;
}

.upload-icon, .delete-icon {
  margin-right: 4px;
}

.file-input {
  display: none;
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
}

.progress-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 12px;
}

.error-message {
  color: #f44336;
  margin-top: 8px;
  font-size: 14px;
}
</style>