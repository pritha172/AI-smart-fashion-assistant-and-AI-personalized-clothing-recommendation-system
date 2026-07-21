const API_BASE_URL = "http://127.0.0.1:8000";

const API = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error!`);
    return await response.json();
  },

  async post(endpoint, data, options = {}) {
    const headers = options.headers || {};
    let body = data;

    if (!(data instanceof FormData) && typeof data === "object") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: body
    });

    if (!response.ok) throw new Error(`HTTP error!`);
    return await response.json();
  }
};