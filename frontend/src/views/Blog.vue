<template>
  <div class="flex justify-center"></div>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">InFit blog</h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">Porady żywieniowe ekspertów</p>
      </div>
      <!-- Sekcja z postami -->
      <div
        class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="post in posts" :key="post.id" class="post-card">
          <div class="flex items-center gap-x-4 text-xs">
            <time :datetime="post.datetime" class="text-gray-500">{{ post.date }}</time>
            <a
              :href="post.category.href"
              class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
              >{{ post.category }}</a
            >
          </div>
          <div class="group relative">
            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <a>
                <span class="absolute inset-0"></span>
                {{ post.title }}
              </a>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              {{ post.description }}
            </p>
          </div>
          <div class="relative mt-8 flex items-center gap-x-4">
            <div class="text-sm leading-6">
              <p class="font-semibold text-gray-900">
                <a>
                  <span class="absolute inset-0"></span>
                  {{ post.name }}
                </a>
              </p>
              <p class="text-gray-600">{{ post.role }}</p>
            </div>
          </div>
        </article>
      </div>
      <!-- Przycisk dodania posta i formularz -->
      <div class="mt-10 flex flex-col items-center">
        <button
          v-if="isLoggedIn && !showForm"
          @click="addNewPost"
          class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300">
          Dodaj post
        </button>
        <div v-if="showForm" class="mt-4 p-4 bg-white shadow-lg rounded w-full max-w-2xl">
          <!-- Formularz dodawania posta -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Tytuł:</label>
            <input
              type="text"
              id="title"
              v-model="newPost.title"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Opis:</label>
            <textarea
              id="description"
              v-model="newPost.description"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700">Kategoria:</label>
            <input
              type="text"
              id="category"
              v-model="newPost.category"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Imię:</label>
            <input
              type="text"
              id="name"
              v-model="newPost.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="mb-4">
            <div class="mb-4">
              <label for="role" class="block text-sm font-medium text-gray-700">Rola:</label>
              <input
                type="text"
                id="role"
                v-model="newPost.role"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div class="flex justify-between">
            <button
              @click="submitPost"
              class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-700 transition duration-300">
              Zapisz post
            </button>
            <button
              @click="addNewPost"
              class="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-700 transition duration-300">
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { isLoggedIn } from '@/store/authState';
import { onMounted, ref } from 'vue';

const posts = ref([]);
const showForm = ref(false);
// Rozszerzona definicja nowego posta o dodatkowe wymagane pola
const newPost = ref({
  title: '',
  description: '',
  category: '',
  name: '',
  role: '',
});

onMounted(async () => {
  try {
    posts.value = await api.getPosts();
  } catch (error) {
    console.error('Błąd podczas pobierania postów:', error.message);
  }
});

const addNewPost = () => {
  showForm.value = !showForm.value;
};

const submitPost = async () => {
  if (
    !newPost.value.title.trim() ||
    !newPost.value.description.trim() ||
    !newPost.value.category.trim() ||
    !newPost.value.name.trim() ||
    !newPost.value.role.trim()
  ) {
    alert('Proszę wypełnić wszystkie pola.');
    return;
  }
  try {
    const date = new Date().toISOString().split('T')[0];
    const response = await api.addPost({ ...newPost.value, date });
    posts.value.push({ ...newPost.value, date, id: response.id });
    newPost.value = {
      title: '',
      description: '',
      category: '',
      name: '',
      role: '',
    };
    showForm.value = false;
    alert('Post dodany pomyślnie.');
  } catch (error) {
    console.error('Błąd podczas dodawania posta:', error.message);
    alert('Nie udało się dodać posta.');
  }
};
</script>

<style scoped>
.post-card {
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
