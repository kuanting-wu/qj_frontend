<template>
  <main class="flex flex-col min-h-screen px-6 py-12 bg-white dark:bg-gray-900 transition-colors duration-200">
    <div class="max-w-4xl mx-auto w-full">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 transition-colors duration-200">
        Add New Video
      </h1>

      <!-- Destination Selection -->
      <div class="justify-center mb-8">
        <h2 class="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">Select
          Destination</h2>
        <div class="flex justify-center">
          <!-- URL Card -->
          <div @click="selectDestination('url')"
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 text-center hover:shadow-md"
            :class="{ 'ring-2 ring-blue-500 dark:ring-zinc-400': selectedDestination === 'url' }">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg class="w-8 h-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">Video
              URL</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Use an existing video from YouTube, Vimeo, or Bilibili
            </p>
          </div>

          <!-- YouTube Card 
          <div 
            @click="selectDestination('youtube')"
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 text-center hover:shadow-md"
            :class="{'ring-2 ring-blue-500 dark:ring-zinc-400': selectedDestination === 'youtube'}"
          >
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">YouTube</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Upload video to your YouTube channel
            </p>
          </div>
          -->
          <!-- Vimeo Card 
          <div 
            @click="selectDestination('vimeo')"
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 text-center hover:shadow-md"
            :class="{'ring-2 ring-blue-500 dark:ring-zinc-400': selectedDestination === 'vimeo'}"
          >
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.9765 6.4168c-.105 2.3384-1.7385 5.5395-4.8982 9.6035-3.2667 4.2733-6.0258 6.4099-8.2775 6.4099-1.3978 0-2.5817-1.291-3.5517-3.8731-.6444-2.3679-1.2898-4.7348-1.9352-7.1027-.7158-2.5817-1.4826-3.8721-2.3023-3.8721-.1783 0-.8045.3777-1.8771 1.1311L0 6.93621l3.131-2.7655c1.4161-1.2282 2.2083-1.8761 2.3776-1.9448 1.2492-.7158 2.5366-.4486 3.8603.8045.6169.6149 1.1142 1.9521 1.4799 4.0122.3746 2.1769.6357 3.3321.7783 3.466.4278 1.9342 .899 2.9013 1.4136 2.9013.3996 0 .9995-.6313 1.7997-1.894.7982-1.2627 1.2262-2.2233 1.2832-2.8817.1139-1.0878-.3149-1.6329-1.2831-1.6329-.4576 0-.9297.1054-1.4162.3159 .9407-3.0767 2.7401-4.5731 5.3984-4.4954 1.9672.04 2.8936 1.3311 2.7795 3.874z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">Vimeo</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Upload video to your Vimeo account
            </p>
          </div>
          -->
        </div>
      </div>

      <!-- Content based on selected destination -->
      <div v-if="selectedDestination" class="mb-8">

        <div v-if="selectedDestination === 'url'"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 class="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">Enter
            Video URL</h2>

          <div class="mb-6">
            <label for="videoUrl"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Video URL
            </label>
            <input id="videoUrl" type="text" v-model="formData.video_url" @input="extractVideoId"
              placeholder="Paste YouTube, Vimeo or Bilibili URL here"
              class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors duration-200" />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Supported platforms: YouTube, Vimeo, Bilibili
            </p>
          </div>

          <div v-if="videoPreview.id && videoPreview.platform"
            class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
            <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Video Preview
            </h3>
            <div class="aspect-video w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden">
              <iframe v-if="videoPreview.platform === 'YouTube'"
                :src="`https://www.youtube.com/embed/${videoPreview.id}`" class="w-full h-full" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
              <iframe v-else-if="videoPreview.platform === 'Vimeo'"
                :src="`https://player.vimeo.com/video/${videoPreview.id}`" class="w-full h-full" frameborder="0"
                allow="autoplay; fullscreen" allowfullscreen></iframe>
              <iframe v-else-if="videoPreview.platform === 'Bilibili'"
                :src="`https://player.bilibili.com/player.html?bvid=${videoPreview.id}`" class="w-full h-full"
                frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
          </div>
        </div>

        <!-- Youtube destination
        <div v-else-if="selectedDestination === 'youtube'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 class="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">Upload to YouTube</h2>
          

          <div v-if="isYouTubeAuthenticated" class="mb-6">
            <div class="space-y-4">

              <div>
                <label for="youtube-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="youtube-title"
                  type="text"
                  v-model="youtubeMetadata.title"
                  placeholder="Enter video title"
                  :disabled="youtubeUploadInitialized"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors duration-200"
                />
              </div>
              

              <div>
                <label for="youtube-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Description
                </label>
                <textarea
                  id="youtube-description"
                  v-model="youtubeMetadata.description"
                  placeholder="Enter video description"
                  :disabled="youtubeUploadInitialized"
                  rows="4"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors duration-200"
                ></textarea>
              </div>
              

              <div v-if="!youtubeUploadInitialized" class="mt-4">
                <button 
                  @click="initializeYouTubeUpload"
                  :disabled="!youtubeMetadata.title"
                  class="px-5 py-2.5 w-full text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg v-if="isInitializing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isInitializing ? 'Preparing Upload...' : 'Continue to File Selection' }}
                </button>
              </div>
            </div>
          </div>
          

          <div v-if="!isYouTubeAuthenticated" class="text-center py-6">
            <p class="mb-6 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Connect your YouTube account to upload videos
            </p>
            

            <button 
              @click="authenticateYouTube"
              class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center mx-auto mb-4"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Connect to YouTube
            </button>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              This will open YouTube's authorization page
            </p>
          </div>
          

          <div v-else class="py-4">
            <h3 class="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">Choose Video Source</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              <div 
                @click="selectedSource = 'local'"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="{'bg-gray-50 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-zinc-400': selectedSource === 'local',
                         'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': selectedSource !== 'local'}"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">Local File</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Upload from your device</p>
                  </div>
                </div>
              </div>
              

              <div 
                @click="selectGoogleDriveSource"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="{'bg-gray-50 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-zinc-400': selectedSource === 'drive',
                         'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': selectedSource !== 'drive'}"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0297 9.00092L4.19789 22.0676H19.8016L24.0004 13.0338L12.0297 9.00092Z"/>
                      <path d="M19.8016 22.0676L12.0297 9.00092L4.19789 22.0676H19.8016Z"/>
                      <path d="M0 13.0338L4.19873 22.0676L12.0305 9.00092L0 13.0338Z"/>
                      <path d="M12.0005 9.00092L7.83001 0L0 13.0338L12.0005 9.00092Z"/>
                      <path d="M16.1709 0L7.83001 0L12.0005 9.00092L16.1709 0Z"/>
                      <path d="M24.0004 13.0338L16.1709 0L12.0005 9.00092L24.0004 13.0338Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">Google Drive</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Select from your Drive</p>
                  </div>
                </div>
              </div>
            </div>
            

            <div v-if="selectedSource === 'local'" class="mt-6">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="pt-1 text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">MP4, MOV, or WEBM (Max 2GB)</p>
                  </div>
                  <input type="file" class="hidden" accept="video/*" @change="handleFileUpload" />
                </label>
              </div>
              

              <div v-if="localFile" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ localFile.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 transition-colors duration-200">
                  <div class="bg-green-500 h-2.5 rounded-full" :style="`width: ${uploadProgress}%`"></div>
                </div>
              </div>
            </div>
            

            <div v-if="selectedSource === 'drive' && !isGoogleDriveAuthenticated" class="mt-6 text-center">
              <button 
                @click="authenticateGoogleDrive"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center mx-auto mb-4"
              >
                Connect to Google Drive
              </button>
              
              <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Authentication required to access your Drive files
              </p>
            </div>
            
            <div v-else-if="selectedSource === 'drive' && isGoogleDriveAuthenticated" class="mt-6 text-center">
              <button 
                @click="openGoogleDrivePicker"
                class="px-6 py-3 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-500 transition duration-150 flex items-center justify-center mx-auto"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.40625 14.8125L9.5 3.75L16.5937 14.8125H2.40625Z"/>
                  <path d="M16.5938 14.8125L21.5 22.75H7.5L2.40625 14.8125H16.5938Z"/>
                  <path d="M21.5 22.75L14.5 11.6875L7.5 22.75H21.5Z"/>
                </svg>
                Browse Google Drive
              </button>
            </div>
          </div>
        </div>
      -->

        <!-- Vimeo destination 
        <div v-else-if="selectedDestination === 'vimeo'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 class="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-200">Upload to Vimeo</h2>
          

          <div v-if="!isVimeoAuthenticated" class="text-center py-6">
            <p class="mb-6 text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Connect your Vimeo account to upload videos
            </p>
            
            <button 
              @click="authenticateVimeo"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center mx-auto mb-4"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.9765 6.4168c-.105 2.3384-1.7385 5.5395-4.8982 9.6035-3.2667 4.2733-6.0258 6.4099-8.2775 6.4099-1.3978 0-2.5817-1.291-3.5517-3.8731-.6444-2.3679-1.2898-4.7348-1.9352-7.1027-.7158-2.5817-1.4826-3.8721-2.3023-3.8721-.1783 0-.8045.3777-1.8771 1.1311L0 6.93621l3.131-2.7655c1.4161-1.2282 2.2083-1.8761 2.3776-1.9448 1.2492-.7158 2.5366-.4486 3.8603.8045.6169.6149 1.1142 1.9521 1.4799 4.0122.3746 2.1769.6357 3.3321.7783 3.466.4278 1.9342 .899 2.9013 1.4136 2.9013.3996 0 .9995-.6313 1.7997-1.894.7982-1.2627 1.2262-2.2233 1.2832-2.8817.1139-1.0878-.3149-1.6329-1.2831-1.6329-.4576 0-.9297.1054-1.4162.3159 .9407-3.0767 2.7401-4.5731 5.3984-4.4954 1.9672.04 2.8936 1.3311 2.7795 3.874z"/>
              </svg>
              Connect to Vimeo
            </button>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              This will open Vimeo's authorization page
            </p>
          </div>
          

          <div v-else class="py-4">
            <h3 class="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300 transition-colors duration-200">Choose Video Source</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              <div 
                @click="selectedSource = 'local'"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="{'bg-gray-50 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-zinc-400': selectedSource === 'local',
                         'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': selectedSource !== 'local'}"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">Local File</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Upload from your device</p>
                  </div>
                </div>
              </div>
              

              <div 
                @click="selectGoogleDriveSource"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200"
                :class="{'bg-gray-50 dark:bg-gray-700 ring-2 ring-blue-500 dark:ring-zinc-400': selectedSource === 'drive',
                         'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700': selectedSource !== 'drive'}"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 transition-colors duration-200">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0297 9.00092L4.19789 22.0676H19.8016L24.0004 13.0338L12.0297 9.00092Z"/>
                      <path d="M19.8016 22.0676L12.0297 9.00092L4.19789 22.0676H19.8016Z"/>
                      <path d="M0 13.0338L4.19873 22.0676L12.0305 9.00092L0 13.0338Z"/>
                      <path d="M12.0005 9.00092L7.83001 0L0 13.0338L12.0005 9.00092Z"/>
                      <path d="M16.1709 0L7.83001 0L12.0005 9.00092L16.1709 0Z"/>
                      <path d="M24.0004 13.0338L16.1709 0L12.0005 9.00092L24.0004 13.0338Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">Google Drive</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Select from your Drive</p>
                  </div>
                </div>
              </div>
            </div>
            

            <div v-if="selectedSource === 'local'" class="mt-6">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="pt-1 text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">MP4, MOV, or WEBM (Max 2GB)</p>
                  </div>
                  <input type="file" class="hidden" accept="video/*" @change="handleFileUpload" />
                </label>
              </div>
              

              <div v-if="localFile" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">{{ localFile.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 transition-colors duration-200">
                  <div class="bg-green-500 h-2.5 rounded-full" :style="`width: ${uploadProgress}%`"></div>
                </div>
              </div>
            </div>
            
            <div v-if="selectedSource === 'drive' && !isGoogleDriveAuthenticated" class="mt-6 text-center">
              <button 
                @click="authenticateGoogleDrive"
                class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center mx-auto mb-4"
              >
                Connect to Google Drive
              </button>
              
              <p class="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Authentication required to access your Drive files
              </p>
            </div>
            
            <div v-else-if="selectedSource === 'drive' && isGoogleDriveAuthenticated" class="mt-6 text-center">
              <button 
                @click="openGoogleDrivePicker"
                class="px-6 py-3 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-500 transition duration-150 flex items-center justify-center mx-auto"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.40625 14.8125L9.5 3.75L16.5937 14.8125H2.40625Z"/>
                  <path d="M16.5938 14.8125L21.5 22.75H7.5L2.40625 14.8125H16.5938Z"/>
                  <path d="M21.5 22.75L14.5 11.6875L7.5 22.75H21.5Z"/>
                </svg>
                Browse Google Drive
              </button>
            </div>
            
          </div>
        </div>
      </div>
      -->
        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button @click="router.push('/database')"
            class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            Cancel
          </button>
          <button @click="saveVideo" :disabled="!canProceed"
            class="px-5 py-2.5 text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Save Video
          </button>
        </div>

        <!-- Notification Banner -->
        <div v-if="notification.show"
          class="fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md transition-colors duration-200" :class="[
            notification.type === 'error'
              ? 'bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
              : notification.type === 'info'
                ? 'bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                : 'bg-green-100 dark:bg-green-900/60 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200'
          ]">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg v-if="notification.type === 'error'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else-if="notification.type === 'info'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3 flex-grow">
              <p class="text-sm font-medium">{{ notification.message }}</p>
            </div>
            <div class="ml-auto pl-3 flex-shrink-0">
              <button @click="notification.show = false" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/config';

export default {
  setup() {
    const router = useRouter();
    const selectedDestination = ref('');
    const selectedSource = ref('local');
    const uploadProgress = ref(0);
    const localFile = ref(null);
    const isYouTubeAuthenticated = ref(false);
    const isVimeoAuthenticated = ref(false);
    const isGoogleDriveAuthenticated = ref(false);
    const isUploading = ref(false);
    const youtubeUploadInitialized = ref(false);
    const youtubeUploadStarted = ref(false);
    const youtubeUploadProgress = ref(0);
    const isInitializing = ref(false);
    const youtubeUploadUrl = ref('');

    const notification = ref({
      show: false,
      type: 'error',
      message: ''
    });

    const formData = ref({
      video_url: '',
      title: '',
      video_id: '',
      video_platform: ''
    });

    // YouTube video metadata
    const youtubeMetadata = ref({
      title: '',
      description: ''
    });

    // UI state for JSON preview
    const showJsonPreview = ref(false);

    const videoPreview = ref({
      id: '',
      platform: ''
    });

    // Function to select a destination
    const selectDestination = (destination) => {
      selectedDestination.value = destination;

      // Reset source selection when changing destination
      if (destination !== 'url') {
        selectedSource.value = 'local';
      }
    };

    // Function to select Google Drive source
    const selectGoogleDriveSource = () => {
      selectedSource.value = 'drive';

      // If not already authenticated, prompt for authentication
      if (!isGoogleDriveAuthenticated.value) {
        authenticateGoogleDrive();
      }
    };

    // Function to extract video ID based on platform
    const extractVideoId = () => {
      const url = formData.value.video_url;

      // Check for YouTube video ID
      const youtubeMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (youtubeMatch) {
        formData.value.video_id = youtubeMatch[1];
        formData.value.video_platform = 'YouTube';
        videoPreview.value = { id: youtubeMatch[1], platform: 'YouTube' };
        return;
      }

      // Check for Vimeo video ID
      const vimeoMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/
      );
      if (vimeoMatch) {
        formData.value.video_id = vimeoMatch[1];
        formData.value.video_platform = 'Vimeo';
        videoPreview.value = { id: vimeoMatch[1], platform: 'Vimeo' };
        return;
      }

      // Check for Bilibili video ID
      const bilibiliMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[0-9A-Za-z]+|av\d+)/
      );
      if (bilibiliMatch) {
        let videoId = bilibiliMatch[1];

        // Check for &p=? in the URL
        const pageMatch = url.match(/[?&]p=(\d+)/);
        if (pageMatch) {
          videoId += `&p=${pageMatch[1]}`;
        }

        formData.value.video_id = videoId;
        formData.value.video_platform = 'Bilibili';
        videoPreview.value = { id: videoId, platform: 'Bilibili' };
        return;
      }

      // Clear fields if the URL doesn't match
      formData.value.video_id = '';
      formData.value.video_platform = '';
      videoPreview.value = { id: '', platform: '' };
    };

    // Authentication functions
    const authenticateYouTube = async () => {
      try {
        // First check if user is already authenticated according to the backend
        const accessToken = localStorage.getItem('accessToken');

        try {
          // Call the token check endpoint
          const tokenCheckResponse = await axios.get(
            `${BACKEND_URL}/youtube/token-check`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );

          // If user is already authenticated, update UI
          if (tokenCheckResponse.data && tokenCheckResponse.data.authenticated) {
            isYouTubeAuthenticated.value = true;

            // Store token in localStorage for future use
            localStorage.setItem('youtubeAuthenticated', 'true');
            localStorage.setItem('youtubeAccessToken', tokenCheckResponse.data.accessToken);

            showNotification('Already connected to YouTube', 'success');
            return;
          }
        } catch (tokenCheckError) {
          console.error('Error checking YouTube token status:', tokenCheckError);
          // Continue with authentication if token check fails
        }

        // Get authentication URL from the backend
        const response = await axios.get(
          `${BACKEND_URL}/youtube/auth`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        // Check if already authenticated
        if (response.data.alreadyAuthenticated) {
          isYouTubeAuthenticated.value = true;
          localStorage.setItem('youtubeAuthenticated', 'true');
          showNotification('Already connected to YouTube', 'success');
          return;
        }

        // Get the auth URL from the response
        const { authUrl } = response.data;

        // Open the auth URL in a popup window
        const width = 800;
        const height = 700;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
          authUrl,
          'YouTube Authentication',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Show notification
        showNotification(
          'Please authorize YouTube access in the popup. The window will close automatically when complete.',
          'info',
          10000
        );

        // Set manual authentication state - we'll have the user try the operation when ready
        const youtubeWindow = window.open(
          authUrl,
          'YouTube Authentication',
          `width=800,height=700,left=${(window.innerWidth - 800) / 2},top=${(window.innerHeight - 700) / 2}`
        );

        // Show instructions to the user
        showNotification(
          'Please complete the authentication in the popup. When you see a success message, the window will close automatically.',
          'info',
          15000
        );
      } catch (error) {
        console.error('Error starting YouTube authentication:', error);
        showNotification('Failed to connect to YouTube', 'error');
      }
    };

    // YouTube token is now automatically saved by the backend

    const authenticateVimeo = () => {
      // This would open a popup window to authenticate with Vimeo
      showNotification('Vimeo authentication is not yet implemented', 'error');

      // For demo purposes
      setTimeout(() => {
        isVimeoAuthenticated.value = true;
        showNotification('Connected to Vimeo successfully', 'success');
      }, 1000);
    };

    const authenticateGoogleDrive = () => {
      // This would open a popup window to authenticate with Google Drive
      showNotification('Google Drive authentication is not yet implemented', 'error');

      // For demo purposes
      setTimeout(() => {
        isGoogleDriveAuthenticated.value = true;
        showNotification('Connected to Google Drive successfully', 'success');
      }, 1000);
    };

    const openGoogleDrivePicker = () => {
      // This would open the Google Drive picker
      showNotification('Selecting file from Google Drive...', 'success');

      // For demo purposes, simulate file selection after a delay
      setTimeout(() => {
        const mockFileName = "My_Video_" + Math.floor(Math.random() * 1000) + ".mp4";
        localFile.value = { name: mockFileName };
        simulateUpload({ name: mockFileName });
      }, 1500);
    };

    // File handling functions
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
    };

    const saveVideo = async () => {
      try {
        if (selectedDestination.value === 'url' && (!formData.value.video_id || !formData.value.video_platform)) {
          showNotification('Please enter a valid video URL', 'error');
          return;
        }

        if ((selectedDestination.value === 'youtube' || selectedDestination.value === 'vimeo') && uploadProgress.value < 100) {
          showNotification('Please wait for the upload to complete', 'error');
          return;
        }

        // For YouTube uploads, if we've completed the file upload but haven't initiated the YouTube upload yet
        if (selectedDestination.value === 'youtube' && !formData.value.video_id && localFile.value && uploadProgress.value >= 100) {
          if (isYouTubeAuthenticated.value) {
            // Use a temporary video ID since we're just storing the local file reference
            const tempVideoId = 'local-youtube-' + Math.random().toString(36).substring(2, 12);
            formData.value.video_id = tempVideoId;
            formData.value.video_platform = 'YouTube';
            formData.value.title = youtubeMetadata.value.title || localFile.value.name || 'Untitled Video';

            // You can add a warning here about the YouTube upload not being completed
            showNotification('Note: This will save the video details but won\'t upload to YouTube yet', 'info', 3000);
          } else {
            showNotification('Please authenticate with YouTube first', 'error');
            return;
          }
        }

        // Set default title if not provided
        if (!formData.value.title) {
          if (youtubeMetadata.value.title && selectedDestination.value === 'youtube') {
            formData.value.title = youtubeMetadata.value.title;
          } else {
            formData.value.title = `Video ${formData.value.video_id || 'Untitled'}`;
          }
        }

        const accessToken = localStorage.getItem('accessToken');

        const postData = {
          title: formData.value.title,
          video_id: formData.value.video_id,
          video_platform: formData.value.video_platform,
          // Following fields are set to defaults - will be editable later
          movement_type: 'General',
          starting_position: 'Not Specified',
          starting_top_bottom: 'NEUTRAL',
          ending_position: 'Not Specified',
          ending_top_bottom: 'NEUTRAL',
          gi_nogi: 'Gi',
          practitioner: '',
          sequence_start_time: '00:00:00',
          public_status: 'public',
          language: 'English',
          notes: ''
        };

        const response = await axios.post(
          `${BACKEND_URL}/newpost`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        const postId = response.data.post_id;

        showNotification('Video saved successfully!', 'success');

        // Navigate to edit page after brief delay to show success notification
        setTimeout(() => {
          router.push(`/editpost/${postId}`);
        }, 1500);
      } catch (error) {
        console.error('Error saving video:', error);
        showNotification(
          error.response?.data?.error || 'Failed to save video',
          'error'
        );
      }
    };

    const showNotification = (message, type = 'error', duration = 5000) => {
      notification.value = {
        show: true,
        type: type,
        message: message
      };

      setTimeout(() => {
        notification.value.show = false;
      }, duration);
    };

    const canProceed = computed(() => {
      // For URL destination
      if (selectedDestination.value === 'url') {
        return formData.value.video_id && formData.value.video_platform;
      }

      // For YouTube destination with file upload
      if (selectedDestination.value === 'youtube' && isYouTubeAuthenticated.value) {
        // We can proceed if either:
        // 1. A video is uploaded and we have a video_id (from the automatic process)
        // 2. A file is selected and upload is complete (allowing manual Save)
        return (formData.value.video_id && formData.value.video_platform === 'YouTube') ||
          (localFile.value && uploadProgress.value >= 100);
      }

      // For Vimeo destination
      if (selectedDestination.value === 'vimeo' && isVimeoAuthenticated.value) {
        return uploadProgress.value === 100 && formData.value.video_id;
      }

      return false;
    });

    onMounted(() => {
      // Check if YouTube is already authenticated
      const storedAuth = localStorage.getItem('youtubeAuthenticated');
      const storedToken = localStorage.getItem('youtubeAccessToken');

      if (storedAuth === 'true' && storedToken) {
        console.log('Found YouTube access token in localStorage');
        isYouTubeAuthenticated.value = true;

        // Check if we just returned from auth flow
        if (window.sessionStorage.getItem('returningFromYouTubeAuth')) {
          window.sessionStorage.removeItem('returningFromYouTubeAuth');
          showNotification('Connected to YouTube successfully', 'success');
        }
      }
    });

    // No cleanup needed - we're not using intervals or timeouts


    return {
      router,
      selectedDestination,
      selectedSource,
      formData,
      videoPreview,
      uploadProgress,
      localFile,
      isYouTubeAuthenticated,
      isVimeoAuthenticated,
      isGoogleDriveAuthenticated,
      isUploading,
      youtubeMetadata,
      notification,
      selectDestination,
      selectGoogleDriveSource,
      extractVideoId,
      authenticateYouTube,
      authenticateVimeo,
      authenticateGoogleDrive,
      openGoogleDrivePicker,
      handleFileUpload,
      saveVideo,
      canProceed
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>