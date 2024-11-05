// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import DatabasePanel from '../components/DatabasePanel.vue'
import ProfileCard from '../components/ProfileCard.vue'
import NewPage from '../components/NewPage.vue'
import EditPage from '../components/EditPage.vue'
import ViewPage from '../components/ViewPage.vue';
import { isTokenValid } from '../utils/auth'
import { refreshAccessToken } from '../utils/auth'

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/database', name: 'DatabasePanel', component: DatabasePanel, meta: { requiresAuth: true } },
  { path: '/profile', name: 'ProfileCard', component: ProfileCard, meta: { requiresAuth: true } },
  { path: '/newpage', name: 'NewPage', component: NewPage, meta: { requiresAuth: true } },
  { path: '/editpage', name: 'EditPage', component: EditPage, meta: { requiresAuth: true } },
  { path: '/view/:postId', name: 'ViewPage', component: ViewPage, props: true, meta: { requiresAuth: false } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to protect routes and manage authentication checks
router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Function to handle redirection after token refresh
  const proceedAfterRefresh = (newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken);
    next();
  };

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (accessToken && isTokenValid(accessToken)) {
      // If accessToken is valid, proceed
      next();
    } else if (refreshToken) {
      try {
        // If accessToken is missing/invalid and refreshToken exists, attempt to refresh the token
        const newAccessToken = await refreshAccessToken(refreshToken);
        proceedAfterRefresh(newAccessToken);
      } catch (error) {
        // If refreshing fails, redirect to SignIn
        next({ name: 'SignIn', query: { redirect: to.fullPath } });
      }
    } else {
      // No valid accessToken and no refreshToken, redirect to SignIn
      next({ name: 'SignIn', query: { redirect: to.fullPath } });
    }
  } else if ((to.name === 'SignIn' || to.name === 'SignUp') && accessToken && isTokenValid(accessToken)) {
    // Redirect authenticated users away from SignIn and SignUp pages
    next({ name: 'ProfileCard' });
  } else {
    // Proceed to the route if no restrictions apply
    next();
  }
});



export default router;
