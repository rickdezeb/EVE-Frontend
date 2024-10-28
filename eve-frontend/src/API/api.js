const baseURL = "https://localhost:7213/api/";

const api = {

  get: (controller, endpoint = "") => 
    fetch(`${baseURL}${controller}${endpoint}`),

  post: (controller, body, endpoint = "") =>
    fetch(`${baseURL}${controller}${endpoint}`, {
      method: "POST",
      body: body,
    }),

  put: (controller, body, endpoint = "") =>
    fetch(`${baseURL}${controller}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
    }),

  delete: (controller, id) =>
    fetch(`${baseURL}${controller}/${id}`, {
      method: "DELETE",
    }),
};

export { api };
