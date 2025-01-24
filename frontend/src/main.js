import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './router';

import api from '@/services/api'; // Import API backendu

const app = createApp(App);

// Ustawienie routera
app.use(router);

// Dodanie API jako globalnego obiektu (można używać `this.$api` w komponentach)
app.config.globalProperties.$api = api;

app.mount('#app');
