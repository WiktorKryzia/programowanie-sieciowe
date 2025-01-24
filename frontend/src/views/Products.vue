<template>
  <div>
    <!-- Products -->
    <div class="flex justify-center">
      <header class="text-4xl font-bold text-center py-6">Products</header>
    </div>

    <div class="flex justify-center mb-4">
      <input
        type="text"
        v-model="searchQuery"
        @input="updateFilteredProducts"
        placeholder="Search products..."
        class="border border-gray-300 rounded px-4 py-2"
      />
    </div>

    <div class="flex flex-wrap justify-center">
      <router-link
        v-for="product in filteredProducts"
        :key="product.id"
        :to="{ name: 'ProductDetails', params: { id: product.id } }"
      >
        <div
          class="max-w-sm rounded overflow-hidden shadow-lg border-black m-4"
        >
          <div class="px-6 py-4 flex flex-col items-center">
            <div class="font-bold text-xl mb-2 text-center">
              {{ product.id }}
            </div>
            <img
              :src="product.imageURL"
              alt="Product Image"
              class="w-24 h-24 mb-4"
            />
            <p class="text-gray-700 text-base text-center">
              Grams: {{ product.grams }}g <br />
              Kcal: {{ product.kcal }} <br />
            </p>
          </div>
        </div>
      </router-link>
    </div>

    <div v-if="errorMessage" class="text-center text-red-500 mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import api from "@/services/api"; // Importujemy API
import { onMounted, ref } from "vue";

const products = ref([]);
const filteredProducts = ref([]);
const searchQuery = ref("");
const errorMessage = ref("");

onMounted(async () => {
  try {
    products.value = await api.getProducts(); // Pobieramy produkty z API
    updateFilteredProducts();
  } catch (error) {
    errorMessage.value = "Nie udało się pobrać produktów.";
    console.error("Błąd pobierania produktów:", error);
  }
});

const updateFilteredProducts = () => {
  if (!searchQuery.value) {
    filteredProducts.value = products.value;
  } else {
    const searchTerm = searchQuery.value.toLowerCase().trim();
    filteredProducts.value = products.value.filter((product) =>
      product.id.toLowerCase().includes(searchTerm)
    );
  }
};
</script>
