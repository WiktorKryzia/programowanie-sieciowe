<template>
  <div class="mt-4">
    <router-link
      to="/products"
      class="text-lime-500 hover:text-indigo-500 font-semibold"
      >Wstecz</router-link
    >
  </div>

  <div v-if="product" class="max-w-3xl mx-auto">
    <div class="flex justify-center">
      <h1 class="text-4xl font-bold text-center py-6">{{ product.name }}</h1>
    </div>
    <div class="flex justify-center mb-6">
      <div class="rounded-lg overflow-hidden shadow-md">
        <img
          :src="product.imageURL"
          alt="Product Image"
          class="object-cover w-48 h-48"
        />
      </div>
    </div>
    <div class="mt-6">
      <table class="mx-auto border border-gray-300">
        <tr>
          <th class="px-4 py-2 border border-gray-300">Właściwość</th>
          <th class="px-4 py-2 border border-gray-300">Wartość</th>
        </tr>
        <tr>
          <td class="px-4 py-2 border border-gray-300">Carbs</td>
          <td class="px-4 py-2 border border-gray-300">{{ product.carbs }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 border border-gray-300">Fat</td>
          <td class="px-4 py-2 border border-gray-300">{{ product.fat }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 border border-gray-300">Grams</td>
          <td class="px-4 py-2 border border-gray-300">{{ product.grams }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 border border-gray-300">Kcal</td>
          <td class="px-4 py-2 border border-gray-300">{{ product.kcal }}</td>
        </tr>
        <tr>
          <td class="px-4 py-2 border border-gray-300">Protein</td>
          <td class="px-4 py-2 border border-gray-300">
            {{ product.protein }}
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div v-else class="text-center">
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api"; // Import API

const product = ref(null);
const errorMessage = ref("");
const route = useRoute();
const id = ref(route.params.id);

onMounted(async () => {
  try {
    product.value = await api.getProductById(id.value);
  } catch (error) {
    errorMessage.value = "Nie udało się pobrać produktu.";
    console.error("Błąd pobierania produktu:", error);
  }
});
</script>
