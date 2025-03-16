import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import Terms from '../components/Terms.vue'
import VerifyEmail from '../components/VerifyEmail.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'
import Documents from '../components/Documents.vue'
import Database from '../components/Database.vue'
import GamePlan from '../components/GamePlan.vue'
import Profile from '../components/Profile.vue'
import EditProfile from '../components/EditProfile.vue'
import NewPage from '../components/NewPage.vue'
import EditPage from '../components/EditPage.vue'
import ViewPage from '../components/ViewPage.vue'
import PrivacyPolicy from '../components/PrivacyPolicy.vue'
import YouTubeCallback from '../components/YouTubeCallback.vue'
import { isTokenValid } from '../utils/auth'
import { refreshAccessToken } from '../utils/auth'

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/terms', name: 'Terms', component: Terms },
  { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail, props: true},
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, props: true},
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, props: true},
  { path: '/docs', name: 'Documents', component: Documents },
  { path: '/database', name: 'Database', component: Database, meta: { requiresAuth: true } },
  { path: '/gameplan', name: 'GamePlan', component: GamePlan, meta: { requiresAuth: true } },
  { path: '/viewprofile/:userName', name: 'Profile', component: Profile, props: true, meta: { requiresAuth: true } },
  { path: '/editprofile/:userName', name: 'EditProfile', component: EditProfile, props: true, meta: { requiresAuth: true } },
  { path: '/newpost', name: 'NewPage', component: NewPage, meta: { requiresAuth: true } },
  { path: '/editpost/:postId', name: 'EditPage', component: EditPage, props: true, meta: { requiresAuth: true } },
  { path: '/viewpost/:postId', name: 'ViewPage', component: ViewPage, props: true, meta: { requiresAuth: false } },
  { path: '/auth/youtube/callback', name: 'YouTubeCallback', component: YouTubeCallback, meta: { requiresAuth: true } }
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
    if (accessToken && isTokenValid()) {
      next();
    } else if (refreshToken) {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        proceedAfterRefresh(newAccessToken);
      } catch (error) {
        console.log("Failed to refresh token:", error);
        // Clear tokens since they're invalid or expired
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        next({ name: 'SignIn', query: { redirect: to.fullPath } });
      }
    } else {
      // No valid accessToken and no refreshToken, redirect to SignIn
      next({ name: 'SignIn', query: { redirect: to.fullPath } });
    }
  } else if ((to.name === 'SignIn' || to.name === 'SignUp') && accessToken && isTokenValid()) {
    // Redirect authenticated users away from SignIn and SignUp pages
    next({ name: 'Database' }); // Changed from ProfileCard to Database
  } else {
    // Proceed to the route if no restrictions apply
    next();
  }
});



export default router;
