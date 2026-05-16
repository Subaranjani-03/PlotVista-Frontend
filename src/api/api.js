export const BASE_URL = "https://plotvista-backend-7k5o.onrender.com";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  try {
    const token = localStorage.getItem("token");

    const options = {
      method,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };

    // ADD CONTENT-TYPE ONLY FOR JSON
    if (!isFormData) {
      options.headers["Content-Type"] = "application/json";
    }

    // ADD BODY
    if (body) {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);

    return {
      status: false,
      message: "Server error",
    };
  }
};