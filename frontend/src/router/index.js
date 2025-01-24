import { isLoggedIn } from '@/store/authState';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/Products.vue'),
    },
    {
      path: '/product/:id',
      name: 'ProductDetails',
      component: () => import('../views/ProductDetails.vue'),
      props: true,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/Blog.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignIn.vue'),
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../views/Feed.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/Info.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLoggedIn) {
      next();
    } else {
      alert('Nie masz dostępu do tej podstrony!');
      next('/');
    }
  } else {
    next();
  }
});

export default router;
