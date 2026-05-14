export const BASE_URL = "https://plotvista-backend-7k5o.onrender.com";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false,
) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
    };

    // ONLY FOR JSON
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,

      body: body ? (isFormData ? body : JSON.stringify(body)) : null,
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Server error",
    };
  }
};
