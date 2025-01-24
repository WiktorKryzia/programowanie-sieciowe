<template>
  <div class="calendar">
    <div class="header">
      <button @click="previousMonth">&lt;</button>
      <h2>{{ currentMonth }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="days">
      <div v-for="date in dates" :key="date.day" @click="selectDate(date)" :class="{ active: isSelected(date) }">
        {{ date.day }}
      </div>
    </div>
    <div class="selected-date">Wybrana data: {{ wybData }}</div>
  </div>
  <div class="card">
    <h2 class="section-header">ŚNIADANIE</h2>
    <div class="meal-summary">
      {{ breakfastSummary.kcal }} kcal, {{ breakfastSummary.protein }} g białka, {{ breakfastSummary.fat }} g tłuszczu,
      {{ breakfastSummary.carbs }} g węglowodanów
    </div>
    <hr class="section-divider" />
    <ul>
      <li v-for="(product, index) in breakfastProducts" :key="product.productId" class="list-item">
        {{ product.productId }} - {{ product.totalKcal }} kcal - {{ product.quantity }} szt.
        <button @click="removeProduct('breakfast', index)" class="remove-btn">Usuń</button>
      </li>
    </ul>
    <hr class="section-divider" />
    <div class="input-group">
      <select v-model="selectedProductBreakfast" class="select-full-width">
        <option disabled value="">{{ 'Wybierz produkt' }}</option>
        <option v-for="product in products" :value="product.id">{{ product.id }}</option>
      </select>
      <input type="number" v-model.number="productQuantityBreakfast" min="1" class="quantity-input" />
      <button @click="addProduct('breakfast', selectedProductBreakfast, productQuantityBreakfast)" class="add-btn">
        Dodaj produkt
      </button>
    </div>
  </div>
  <div class="card">
    <h2 class="section-header">OBIAD</h2>
    <div class="meal-summary">
      {{ lunchSummary.kcal }} kcal, {{ lunchSummary.protein }} g białka, {{ lunchSummary.fat }} g tłuszczu,
      {{ lunchSummary.carbs }} g węglowodanów
    </div>
    <hr class="section-divider" />
    <ul>
      <li v-for="product in selectedDateProducts('lunch')" :key="product.productId" class="list-item">
        {{ product.productId }} - {{ product.totalKcal }} kcal - {{ product.quantity }} szt.
        <button @click="removeProduct('lunch', index)" class="remove-btn">Usuń</button>
      </li>
    </ul>
    <hr class="section-divider" />
    <div class="input-group">
      <select v-model="selectedProductLunch" class="select-full-width">
        <option disabled value="">{{ 'Wybierz produkt' }}</option>
        <option v-for="product in products" :value="product.id">{{ product.id }}</option>
      </select>
      <input type="number" v-model.number="productQuantityLunch" min="1" class="quantity-input" />
      <button @click="addProduct('lunch', selectedProductLunch, productQuantityLunch)" class="add-btn">
        Dodaj produkt
      </button>
    </div>
  </div>
  <div class="card">
    <h2 class="section-header">KOLACJA</h2>
    <div class="meal-summary">
      {{ dinnerSummary.kcal }} kcal, {{ dinnerSummary.protein }} g białka, {{ dinnerSummary.fat }} g tłuszczu,
      {{ dinnerSummary.carbs }} g węglowodanów
    </div>
    <hr class="section-divider" />
    <ul>
      <li v-for="product in selectedDateProducts('dinner')" :key="product.productId" class="list-item">
        {{ product.productId }} - {{ product.totalKcal }} kcal - {{ product.quantity }} szt.
        <button @click="removeProduct('dinner', index)" class="remove-btn">Usuń</button>
      </li>
    </ul>
    <hr class="section-divider" />
    <div class="input-group">
      <select v-model="selectedProductDinner" class="select-full-width">
        <option disabled value="">{{ 'Wybierz produkt' }}</option>
        <option v-for="product in products" :value="product.id">{{ product.id }}</option>
      </select>
      <input type="number" v-model.number="productQuantityDinner" min="1" class="quantity-input" />
      <button @click="addProduct('dinner', selectedProductDinner, productQuantityDinner)" class="add-btn">
        Dodaj produkt
      </button>
    </div>
  </div>
  <div>
    <h2 class="section-header">Podsumowanie Dzienne:</h2>
    <div class="progress-container">
      <p>Kalorie: {{ totalDailyNutrition.kcal }} / {{ nutritionalGoals.caloricGoal }} kcal</p>
      <div
        class="progress-bar"
        :style="{
          width: (kcalProgress <= 100 ? kcalProgress : 100) + '%',
          backgroundColor: kcalProgress > 100 ? '#f44336' : '#4CAF50',
        }">
        {{ kcalProgress.toFixed(0) }}%
      </div>
    </div>
    <div class="progress-container">
      <p>Białko: {{ totalDailyNutrition.protein }} / {{ nutritionalGoals.protein }} g</p>
      <div
        class="progress-bar"
        :style="{
          width: (proteinProgress <= 100 ? proteinProgress : 100) + '%',
          backgroundColor: proteinProgress > 100 ? '#f44336' : '#4CAF50',
        }">
        {{ proteinProgress.toFixed(0) }}%
      </div>
    </div>
    <div class="progress-container">
      <p>Tłuszcz: {{ totalDailyNutrition.fat }} / {{ nutritionalGoals.fat }} g</p>
      <div
        class="progress-bar"
        :style="{
          width: (fatProgress <= 100 ? fatProgress : 100) + '%',
          backgroundColor: fatProgress > 100 ? '#f44336' : '#4CAF50',
        }">
        {{ fatProgress.toFixed(0) }}%
      </div>
    </div>
    <div class="progress-container">
      <p>Węglowodany: {{ totalDailyNutrition.carbs }} / {{ nutritionalGoals.carbohydrates }} g</p>
      <div
        class="progress-bar"
        :style="{
          width: (carbsProgress <= 100 ? carbsProgress : 100) + '%',
          backgroundColor: carbsProgress > 100 ? '#f44336' : '#4CAF50',
        }">
        {{ carbsProgress.toFixed(0) }}%
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'Calendar',
  setup() {
    const nutritionalGoals = ref({ caloricGoal: 0, protein: 0, fat: 0, carbohydrates: 0 });

    // Progres jako procent osiągnięcia celu
    const kcalProgress = computed(() => (totalDailyNutrition.value.kcal / nutritionalGoals.value.caloricGoal) * 100);
    const proteinProgress = computed(() => (totalDailyNutrition.value.protein / nutritionalGoals.value.protein) * 100);
    const fatProgress = computed(() => (totalDailyNutrition.value.fat / nutritionalGoals.value.fat) * 100);
    const carbsProgress = computed(
      () => (totalDailyNutrition.value.carbs / nutritionalGoals.value.carbohydrates) * 100
    );

    const fetchData = async () => {
      const data = await api.getInfo();
      if (data) {
        nutritionalGoals.value = data;
        console.log('Cel żywieniowy: ', nutritionalGoals.value);
      } else {
        console.log('Brak danych dla użytkownika');
      }
    };

    onMounted(() => {
      fetchData();
    });

    const calculateMealSummaries = (mealProducts) => {
      return mealProducts.reduce(
        (acc, product) => {
          acc.kcal += product.totalKcal || 0;
          acc.protein += product.protein || 0;
          acc.fat += product.fat || 0;
          acc.carbs += product.carbs || 0;
          return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
      );
    };

    const breakfastSummary = computed(() => calculateMealSummaries(breakfastProducts.value));
    const lunchSummary = computed(() => calculateMealSummaries(lunchProducts.value));
    const dinnerSummary = computed(() => calculateMealSummaries(dinnerProducts.value));

    // Obliczanie sumy wszystkich posiłków
    const totalDailyNutrition = computed(() => {
      return {
        kcal: breakfastSummary.value.kcal + lunchSummary.value.kcal + dinnerSummary.value.kcal,
        protein: breakfastSummary.value.protein + lunchSummary.value.protein + dinnerSummary.value.protein,
        fat: breakfastSummary.value.fat + lunchSummary.value.fat + dinnerSummary.value.fat,
        carbs: breakfastSummary.value.carbs + lunchSummary.value.carbs + dinnerSummary.value.carbs,
      };
    });

    const productQuantityBreakfast = ref(1);
    const productQuantityLunch = ref(1);
    const productQuantityDinner = ref(1);

    const products = ref([]);

    const currentDate = ref(new Date());
    const selectedDate = ref({
      day: currentDate.value.getDate(),
      month: currentDate.value.getMonth(),
      year: currentDate.value.getFullYear(),
    });

    const currentMonth = ref(currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }));
    const wybData = ref('');

    const generateDates = () => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const datesArray = [];
      for (let i = 1; i <= daysInMonth; i++) {
        datesArray.push({ day: i, month, year });
      }
      return datesArray;
    };

    const dates = ref([]);

    const isSelected = (date) => {
      if (!selectedDate.value) return false;
      return (
        selectedDate.value.day === date.day &&
        selectedDate.value.month === date.month &&
        selectedDate.value.year === date.year
      );
    };

    const selectDate = (date) => {
      selectedDate.value = date;
      wybData.value = `${date.year}-${date.month + 1}-${date.day}`;
      console.log('Selected Date:', wybData.value);
      fetchProducts(date);
    };

    const fetchProducts = async (date) => {
      const dateString = `${date.year}-${date.month + 1}-${date.day}`;

      const [breakfastSnap, lunchSnap, dinnerSnap] = await Promise.all([
        api.getFeed(dateString, 'breakfast'),
        api.getFeed(dateString, 'lunch'),
        api.getFeed(dateString, 'dinner'),
      ]);

      breakfastProducts.value = await enrichProductData(breakfastSnap);
      lunchProducts.value = await enrichProductData(lunchSnap);
      dinnerProducts.value = await enrichProductData(dinnerSnap);
    };

    const enrichProductData = async (snapshot) => {
      if (!snapshot) return [];
      let productsData = snapshot.eatenProducts || [];
      return Promise.all(
        productsData.map(async (product) => {
          try {
            const productDetails = await api.getProductById(product.productId);

            return {
              ...product,
              kcal: productDetails.kcal, // Calories per unit
              totalKcal: Math.round(product.quantity * (productDetails.kcal || 0)), // Total calories rounded
              protein: Math.round(product.quantity * (productDetails.protein || 0)), // Total protein rounded
              fat: Math.round(product.quantity * (productDetails.fat || 0)), // Total fat rounded
              carbs: Math.round(product.quantity * (productDetails.carbs || 0)), // Total carbohydrates rounded
              name: productDetails.name,
            };
          } catch (error) {
            return null;
          }
        })
      );
    };

    const fetchProductsList = async () => {
      products.value = await api.getProducts();
    };

    onMounted(async () => {
      await fetchProductsList();
      fetchProducts(selectedDate.value); // Wczytaj produkty dla wybranej daty, jeśli to konieczne
    });

    const addProduct = async (mealType, productId, quantity) => {
      if (!productId || quantity === undefined || quantity < 1) {
        console.error('Product ID or quantity is undefined or invalid');
        return;
      }

      const productToAdd = products.value.find((p) => p.id === productId);
      if (!productToAdd) {
        console.error('Product not found');
        return;
      }

      const dateString = `${selectedDate.value.year}-${selectedDate.value.month + 1}-${selectedDate.value.day}`;

      const docSnap = await api.getFeed(dateString, mealType);
      let data = {};

      if (docSnap) {
        data = docSnap;
        let existingProduct = data.eatenProducts.find((p) => p.productId === productId);
        if (existingProduct) {
          existingProduct.quantity += quantity; // Update existing quantity
        } else {
          data.eatenProducts.push({ productId: productToAdd.id, quantity }); // Add new product
        }
      } else {
        data = { eatenProducts: [{ productId: productToAdd.id, quantity }] }; // Create new entry if none exists
      }

      await api.updateFeed(dateString, mealType, data);
      fetchProducts(selectedDate.value);
    };

    const removeProduct = async (mealType, productIndex) => {
      try {
        const dateString = `${selectedDate.value.year}-${selectedDate.value.month + 1}-${selectedDate.value.day}`;

        const docSnap = await api.getFeed(dateString, mealType);

        if (docSnap) {
          let products = docSnap.eatenProducts || [];
          products.splice(productIndex, 1);

          await api.updateFeed(dateString, mealType, { eatenProducts: products });
          fetchProducts(selectedDate.value);
        }
      } catch (error) {
        console.error('Failed to remove product:', error);
      }
    };

    const selectedDateProducts = (mealType) => {
      switch (mealType) {
        case 'breakfast':
          return breakfastProducts.value;
        case 'lunch':
          return lunchProducts.value;
        case 'dinner':
          return dinnerProducts.value;
        default:
          return [];
      }
    };

    const breakfastProducts = ref([]);
    const lunchProducts = ref([]);
    const dinnerProducts = ref([]);

    const previousMonth = () => {
      currentDate.value.setMonth(currentDate.value.getMonth() - 1);
      dates.value = generateDates();
      currentMonth.value = currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
      fetchProducts(selectedDate.value); // Dodaj tę linię
    };

    const nextMonth = () => {
      currentDate.value.setMonth(currentDate.value.getMonth() + 1);
      dates.value = generateDates();
      currentMonth.value = currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
      fetchProducts(selectedDate.value); // Dodaj tę linię
    };

    wybData.value = `${currentDate.value.getFullYear()}-${
      currentDate.value.getMonth() + 1
    }-${currentDate.value.getDate()}`;
    dates.value = generateDates();
    fetchProducts(selectedDate.value); // Dodaj tę linię

    return {
      currentMonth,
      dates,
      selectDate,
      isSelected,
      previousMonth,
      nextMonth,
      wybData,
      addProduct,
      breakfastProducts,
      lunchProducts,
      dinnerProducts,
      selectedDateProducts,
      products,
      removeProduct,
      productQuantityBreakfast,
      productQuantityLunch,
      productQuantityDinner,
      breakfastSummary,
      lunchSummary,
      dinnerSummary,
      kcalProgress,
      proteinProgress,
      fatProgress,
      carbsProgress,
      totalDailyNutrition,
      nutritionalGoals,
    };
  },
};
</script>

<style>
.calendar {
  width: 500px;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.days div {
  padding: 5px;
  text-align: center;
  cursor: pointer;
}

.days div.active {
  background-color: lightblue;
}

.card {
  width: 500px; /* Szerokość karty */
  margin: 0 auto; /* Wyśrodkowanie karty */
  border: 1px solid #ccc; /* Ramka karty */
  padding: 20px; /* Wypełnienie wewnątrz karty */
  border-radius: 5px; /* Zaokrąglenie rogów karty */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Cień */
  margin-bottom: 20px;
  margin-top: 20px;
}

.select-full-width {
  width: 100%; /* Ustawia szerokość na 100% dostępnej przestrzeni */
  padding: 8px; /* Dodaje padding dla lepszego wyglądu */
  box-sizing: border-box; /* Zapewnia, że padding i border są wliczone w szerokość */
  margin-top: 10px; /* Dodaje górny margines */
  border: 2px solid #ccc; /* Dodaje obramówkę o grubości 2px i kolorze szarym */
  border-radius: 4px; /* Dodaje lekko zaokrąglone rogi */
  flex-grow: 1; /* Pozwala <select> rozciągnąć się, aby zająć dostępną przestrzeń */
  margin-right: 10px; /* Dodaje margines po prawej stronie, aby oddzielić od <input> */
  box-sizing: border-box; /* Zapewnia, że padding i border są wliczone w szerokość */
  height: 40px; /* Ustawia wysokość na 40px dla jednolitości */
}

.quantity-input {
  width: 55px; /* Szerokość pola liczbowego */
  padding: 8px; /* Padding dla wygodniejszego wprowadzania */
  margin-left: 10px; /* Odstęp od listy rozwijanej */
  margin-right: 10px; /* Odstęp przed przyciskiem */
  border: 2px solid #ccc; /* Dodaje obramówkę o grubości 2px i kolorze szarym */
  border-radius: 4px; /* Dodaje lekko zaokrąglone rogi */
  box-sizing: border-box; /* Zapewnia, że padding i border są wliczone w szerokość */
  height: 40px; /* Ustawia wysokość na 40px dla jednolitości */
}

.input-group {
  display: flex; /* Ustawia kontener na flexbox */
  align-items: center; /* Wycentrowuje elementy wertykalnie */
  margin-top: 10px; /* Dodaje margines na górze dla odstępu od listy produktów */
}

.selected-date {
  text-align: center; /* Wyśrodkowanie tekstu */
  font-weight: bold; /* Pogrubienie tekstu */
  margin-top: 20px; /* Dodatkowy margines na górze dla lepszego odstępu */
  font-size: 1.2em; /* Nieco większa czcionka dla lepszej widoczności */
}

.section-header {
  text-align: center; /* Wyśrodkowanie tekstu */
  font-weight: bold; /* Pogrubienie tekstu */
  margin-top: 20px; /* Dodatkowy margines na górze dla lepszego odstępu */
  font-size: 1.2em; /* Nieco większa czcionka dla lepszej widoczności */
}

.add-btn {
  background-color: #4caf50; /* Zielony */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.remove-btn {
  background-color: #f44336; /* Czerwony */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}
.list-item {
  display: flex;
  justify-content: space-between; /* Rozciąga elementy na całą szerokość kontenera */
  align-items: center; /* Wycentrowuje elementy wertykalnie */
  padding: 5px;
}

.meal-summary {
  text-align: center;
  color: #666; /* Dark gray for text color for subtlety */
  font-size: 1em; /* Slightly smaller font size than the header */
  margin-bottom: 10px; /* Space below the summary before the list */
}

.progress-container {
  width: 90%;
  background-color: #ddd;
  border-radius: 5px;
  margin: 10px auto;
}

.progress-bar {
  height: 20px;
  background-color: #4caf50;
  text-align: center;
  color: white;
  border-radius: 5px;
  transition: width 0.3s ease;
}
</style>
