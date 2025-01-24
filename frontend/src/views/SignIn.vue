<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <!-- Link powrotu -->
    <div class="mt-4">
      <router-link to="/" class="text-lime-500 hover:text-indigo-500 font-semibold">Wstecz</router-link>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="@/assets/images/InFitLogo.png"
        alt="Logo" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Zaloguj się</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900">Adres e-mail</label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              type="email"
              required
              class="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-900">Hasło</label>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <!-- Komunikat o błędzie -->
        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-lime-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
            {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api'; // Import API backendu
import { isLoggedIn } from '@/store/authState';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    // Wysyłamy żądanie do backendu
    await api.login(email.value, password.value);

    isLoggedIn.value = true;

    // Po poprawnym logowaniu przekierowujemy użytkownika do dziennika
    router.push('/feed');
  } catch (error) {
    console.error('Błąd logowania:', error);
    errorMessage.value = error.message || 'Nie udało się zalogować. Spróbuj ponownie.';
  } finally {
    loading.value = false;
  }
};
</script>
