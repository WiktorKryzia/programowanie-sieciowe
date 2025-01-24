<template>
  <div class="max-w-xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">Formularz informacji</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="age" class="block text-sm font-medium text-gray-700">Wiek:</label>
        <input
          type="number"
          id="age"
          v-model="formData.age"
          @input="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="gender" class="block text-sm font-medium text-gray-700">Płeć:</label>
        <select
          id="gender"
          v-model="formData.gender"
          @change="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full">
          <option value="male">Mężczyzna</option>
          <option value="female">Kobieta</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="weight" class="block text-sm font-medium text-gray-700">Waga (kg):</label>
        <input
          type="number"
          id="weight"
          v-model="formData.weight"
          @input="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="height" class="block text-sm font-medium text-gray-700">Wzrost (cm):</label>
        <input
          type="number"
          id="height"
          v-model="formData.height"
          @input="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="activity" class="block text-sm font-medium text-gray-700">Aktywność w tygodniu:</label>
        <select
          id="activity"
          v-model="formData.activity"
          @change="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full">
          <option value="1">1 raz</option>
          <option value="3">3 razy</option>
          <option value="5">5 razy</option>
          <option value="7">7 razy</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="caloricGoal" class="block text-sm font-medium text-gray-700">Cel kaloryczny:</label>
        <input
          type="number"
          id="caloricGoal"
          v-model="formData.caloricGoal"
          @input="calculateCaloriesAndNutrients"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="protein" class="block text-sm font-medium text-gray-700">Białko (g):</label>
        <input
          type="number"
          id="protein"
          v-model="formData.protein"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="carbohydrates" class="block text-sm font-medium text-gray-700">Węglowodany (g):</label>
        <input
          type="number"
          id="carbohydrates"
          v-model="formData.carbohydrates"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mb-4">
        <label for="fat" class="block text-sm font-medium text-gray-700">Tłuszcz (g):</label>
        <input
          type="number"
          id="fat"
          v-model="formData.fat"
          class="mt-1 p-2 border border-gray-300 rounded-md w-full" />
      </div>
      <div class="mt-6">
        <button
          type="submit"
          :disabled="!isFormFilled()"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Zapisz
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const formData = ref({
  age: '',
  gender: '',
  weight: '',
  height: '',
  caloricGoal: '',
  activity: '',
  protein: '',
  carbohydrates: '',
  fat: '',
});

const router = useRouter();

const fetchData = async () => {
  try {
    const data = await api.getInfo();
    if (data) {
      formData.value.age = data.age;
      formData.value.gender = data.gender;
      formData.value.weight = data.weight;
      formData.value.height = data.height;
      formData.value.activity = data.activity;
      formData.value.protein = data.protein;
      formData.value.carbohydrates = data.carbohydrates;
      formData.value.fat = data.fat;

      // Sprawdź, czy wartość kalorii została pobrana z bazy danych
      if (typeof data.caloricGoal !== 'undefined') {
        formData.value.caloricGoal = data.caloricGoal;
      } else {
        formData.value.caloricGoal = ''; // Ustaw puste pole, jeśli brak danych
      }
      calculateCaloriesAndNutrients(); // Dodaj to wywołanie
    }
  } catch (error) {
    console.error('Błąd podczas pobierania info:', error.message);
  }
};

onMounted(() => {
  fetchData();
});

const submitForm = async () => {
  try {
    if (isFormFilled()) {
      try {
        await api.setInfo(formData.value);
        router.push('/account');
      } catch (error) {
        console.error('Błąd podczas ustawiania info:', error.message);
      }
    } else {
      console.error('Form is not filled');
    }
  } catch (error) {
    console.error('Error adding/updating document: ', error);
  }
};

const isFormFilled = () => {
  return (
    formData.value.age !== '' &&
    formData.value.gender !== '' &&
    formData.value.weight !== '' &&
    formData.value.height !== '' &&
    formData.value.caloricGoal !== '' &&
    formData.value.activity !== ''
  );
};

const calculateCaloriesAndNutrients = () => {
  const { age, gender, weight, height, activity, caloricGoal } = formData.value;
  let bmr = 0;

  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else if (gender === 'female') {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  let activityFactor = 0;
  switch (activity) {
    case '1':
      activityFactor = 1.2;
      break;
    case '3':
      activityFactor = 1.375;
      break;
    case '5':
      activityFactor = 1.55;
      break;
    case '7':
      activityFactor = 1.725;
      break;
    default:
      activityFactor = 1.2;
  }

  const maintenanceCalories = bmr * activityFactor;
  formData.value.caloricGoal = Math.round(maintenanceCalories);

  // Obliczanie zalecanego spożycia białek, węglowodanów i tłuszczów
  const proteinPercentage = 0.2; // 20% kalorii z białek
  const carbohydratesPercentage = 0.5; // 50% kalorii z węglowodanów
  const fatPercentage = 0.3; // 30% kalorii z tłuszczów

  const proteinCalories = caloricGoal * proteinPercentage;
  const carbohydratesCalories = caloricGoal * carbohydratesPercentage;
  const fatCalories = caloricGoal * fatPercentage;

  formData.value.protein = Math.round(proteinCalories / 4); // 1 g białka = 4 kcal
  formData.value.carbohydrates = Math.round(carbohydratesCalories / 4); // 1 g węglowodanów = 4 kcal
  formData.value.fat = Math.round(fatCalories / 9); // 1 g tłuszczu = 9 kcal
};
</script>
