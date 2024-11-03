// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import DatabasePanel from '../components/DatabasePanel.vue'
import ProfileCard from '../components/ProfileCard.vue'
import NewPage from '../components/NewPage.vue'
import EditPage from '../components/EditPage.vue'
import { isTokenValid } from '../utils/auth'

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/database', name: 'DatabasePanel', component: DatabasePanel, meta: { requiresAuth: true } },
  { path: '/profile', name: 'ProfileCard', component: ProfileCard, meta: { requiresAuth: true } },
  { path: '/newpage', name: 'NewPage', component: NewPage, meta: { requiresAuth: true } },
  { path: '/editpage', name: 'EditPage', component: EditPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to protect routes and manage authentication checks
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken');
  const isAuthenticated = accessToken && isTokenValid(accessToken);

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to SignIn if trying to access a protected route without a valid token
    next({ name: 'SignIn', query: { redirect: to.fullPath } }); // Pass intended target in query
  } else if ((to.name === 'SignIn' || to.name === 'SignUp') && isAuthenticated) {
    // Redirect authenticated users away from SignIn and SignUp
    next({ name: 'ProfileCard' });
  } else {
    // Proceed to the route if no restrictions apply
    next();
  }
});

export default router;
