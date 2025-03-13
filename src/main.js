import './assets/styles.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './utils/apiClient'; // Import API client with interceptors

// Initialize dark mode from localStorage before mounting the app
const initializeDarkMode = () => {
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "dark" || (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    // Set explicit background color for overscroll in dark mode
    document.documentElement.style.backgroundColor = '#111827'; // Tailwind gray-900
    localStorage.setItem("darkMode", "dark");
  } else {
    document.documentElement.classList.remove('dark');
    // Set explicit background color for overscroll in light mode
    document.documentElement.style.backgroundColor = '#ffffff'; // White
    localStorage.setItem("darkMode", "light");
  }
};

// Initialize dark mode before the app is mounted
initializeDarkMode();

const app = createApp(App)
app.use(router)
app.mount('#app')
