<template>
  <div class="max-w-xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4 text-center">Twoje konto</h1>
    <div v-if="userData">
      <p><strong>Wiek:</strong> {{ userData.age }}</p>
      <p><strong>Płeć:</strong> {{ userData.gender }}</p>
      <p><strong>Waga:</strong> {{ userData.weight }} kg</p>
      <p><strong>Wzrost:</strong> {{ userData.height }} cm</p>
      <p><strong>Aktywność w tygodniu:</strong> {{ userData.activity }}</p>
      <p><strong>Cel kaloryczny:</strong> {{ userData.caloricGoal }}</p>
    </div>
    <button
      @click="redirectToInfo"
      class="mt-4 mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 block">
      Zmień dane
    </button>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userData = ref(null);

const redirectToInfo = () => {
  router.push('/info');
};

const fetchData = async () => {
  try {
    const response = await api.getInfo();
    userData.value = response;
  } catch (error) {
    console.error('Błąd podczas pobierania danych użytkownika:', error.message);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.button-center {
  text-align: center;
}
</style>
