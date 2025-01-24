
const AUTH_BASE_URL = 'http://localhost:8080';
const CDN_BASE_URL = 'http://localhost:8081';
const CMS_BASE_URL = 'http://localhost:8082';
const MAIN_BASE_URL = 'http://localhost:8083';

const api = {
  async register(email, password) {
    const response = await fetch(`${AUTH_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 400) {
        const res = await response.json();
        if ('message' in res) {
          throw new Error(res.message);
        }
      }
      throw new Error(`Błąd rejestracji: ${response.statusText}`);
    }
    return response.json();
  },

  async login(email, password) {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 400) {
        const res = await response.json();
        if ('code' in res) {
          throw new Error('Niepoprawny login lub hasło');
        }
      }
      throw new Error(`Błąd logowania: ${response.statusText}`);
    }
  },

  async logout() {
    const response = await fetch(`${AUTH_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to log out: ${response.statusText}`);
    }
  },

  async getUser() {
    const response = await fetch(`${AUTH_BASE_URL}/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
  },

  async getAbout() {
    const response = await fetch(`${MAIN_BASE_URL}/about`);

    if (!response.ok) {
      throw new Error(`Failed to fetch about: ${response.statusText}`);
    }
    return response.json();
  },

  async getInfo() {
    const response = await fetch(`${MAIN_BASE_URL}/info`, { credentials: 'include' });

    if (!response.ok) {
      throw new Error(`Failed to fetch info: ${response.statusText}`);
    }
    return response.json();
  },

  async setInfo(data) {
    const response = await fetch(`${MAIN_BASE_URL}/info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to set info: ${response.statusText}`);
    }
  },

  async getPosts() {
    const response = await fetch(`${CMS_BASE_URL}/posts`);

    if (!response.ok) {
      throw new Error(`Failed to fetch about: ${response.statusText}`);
    }

    return response.json();
  },

  async addPost(data) {
    const response = await fetch(`${CMS_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about: ${response.statusText}`);
    }
    return response.json();
  },

  async getProducts() {
    const response = await fetch(`${MAIN_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    data.forEach((d) => {
      d.imageURL = replaceURLToMicroservice(d.imageURL) ?? d.imageURL;
    });

    return data;
  },

  async getProductById(id) {
    const response = await fetch(`${MAIN_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    data.imageURL = replaceURLToMicroservice(data.imageURL) ?? data.imageURL;

    return data;
  },

  async getFeed(date, mealType) {
    const response = await fetch(`${MAIN_BASE_URL}/feed?date=${date}&meal-type=${mealType}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch meal products: ${response.statusText}`);
    }
    return response.json();
  },

  async updateFeed(date, mealType, productData) {
    const response = await fetch(`${MAIN_BASE_URL}/feed?date=${date}&meal-type=${mealType}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to add product: ${response.statusText}`);
    }
  }
};

function replaceURLToMicroservice(url) {
  const regex = /%2F(.+)\?alt/;
  const match = url.match(regex);

  return match ? `${CDN_BASE_URL}/images/${match[1]}` : null;
}

export default api;
