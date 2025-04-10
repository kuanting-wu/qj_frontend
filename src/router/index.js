import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../pages/Welcome.vue'
import SignIn from '../pages/auth/SignIn.vue'
import SignUp from '../pages/auth/SignUp.vue'
import Terms from '../pages/terms/Terms.vue'
import VerifyEmail from '../pages/auth/VerifyEmail.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Documents from '../pages/documents/Documents.vue'
import PostFinder from '../pages/postfinder/PostFinder.vue'
import GameFinder from '../pages/gamefinder/GameFinder.vue'
import ViewGamePlan from '../pages/gameplan/ViewGamePlan.vue'
import ViewProfile from '../pages/profile/ViewProfile.vue'
import EditProfile from '../pages/profile/EditProfile.vue'
import NewPost from '../pages/post/NewPost.vue'
import EditPost from '../pages/post/EditPost.vue'
import ViewPost from '../pages/post/ViewPost.vue'
import PrivacyPolicy from '../pages/privacypolicy/PrivacyPolicy.vue'
import YouTubeCallback from '../components/content/YouTubeCallback.vue'
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
  { path: '/postfinder', name: 'PostFinder', component: PostFinder, props: true, meta: { requiresAuth: false } },
  { path: '/gamefinder', name: 'GameFinder', component: GameFinder, props: true, meta: { requiresAuth: false } },
  { path: '/viewgameplan/:id', name: 'ViewGamePlan', component: ViewGamePlan, props: true, meta: { requiresAuth: false } },
  { path: '/viewprofile/:userName', name: 'ViewProfile', component: ViewProfile, props: true, meta: { requiresAuth: false } },
  { path: '/editprofile/:userName', name: 'EditProfile', component: EditProfile, props: true, meta: { requiresAuth: true } },
  { path: '/newpost', name: 'NewPost', component: NewPost, meta: { requiresAuth: true } },
  { path: '/editpost/:id', name: 'EditPost', component: EditPost, props: true, meta: { requiresAuth: true } },
  { path: '/viewpost/:id', name: 'ViewPost', component: ViewPost, props: true, meta: { requiresAuth: false } },
  { path: '/auth/youtube/callback', name: 'YouTubeCallback', component: YouTubeCallback, meta: { requiresAuth: false } }
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
