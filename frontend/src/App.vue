<template>
  <div>
    <header v-if="!isAuthView" class="bg-lime-500">
      <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="/" class="-m-1.5 p-1.5">
            <span class="sr-only">InFit</span>
            <img class="h-8 w-auto" src="@/assets/images/InFitLogo.png" alt="Logo" />
          </a>
        </div>
        <div class="flex lg:hidden">
          <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a v-if="isLoggedIn" href="/feed" class="text-sm font-semibold leading-6 text-gray-900"
            >Dziennik odżywiania</a
          >
          <a href="/products" class="text-sm font-semibold leading-6 text-gray-900">Baza produktów</a>
          <a href="/about" class="text-sm font-semibold leading-6 text-gray-900">O nas</a>
          <a href="/blog" class="text-sm font-semibold leading-6 text-gray-900">Blog</a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
          <a v-if="isLoggedIn === false" href="/sign-in" class="text-sm font-semibold leading-6 text-gray-900"
            >Log in &rarr;</a
          >
          <a v-if="isLoggedIn === false" href="/register" class="text-sm font-semibold leading-6 text-gray-900"
            >Register &rarr;</a
          >
          <button
            v-if="isLoggedIn"
            @click="goToProfile"
            class="text-sm font-semibold leading-6 text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
            Account
          </button>
          <button
            v-if="isLoggedIn"
            @click="handleSignOut"
            class="text-sm font-semibold leading-6 text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50">
            Sign out
          </button>
        </div>
      </nav>
    </header>
  </div>

  <RouterView />
</template>

<script setup>
import api from '@/services/api';
import { isLoggedIn } from '@/store/authState';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isAuthView = ref(false);
const router = useRouter();

// Pobieranie danych użytkownika
const getUser = async () => {
  try {
    const user = await api.getUser();
    if (user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  } catch (error) {
    console.error('Błąd pobierania użytkownika:', error);
    isLoggedIn.value = false;
  }
};

// Obsługa wylogowania
const handleSignOut = async () => {
  try {
    await api.logout();
    isLoggedIn.value = false;
    router.push('/');
  } catch (error) {
    console.error('Błąd wylogowania:', error);
  }
};

// Przekierowanie na profil użytkownika
const goToProfile = () => {
  router.push('/account');
};

// Sprawdzenie, czy użytkownik jest na stronie logowania/rejestracji
router.beforeEach((to, from, next) => {
  isAuthView.value = to.path === '/register' || to.path === '/sign-in';
  next();
});

onMounted(() => {
  getUser(); // Pobranie informacji o użytkowniku z API
});
</script>
